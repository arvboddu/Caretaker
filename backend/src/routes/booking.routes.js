const { Router } = require('express');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { ApiError } = require('../utils/errors');
const { bookingValidation } = require('../utils/validators');

const router = Router();

router.post('/', authMiddleware, validate(bookingValidation), async (req, res, next) => {
  try {
    const { caretakerId, date, startTime, duration, serviceNotes, address, specialInstructions } = req.body;
    const userId = req.user.userId;

    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!patient) {
      throw new ApiError(400, 'Patient profile not found');
    }

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select('id, hourly_rate')
      .eq('id', caretakerId)
      .single();

    if (!caretaker) {
      throw new ApiError(404, 'Caretaker not found');
    }

    const endTime = `${String(parseInt(startTime.split(':')[0]) + duration).padStart(2, '0')}:00`;

    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('caretaker_id', caretakerId)
      .eq('date', date)
      .or(`start_time.lt.${endTime},end_time.gt.${startTime}`)
      .in('status', ['pending', 'accepted']);

    if (existingBooking?.length > 0) {
      throw new ApiError(409, 'Time slot conflict - caretaker is not available');
    }

    const totalAmount = caretaker.hourly_rate * duration;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        patient_id: patient.id,
        caretaker_id: caretakerId,
        date,
        start_time: startTime,
        end_time: endTime,
        duration,
        hourly_rate: caretaker.hourly_rate,
        total_amount: totalAmount,
        service_notes: serviceNotes,
        address,
        special_instructions: specialInstructions,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: {
        id: booking.id,
        patientId: booking.patient_id,
        caretakerId: booking.caretaker_id,
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        duration: booking.duration,
        hourlyRate: booking.hourly_rate,
        totalAmount: booking.total_amount,
        status: booking.status,
        serviceNotes: booking.service_notes,
        address: booking.address,
        createdAt: booking.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { status, role, limit = 20, offset = 0 } = req.query;
    const userId = req.user.userId;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        patient:patients(id, user_id, profile_photo, emergency_contact),
        caretaker:caretakers(id, user_id, hourly_rate, profile_photo)
      `)
      .order('date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (role === 'caretaker') {
      const { data: caretaker } = await supabase
        .from('caretakers')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (caretaker) {
        query = query.eq('caretaker_id', caretaker.id);
      }
    } else {
      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (patient) {
        query = query.eq('patient_id', patient.id);
      }
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: {
        bookings: bookings?.map(b => ({
          id: b.id,
          patientId: b.patient_id,
          caretakerId: b.caretaker_id,
          date: b.date,
          startTime: b.start_time,
          endTime: b.end_time,
          duration: b.duration,
          totalAmount: b.total_amount,
          status: b.status,
          serviceNotes: b.service_notes,
          address: b.address,
          caretaker: b.caretaker ? {
            id: b.caretaker.id,
            fullName: 'Caretaker',
            profilePhoto: b.caretaker.profile_photo
          } : null,
          patient: b.patient ? {
            id: b.patient.id,
            fullName: 'Patient',
            profilePhoto: b.patient.profile_photo
          } : null,
          createdAt: b.created_at
        })),
        total: bookings?.length || 0,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        patient:patients(*),
        caretaker:caretakers(*)
      `)
      .eq('id', id)
      .single();

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.user.userId;

    const validTransitions = {
      pending: ['accepted', 'declined', 'cancelled'],
      accepted: ['completed', 'cancelled'],
    };

    const { data: booking } = await supabase
      .from('bookings')
      .select('*, caretaker:caretakers(*)')
      .eq('id', id)
      .single();

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (status === 'cancelled') {
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_by: userId,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      if (!validTransitions[booking.status]?.includes(status)) {
        throw new ApiError(400, 'Invalid status transition');
      }

      const { error } = await supabaseAdmin
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    }

    res.json({
      success: true,
      data: { id, status, updatedAt: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
