// src/middleware/authValidators.js
const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),
  
  body('email')
    .isEmail().withMessage('Debe ser un email válido'),
  
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
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
    .isEmail().withMessage('Debe ser un email válido'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegister, validateLogin };