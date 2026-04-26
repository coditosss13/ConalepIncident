const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');
const { securityHeaders } = require('./middlewares/security.middleware');

const app = express();

// Middlewares
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(securityHeaders);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rutas
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Conalep - Sistema de Gestión de Incidencias',
    version: '1.0.0',
    api: '/api'
  });
});

// Middleware de errores (debe ir al final)
app.use(errorHandler);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Probar conexión a la base de datos
testConnection();

module.exports = app;