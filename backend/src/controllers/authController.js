const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { generarToken } = require('../middleware/auth');

/**
 * Iniciar sesión de usuario administrador
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Por favor ingresa correo y contraseña.',
      });
    }

    const { rows } = await query(
      'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales inválidas. Verifica tu correo o contraseña.',
      });
    }

    const usuario = rows[0];

    if (!usuario.activo) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Tu cuenta administrativa está desactivada.',
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales inválidas. Verifica tu correo o contraseña.',
      });
    }

    // Actualizar último login
    await query(
      'UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = $1',
      [usuario.id]
    );

    const token = generarToken({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });

    // Configurar cookie httpOnly
    res.cookie('tecnofix_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      ok: true,
      mensaje: `¡Bienvenido de nuevo, ${usuario.nombre}!`,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/me
 */
const me = async (req, res) => {
  res.json({
    ok: true,
    usuario: req.usuario,
  });
};

/**
 * Cerrar sesión administrativa
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.clearCookie('tecnofix_admin_token');
  res.json({
    ok: true,
    mensaje: 'Sesión cerrada exitosamente.',
  });
};

/**
 * Cambiar contraseña de administrador
 * PUT /api/auth/password
 */
const changePassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const userId = req.usuario.id;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debes proporcionar la contraseña actual y la nueva.',
      });
    }

    if (passwordNueva.length < 8) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La nueva contraseña debe tener mínimo 8 caracteres.',
      });
    }

    const { rows } = await query('SELECT password_hash FROM usuarios WHERE id = $1', [userId]);
    const coincide = await bcrypt.compare(passwordActual, rows[0].password_hash);

    if (!coincide) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La contraseña actual no es correcta.',
      });
    }

    const nuevoHash = await bcrypt.hash(passwordNueva, 10);
    await query(
      'UPDATE usuarios SET password_hash = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2',
      [nuevoHash, userId]
    );

    res.json({
      ok: true,
      mensaje: 'Contraseña actualizada con éxito.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me,
  logout,
  changePassword,
};
