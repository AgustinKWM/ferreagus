const express = require('express');
const router = express.Router();
const tarjetaController = require('../controllers/tarjetaController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y rol de cliente
router.use(authMiddleware);
router.use(checkRole([3])); // Solo clientes (ID=3)

router.post('/', tarjetaController.agregarTarjeta);
router.get('/', tarjetaController.listarTarjetas);
router.delete('/:id', tarjetaController.eliminarTarjeta);

module.exports = router;