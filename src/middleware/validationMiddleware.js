const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const validateRegister = [
  body('first_name').notEmpty().withMessage('Emri eshte i detyrushem'),
  body('last_name').notEmpty().withMessage('Mbiemri eshte i detyrushem'),
  body('email')
    .isEmail().withMessage('Email nuk eshte valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Passwordi duhet te kete minimum 8 karaktere')
    .matches(/(?=.*[a-z])/).withMessage('Passwordi duhet te kete te pakten nje shkronje te vogel')
    .matches(/(?=.*[A-Z])/).withMessage('Passwordi duhet te kete te pakten nje shkronje te madhe')
    .matches(/(?=.*[0-9])/).withMessage('Passwordi duhet te kete te pakten nje numer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email')
    .isEmail().withMessage('Email nuk eshte valid')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Passwordi eshte i detyrushem'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Shume kerkesa, provo perseri pas 15 minutash' }
});

module.exports = { validateRegister, validateLogin, authLimiter };
