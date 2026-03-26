const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/errors');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    throw new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', formattedErrors);
  };
};

module.exports = { validate };
