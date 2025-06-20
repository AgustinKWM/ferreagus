// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { createServer } = require('http');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./config/db');
const adminRedirect = require('./middleware/adminRedirect');

const app = express();
const httpServer = createServer(app);

// 1. Configuración de Seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'blob:', '*.amazonaws.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        connectSrc: ["'self'", '*.googleapis.com'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Middlewares básicos
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Middleware de redirección para admin
app.use(adminRedirect);

// 5. Archivos estáticos
app.use(
  '/public',
  express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
  })
);

// 6. Sistema de Rutas
const apiRouter = express.Router();

// Rutas Públicas
apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/dolar', require('./routes/dolar'));

// Endpoint status
apiRouter.get('/status', async (req, res) => {
  try {
    const [dbStatus] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'operational',
      dbStatus: dbStatus[0].result === 2 ? 'OK' : 'ERROR',
    });
  } catch (error) {
    res.status(500).json({ status: 'database_error' });
  }
});

// Rutas Protegidas
apiRouter.use('/usuarios', require('./routes/usuarios'));
apiRouter.use('/marcas', require('./routes/marcas'));
apiRouter.use('/productos', require('./routes/productos'));
apiRouter.use('/categorias', require('./routes/categorias'));
apiRouter.use('/carrito', require('./routes/carritos'));
apiRouter.use('/sucursales', require('./routes/sucursal'));
apiRouter.use('/promociones', require('./routes/promocion'));
apiRouter.use('/ventas', require('./routes/ventas'));
apiRouter.use('/tarjetas', require('./routes/tarjeta'));

// ✅ Rutas Webpay (ajustada la ruta)
apiRouter.use('/webpay', require('./apiWebpay/routes/webpay.routes'));

// Montar todas las rutas bajo /api/v1
app.use('/api/v1', apiRouter);

// 7. Manejo de Errores
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    availableEndpoints: [
      '/api/v1/auth/login',
      '/api/v1/productos',
      '/api/v1/ventas',
      // puedes agregar más
    ],
  });
});

app.use(errorHandler);

// 8. Inicio del Servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

module.exports = app;
