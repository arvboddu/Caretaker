const { Router } = require('express');
const { supabase } = require('../db/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');
const { ApiError } = require('../utils/errors');

const router = Router();

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { data: patient } = await supabase
      .from('patients')
      .select(`
        *,
        user:users(email, full_name)
      `)
      .eq('user_id', userId)
      .single();

    if (!patient) {
      throw new ApiError(404, 'Patient profile not found');
    }

    res.json({
      success: true,
      data: {
        id: patient.id,
        userId: patient.user_id,
        fullName: patient.user?.full_name,
        email: patient.user?.email,
        phone: patient.phone,
        address: patient.address,
        latitude: patient.latitude,
        longitude: patient.longitude,
        medicalConditions: patient.medical_conditions,
        requiredServices: patient.required_services,
        carePreferences: patient.care_preferences,
        emergencyContact: patient.emergency_contact,
        profilePhoto: patient.profile_photo,
        createdAt: patient.created_at,
        updatedAt: patient.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      phone,
      address,
      latitude,
      longitude,
      medicalConditions,
      requiredServices,
      carePreferences,
      emergencyContact
    } = req.body;

    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!patient) {
      throw new ApiError(404, 'Patient profile not found');
    }

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (medicalConditions !== undefined) updateData.medical_conditions = medicalConditions;
    if (requiredServices !== undefined) updateData.required_services = requiredServices;
    if (carePreferences !== undefined) updateData.care_preferences = carePreferences;
    if (emergencyContact !== undefined) updateData.emergency_contact = emergencyContact;

    const { error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', patient.id);

    if (error) throw error;

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
});

router.get('/recommendations', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 5, offset = 0 } = req.query;
    const userId = req.user.userId;

    const { data: patient } = await supabase
      .from('patients')
      .select('required_services, latitude, longitude')
      .eq('user_id', userId)
      .single();

    if (!patient) {
      throw new ApiError(404, 'Patient profile not found');
    }

    let query = supabase
      .from('caretakers')
      .select(`
        *,
        user:users(full_name),
        caretaker_skills(skill_id, skills(slug))
      `)
      .eq('status', 'verified')
      .order('rating', { ascending: false })
      .limit(parseInt(limit) * 2);

    const { data: caretakers } = await query;

    const filtered = (caretakers || [])
      .filter(c => {
        const hasMatchingSkill = !patient.required_services?.length ||
          c.caretaker_skills?.some(cs =>
            patient.required_services.includes(cs.skills?.slug)
          );
        return hasMatchingSkill;
      })
      .slice(0, parseInt(limit));

    const recommendations = filtered.map(c => ({
      id: c.id,
      fullName: c.user?.full_name,
      photo: c.profile_photo,
      rating: c.rating,
      reviewCount: c.review_count,
      hourlyRate: c.hourly_rate,
      skills: c.caretaker_skills?.map(cs => cs.skills?.slug) || [],
      distance: 5,
      availableToday: true
    }));

    res.json({
      success: true,
      data: {
        caretakers: recommendations,
        total: recommendations.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
