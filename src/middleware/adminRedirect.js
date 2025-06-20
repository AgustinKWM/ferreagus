const jwt = require('jsonwebtoken');

const adminRedirect = (req, res, next) => {
  // Excluir rutas de API, autenticación y archivos estáticos
  if (req.path.startsWith('/api') || 
      req.path === '/login' || 
      req.path === '/register' ||
      req.path.startsWith('/auth') ||
      req.path.startsWith('/public')) {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si es admin y no está en una ruta de admin
    if (decoded.role === 1 && !req.path.startsWith('/admin')) {
      return res.status(200).json({
        success: true,
        redirectTo: '/admin/user-management',
        message: 'Redirigiendo a panel de administración'
      });
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = adminRedirect;