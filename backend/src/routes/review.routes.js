const { Router } = require('express');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { ApiError } = require('../utils/errors');
const { reviewValidation } = require('../utils/validators');

const router = Router();

router.post('/', authMiddleware, validate(reviewValidation), async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user.userId;

    const { data: booking } = await supabase
      .from('bookings')
      .select('*, patient:patients(*)')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.status !== 'completed') {
      throw new ApiError(400, 'Can only review completed bookings');
    }

    if (booking.patient?.user_id !== userId) {
      throw new ApiError(403, 'Only the patient can review this booking');
    }

    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existing) {
      throw new ApiError(400, 'Review already submitted for this booking');
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        booking_id: bookingId,
        caretaker_id: booking.caretaker_id,
        patient_id: booking.patient_id,
        rating,
        comment
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: {
        id: review.id,
        bookingId: review.booking_id,
        caretakerId: review.caretaker_id,
        patientId: review.patient_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/caretaker/:caretakerId', async (req, res, next) => {
  try {
    const { caretakerId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select('rating, review_count')
      .eq('id', caretakerId)
      .single();

    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        *,
        patient:patients(user_id, profile_photo)
      `)
      .eq('caretaker_id', caretakerId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: users } = await supabase
      .from('users')
      .select('full_name')
      .in('id', reviews?.map(r => r.patient?.user_id) || []);

    const reviewsWithNames = reviews?.map((review, i) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      patient: {
        id: review.patient?.user_id,
        fullName: users?.[i]?.full_name?.split(' ')[0] + ' ' + (users?.[i]?.full_name?.split(' ')[1]?.[0] || '') + '.',
        profilePhoto: review.patient?.profile_photo
      },
      createdAt: review.created_at
    })) || [];

    res.json({
      success: true,
      data: {
        reviews: reviewsWithNames,
        averageRating: caretaker?.rating || 0,
        total: caretaker?.review_count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
