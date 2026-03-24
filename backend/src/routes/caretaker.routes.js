const { Router } = require('express');
const { supabase } = require('../db/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');
const { ApiError } = require('../utils/errors');

const router = Router();

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select(`
        *,
        user:users(email, full_name),
        caretaker_skills(skill_id, skills(name, slug)),
        certifications(id, name, document_url, status),
        availability(day_of_week, start_time, end_time)
      `)
      .eq('user_id', userId)
      .single();

    if (!caretaker) {
      throw new ApiError(404, 'Caretaker profile not found');
    }

    const availability = {};
    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day, i) => {
      const avail = caretaker.availability?.find(a => a.day_of_week === i);
      availability[day] = avail ? { start: avail.start_time, end: avail.end_time } : null;
    });

    res.json({
      success: true,
      data: {
        id: caretaker.id,
        userId: caretaker.user_id,
        email: caretaker.user?.email,
        fullName: caretaker.user?.full_name,
        phone: caretaker.phone,
        bio: caretaker.bio,
        skills: caretaker.caretaker_skills?.map(cs => ({
          id: cs.skill_id,
          name: cs.skills?.name,
          slug: cs.skills?.slug
        })) || [],
        yearsExperience: caretaker.years_experience,
        hourlyRate: caretaker.hourly_rate,
        dailyRate: caretaker.daily_rate,
        serviceRadius: caretaker.service_radius,
        certifications: caretaker.certifications?.map(c => ({
          id: c.id,
          name: c.name,
          documentUrl: c.document_url,
          status: c.status
        })) || [],
        availability,
        profilePhoto: caretaker.profile_photo,
        status: caretaker.status,
        rating: caretaker.rating,
        reviewCount: caretaker.review_count,
        createdAt: caretaker.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { phone, bio, skills, yearsExperience, hourlyRate, dailyRate, serviceRadius } = req.body;

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!caretaker) {
      throw new ApiError(404, 'Caretaker profile not found');
    }

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (yearsExperience !== undefined) updateData.years_experience = yearsExperience;
    if (hourlyRate !== undefined) updateData.hourly_rate = hourlyRate;
    if (dailyRate !== undefined) updateData.daily_rate = dailyRate;
    if (serviceRadius !== undefined) updateData.service_radius = serviceRadius;

    if (Object.keys(updateData).length > 0) {
      await supabase
        .from('caretakers')
        .update(updateData)
        .eq('id', caretaker.id);
    }

    if (skills) {
      await supabase.from('caretaker_skills').delete().eq('caretaker_id', caretaker.id);
      
      const skillInserts = skills.map(skillSlug => ({
        caretaker_id: caretaker.id,
        skill_id: skillSlug
      }));

      await supabaseAdmin.from('caretaker_skills').insert(skillInserts);
    }

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
});

router.put('/availability', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { availability } = req.body;

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!caretaker) {
      throw new ApiError(404, 'Caretaker profile not found');
    }

    await supabase.from('availability').delete().eq('caretaker_id', caretaker.id);

    const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    
    const availInserts = Object.entries(availability)
      .filter(([, hours]) => hours !== null)
      .map(([day, hours]) => ({
        caretaker_id: caretaker.id,
        day_of_week: dayMap[day],
        start_time: hours.start,
        end_time: hours.end
      }));

    if (availInserts.length > 0) {
      await supabaseAdmin.from('availability').insert(availInserts);
    }

    res.json({ success: true, message: 'Availability updated' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select(`
        *,
        user:users(full_name),
        caretaker_skills(skill_id, skills(name, slug)),
        certifications(id, name, status),
        availability(day_of_week, start_time, end_time)
      `)
      .eq('id', id)
      .eq('status', 'verified')
      .single();

    if (!caretaker) {
      throw new ApiError(404, 'Caretaker not found');
    }

    const availability = {};
    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day, i) => {
      const avail = caretaker.availability?.find(a => a.day_of_week === i);
      availability[day] = avail ? { start: avail.start_time, end: avail.end_time } : null;
    });

    const { data: reviews } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, patient:patients(user_id)')
      .eq('caretaker_id', id)
      .order('created_at', { ascending: false })
      .limit(5);

    const reviewerIds = reviews?.map(r => r.patient?.user_id) || [];
    const { data: users } = await supabase
      .from('users')
      .select('id, full_name')
      .in('id', reviewerIds);

    const reviewsWithNames = reviews?.map(review => {
      const user = users?.find(u => u.id === review.patient?.user_id);
      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        patientName: user?.full_name?.split(' ')[0] + ' ' + (user?.full_name?.split(' ')[1]?.[0] || '') + '.',
        createdAt: review.created_at
      };
    }) || [];

    res.json({
      success: true,
      data: {
        id: caretaker.id,
        fullName: caretaker.user?.full_name,
        bio: caretaker.bio,
        skills: caretaker.caretaker_skills?.map(cs => cs.skills?.name || cs.skills?.slug) || [],
        yearsExperience: caretaker.years_experience,
        hourlyRate: caretaker.hourly_rate,
        certifications: caretaker.certifications?.filter(c => c.status === 'approved'),
        availability,
        profilePhoto: caretaker.profile_photo,
        rating: caretaker.rating,
        reviewCount: caretaker.review_count,
        reviews: reviewsWithNames
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
