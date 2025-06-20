// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('\x1b[31m', '⚠️ Error:', err.stack, '\x1b[0m');

  // Manejo específico para errores de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Entrada duplicada',
      details: 'El registro ya existe en la base de datos'
    });
  }

  // Manejo de errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
  }

  // Manejo de errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
      details: 'La autenticación falló'
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: err.message || 'Error interno del servidor'
  };

  // Solo mostrar stack en desarrollo
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;