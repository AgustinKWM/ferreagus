const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: `Tu rol (${req.user.tipo}) no tiene permisos para esta acción`
      });
    }
    next();
  };
};

module.exports = checkRole;