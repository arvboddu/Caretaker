const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { generateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { ApiError } = require('../utils/errors');
const { registerValidation, loginValidation } = require('../utils/validators');

const router = Router();

router.post('/register', validate(registerValidation), async (req, res, next) => {
  try {
    const { email, password, fullName, role } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({ email, password_hash: passwordHash, full_name: fullName, role })
      .select()
      .single();

    if (userError) throw userError;

    if (role === 'patient') {
      await supabaseAdmin.from('patients').insert({ user_id: user.id });
    } else if (role === 'caretaker') {
      await supabaseAdmin.from('caretakers').insert({ user_id: user.id });
    }

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginValidation), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    res.json({
      success: true,
      message: 'If an account exists, a reset email has been sent'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('id', decoded.userId)
      .single();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
