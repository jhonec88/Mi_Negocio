const { query } = require('../config/db');

/**
 * Recibir nuevo mensaje o cotización desde el formulario web
 * POST /api/contacto
 */
const create = async (req, res, next) => {
  try {
    const { nombre, telefono, email, tipo_solicitud, mensaje, _hp_security_check } = req.body;

    // Trampa Honeypot: Descarte silencioso si un bot la rellenó
    if (_hp_security_check && _hp_security_check.trim() !== '') {
      console.warn('[Seguridad Backend] Detección de bot por honeypot en POST /api/contacto');
      return res.status(200).json({
        ok: true,
        mensaje: 'Solicitud procesada correctamente.',
      });
    }

    if (!nombre || !telefono || !mensaje) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Por favor completa tu nombre, teléfono y descripción.',
      });
    }

    const ipOrigen = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const { rows } = await query(
      `INSERT INTO mensajes_contacto 
        (nombre, telefono, email, tipo_solicitud, mensaje, estado, origen, ip_origen)
       VALUES ($1, $2, $3, $4, $5, 'nuevo', 'web', $6)
       RETURNING id, nombre, creado_en`,
      [
        nombre.trim().slice(0, 120),
        telefono.trim().slice(0, 50),
        email ? email.trim().slice(0, 120) : null,
        tipo_solicitud ? tipo_solicitud.trim().slice(0, 100) : 'Consulta General',
        mensaje.trim().slice(0, 2000),
        String(ipOrigen).slice(0, 45),
      ]
    );

    res.status(201).json({
      ok: true,
      mensaje: '¡Tu solicitud ha sido radicada con éxito en nuestro sistema técnico!',
      solicitudId: rows[0].id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar mensajes y cotizaciones recibidas (Admin)
 * GET /api/contacto
 */
const getAll = async (req, res, next) => {
  try {
    const { estado } = req.query;

    let sql = 'SELECT * FROM mensajes_contacto';
    const params = [];

    if (estado && estado !== 'todos') {
      sql += ' WHERE estado = $1';
      params.push(estado);
    }

    sql += ' ORDER BY creado_en DESC';

    const { rows } = await query(sql, params);

    res.json({
      ok: true,
      total: rows.length,
      mensajes: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar estado o notas de una cotización (Admin)
 * PATCH /api/contacto/:id
 */
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, notas_internas } = req.body;

    const { rows } = await query(
      `UPDATE mensajes_contacto SET
        estado = COALESCE($1, estado),
        notas_internas = COALESCE($2, notas_internas),
        actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [estado, notas_internas, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Solicitud no encontrada.',
      });
    }

    res.json({
      ok: true,
      mensaje: 'Solicitud actualizada.',
      mensajeActualizado: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar mensaje (Admin)
 * DELETE /api/contacto/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('DELETE FROM mensajes_contacto WHERE id = $1 RETURNING id', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Solicitud no encontrada.',
      });
    }

    res.json({
      ok: true,
      mensaje: 'Solicitud eliminada.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  updateStatus,
  remove,
};
