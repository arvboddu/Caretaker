const { body } = require('express-validator');

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('role')
    .isIn(['patient', 'caretaker'])
    .withMessage('Role must be patient or caretaker')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const profileUpdateValidation = [
  body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be 5-500 characters')
];

const bookingValidation = [
  body('caretakerId')
    .isUUID()
    .withMessage('Invalid caretaker ID'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const bookingDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        throw new Error('Cannot book in the past');
      }
      return true;
    }),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Invalid time format (HH:mm)'),
  body('duration')
    .isInt({ min: 1, max: 12 })
    .withMessage('Duration must be 1-12 hours'),
  body('address')
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be 5-500 characters')
];

const reviewValidation = [
  body('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be 1-5'),
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment must be under 1000 characters')
];

module.exports = {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  bookingValidation,
  reviewValidation
};
