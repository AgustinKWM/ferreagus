const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ventaController.crearVenta);
router.get('/usuario/:id', authMiddleware, ventaController.obtenerVentasPorUsuario);
router.get('/:id', authMiddleware, ventaController.obtenerVenta);
router.post('/:id/despacho', authMiddleware, ventaController.crearDespacho);
router.get('/:id/despacho', authMiddleware, ventaController.obtenerDespacho);
router.put('/:id/estado', authMiddleware, ventaController.actualizarEstado);

module.exports = router;