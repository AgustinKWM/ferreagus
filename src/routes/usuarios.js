const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Middleware para verificar token en rutas protegidas
router.use(authMiddleware);

// Rutas para clientes (rol 3)
router.get('/profile', checkRole([3]), usuarioController.obtenerPerfil);
router.put('/profile', checkRole([3]), usuarioController.actualizarPerfil);
router.delete('/account', checkRole([3]), usuarioController.eliminarCuenta);

// Router para rutas de admin (rol 1)
const adminRouter = express.Router();
adminRouter.use(checkRole([1])); // Solo admins

// Ruta de redirección para admin
adminRouter.get('/user-management', (req, res) => {
  res.json({ 
    success: true,
    message: 'Panel de administración de usuarios',
    user: req.user // Información del usuario admin
  });
});

// Rutas de gestión de trabajadores
adminRouter.post('/trabajadores', usuarioController.crearTrabajador);
adminRouter.get('/trabajadores', usuarioController.listarTrabajadores);
adminRouter.put('/trabajadores/:id', usuarioController.actualizarTrabajador);
adminRouter.delete('/trabajadores/:id', usuarioController.eliminarTrabajador);

// Montar rutas de admin bajo /admin
router.use('/admin', adminRouter);

module.exports = router;