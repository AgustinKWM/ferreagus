const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const { singleUpload, multipleUpload } = require('../config/multer');
const { param } = require('express-validator');

// Rutas públicas
router.get('/', marcaController.listar);
router.get('/:id', 
  param('id').isInt().withMessage('ID debe ser un número entero'),
  marcaController.obtenerPorId
);

// Rutas protegidas (solo admin)
router.post(
  '/',
  authMiddleware,
  checkRole([1]), // Solo rol 1 (Admin)
  (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          error: 'Error al subir archivo',
          details: err.message 
        });
      }
      next();
    });
  },
  marcaController.crear
);

router.put(
  '/:id',
  authMiddleware,
  checkRole([1]),
  param('id').isInt().withMessage('ID debe ser un número entero'),
  (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          error: 'Error al subir archivo',
          details: err.message 
        });
      }
      next();
    });
  },
  marcaController.actualizar
);

router.delete(
  '/:id',
  authMiddleware,
  checkRole([1]),
  param('id').isInt().withMessage('ID debe ser un número entero'),
  marcaController.eliminar
);

// Carga inicial de logos
router.post(
  '/carga-inicial',
  authMiddleware,
  checkRole([1]),
  (req, res, next) => {
    multipleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          error: 'Error al subir archivos',
          details: err.message 
        });
      }
      next();
    });
  },
  marcaController.cargaInicial
);

module.exports = router;