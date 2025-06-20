const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, carritoController.crearCarrito);
router.get('/usuario/:id', authMiddleware, carritoController.obtenerCarritoPorUsuario);
router.post('/agregar-item', authMiddleware, carritoController.agregarItem);
router.delete('/eliminar-item/:id', authMiddleware, carritoController.eliminarItem);
router.put('/actualizar-cantidad/:id', authMiddleware, carritoController.actualizarCantidad);
router.delete('/vaciar/:id', authMiddleware, carritoController.vaciarCarrito);

module.exports = router;

