const validarTarjeta = (req, res, next) => {
  const { numero_tarjeta, fecha_exp, cvv } = req.body;
  
  // Validar número de tarjeta (Luhn algorithm básico)
  if (!/^[0-9]{13,19}$/.test(numero_tarjeta)) {
    return res.status(400).json({ error: 'Número de tarjeta inválido' });
  }

  // Validar fecha de expiración
  const [mes, año] = fecha_exp.split('/');
  const ahora = new Date();
  const añoActual = ahora.getFullYear() % 100;
  const mesActual = ahora.getMonth() + 1;

  if (año < añoActual || (año == añoActual && mes < mesActual)) {
    return res.status(400).json({ error: 'Tarjeta expirada' });
  }

  next();
};

module.exports = validarTarjeta;