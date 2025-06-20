const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/authValidators');
const { authMiddleware } = require('../middleware/authMiddleware');

// Ruta de registro
router.post('/register', validateRegister, authController.register);

// Ruta de login
router.post('/login', validateLogin, authController.login);

// Ruta para verificar token
router.get('/verify', authController.verifyToken);

// Ruta para crear admin (solo desarrollo)
if (process.env.NODE_ENV === 'development') {
  router.post('/create-admin', authController.createAdmin);
}

// Ruta para obtener usuario actual
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;