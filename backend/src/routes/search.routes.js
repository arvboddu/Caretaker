const { Router } = require('express');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.get('/caretakers', authMiddleware, async (req, res, next) => {
  try {
    const {
      q,
      skills,
      minPrice,
      maxPrice,
      minRating,
      availableOn,
      distance,
      sortBy = 'rating',
      limit = 20,
      offset = 0
    } = req.query;
    const userId = req.user.userId;

    let query = supabase
      .from('caretakers')
      .select(`
        *,
        user:users(full_name),
        caretaker_skills(skill_id, skills(name, slug))
      `)
      .eq('status', 'verified');

    if (q) {
      query = query.ilike('user.full_name', `%${q}%`);
    }

    if (minPrice) {
      query = query.gte('hourly_rate', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('hourly_rate', parseFloat(maxPrice));
    }

    if (minRating) {
      query = query.gte('rating', parseFloat(minRating));
    }

    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortBy === 'price_low') {
      query = query.order('hourly_rate', { ascending: true });
    } else if (sortBy === 'price_high') {
      query = query.order('hourly_rate', { ascending: false });
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: caretakers, error } = await query;

    if (error) throw error;

    let filteredCaretakers = caretakers || [];

    if (skills) {
      const skillList = skills.split(',');
      filteredCaretakers = filteredCaretakers.filter(c =>
        c.caretaker_skills?.some(cs =>
          skillList.includes(cs.skills?.slug)
        )
      );
    }

    const { data: patientData } = await supabase
      .from('patients')
      .select('latitude, longitude')
      .eq('user_id', userId)
      .single();

    const caretakersWithDetails = filteredCaretakers.map(c => ({
      id: c.id,
      fullName: c.user?.full_name || 'Unknown',
      bio: c.bio,
      rating: c.rating,
      reviewCount: c.review_count,
      hourlyRate: c.hourly_rate,
      profilePhoto: c.profile_photo,
      skills: c.caretaker_skills?.map(cs => cs.skills?.slug) || [],
      distance: patientData?.latitude && c.profile_photo ? 5 : null
    }));

    res.json({
      success: true,
      data: {
        caretakers: caretakersWithDetails,
        total: caretakersWithDetails.length,
        filters: { skills, minPrice, maxPrice, minRating }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
