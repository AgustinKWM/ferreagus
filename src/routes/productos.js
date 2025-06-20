const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', productoController.listarProductos);
router.get('/:id', productoController.obtenerProducto);
router.get('/:id/disponibilidad', productoController.obtenerDisponibilidad);

// Rutas protegidas para admin y trabajadores
router.post('/', 
  authMiddleware, 
  checkRole([1, 2]), // Admin y Trabajadores
  productoController.crearProducto
);

router.put('/:id', 
  authMiddleware, 
  checkRole([1, 2]),
  productoController.actualizarProducto
);

router.delete('/:id', 
  authMiddleware, 
  checkRole([1, 2]),
  productoController.eliminarProducto
);

// Rutas para gestión de stock
router.patch('/:id/stock', 
  authMiddleware, 
  checkRole([1, 2]),
  productoController.actualizarStock
);

module.exports = router;