const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { pool } = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// 1. MIDDLEWARES DE SEGURIDAD Y CONFIGURACIÓN
// ============================================================================

// Helmet con configuración CSP flexible para permitir fuentes e iconos locales
app.use(
  helmet({
    contentSecurityPolicy: false, // Usamos la directiva unificada del proyecto
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Limitador de tasa contra ataques de fuerza bruta en autenticación y spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // máximo 30 intentos por IP
  message: { ok: false, mensaje: 'Demasiados intentos. Por favor espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);

const contactoLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { ok: false, mensaje: 'Has excedido el límite de solicitudes. Intenta más tarde.' },
});
app.use('/api/contacto', contactoLimiter);

// ============================================================================
// 2. ENRUTAMIENTO DE LA CONSOLA ADMINISTRATIVA (/consola)
// ============================================================================

// Servir estáticos de la consola (HTML, CSS, JS)
app.use('/consola', express.static(path.join(__dirname, 'admin')));

// Enrutar /consola y /consola/* directamente al index.html de la consola
app.get('/consola*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// ============================================================================
// 3. API REST (/api)
// ============================================================================
// Desactivar caché del navegador y proxies para respuestas dinámicas de la API
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use('/api', apiRoutes);

// Endpoint de diagnóstico de salud (Healthcheck)
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await pool.query('SELECT NOW() as db_time');
    res.json({
      ok: true,
      servicio: 'JecTech Soluciones Backend API & Consola Admin',
      estado: 'online',
      base_de_datos: 'PostgreSQL Dockerizada conectada',
      timestamp: dbTest.rows[0].db_time,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      servicio: 'JecTech Soluciones Backend API',
      estado: 'degraded',
      error: err.message,
    });
  }
});

// ============================================================================
// 4. SERVIR EL FRONTEND PÚBLICO (TIENDA Y SERVICIOS)
// ============================================================================
// Sirve todo el frontend estático existente (index.html, servicios.html, assets, etc.)
const publicRoot = path.join(__dirname, '../../');
app.use(express.static(publicRoot));

// ============================================================================
// 5. MANEJO CENTRAL DE ERRORES
// ============================================================================
app.use(errorHandler);

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 SERVIDOR JECTECH SOLUCIONES BACKEND INICIADO`);
  console.log(`📍 URL Pública / Tienda:      http://localhost:${PORT}/`);
  console.log(`🛡️  Consola Administrativa:    http://localhost:${PORT}/consola`);
  console.log(`🔌 API REST Endpoints:       http://localhost:${PORT}/api/`);
  console.log(`🐘 Base de Datos:            PostgreSQL Dockerizada (Puerto 5432)`);
  console.log('================================================================');
});

// Cierre ordenado
process.on('SIGTERM', async () => {
  console.log('Cerrando servidor HTTP y conexiones de base de datos...');
  server.close(async () => {
    await pool.end();
    console.log('Servidor finalizado limpiamente.');
  });
});

module.exports = app;
