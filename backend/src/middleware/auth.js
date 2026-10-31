const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'tecnofix_jwt_super_secret_key_2026_bogota_colombia_9876543210';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Genera un token JWT firmado
 * @param {object} payload
 * @returns {string}
 */
const generarToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Middleware para proteger rutas que requieren autenticación de administrador
 */
const requerirAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Extraer desde cabecera Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Extraer alternativamente desde cookies
    else if (req.cookies && req.cookies.tecnofix_admin_token) {
      token = req.cookies.tecnofix_admin_token;
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Acceso no autorizado. Se requiere iniciar sesión en la consola.',
      });
    }

    // Verificar firma del token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar que el usuario continúe existiendo y activo en la base de datos
    const { rows } = await query(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (rows.length === 0 || !rows[0].activo) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Sesión no válida o usuario desactivado.',
      });
    }

    // Adjuntar usuario autenticado a la petición
    req.usuario = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'La sesión ha expirado. Por favor ingresa nuevamente.',
      });
    }
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o manipulado.',
    });
  }
};

module.exports = {
  generarToken,
  requerirAuth,
  JWT_SECRET,
};
