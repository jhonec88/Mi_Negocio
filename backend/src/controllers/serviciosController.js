const { query } = require('../config/db');

/**
 * Obtener todos los servicios técnicos
 * GET /api/servicios
 */
const getAll = async (req, res, next) => {
  try {
    const { categoria, destacado } = req.query;

    let sql = 'SELECT * FROM servicios WHERE activo = TRUE';
    const params = [];
    let paramIndex = 1;

    if (categoria && categoria !== 'todos') {
      sql += ` AND categoria = $${paramIndex++}`;
      params.push(categoria);
    }

    if (destacado === 'true') {
      sql += ` AND destacado = TRUE`;
    }

    sql += ' ORDER BY id ASC';

    const { rows } = await query(sql, params);

    res.json({
      ok: true,
      total: rows.length,
      servicios: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener servicio por ID
 * GET /api/servicios/:id
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM servicios WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Servicio no encontrado.',
      });
    }

    res.json({
      ok: true,
      servicio: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nuevo servicio técnico (Admin)
 * POST /api/servicios
 */
const create = async (req, res, next) => {
  try {
    const {
      nombre,
      categoria,
      icono,
      descripcion,
      beneficios,
      equipos_compatibles,
      tareas_incluidas,
      tiempo_estimado,
      precio_referencia,
      destacado,
    } = req.body;

    if (!nombre || !categoria || !descripcion) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Nombre, categoría y descripción son campos obligatorios.',
      });
    }

    const beneficiosJson = Array.isArray(beneficios) ? JSON.stringify(beneficios) : '[]';
    const tareasJson = Array.isArray(tareas_incluidas) ? JSON.stringify(tareas_incluidas) : '[]';

    const { rows } = await query(
      `INSERT INTO servicios 
        (nombre, categoria, icono, descripcion, beneficios, equipos_compatibles, tareas_incluidas, tiempo_estimado, precio_referencia, destacado)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7::jsonb, $8, $9, $10)
       RETURNING *`,
      [
        nombre.trim(),
        categoria.trim(),
        icono || '',
        descripcion.trim(),
        beneficiosJson,
        equipos_compatibles || '',
        tareasJson,
        tiempo_estimado || 'A convenir',
        precio_referencia || 'Cotizar por WhatsApp',
        destacado === true || destacado === 'true',
      ]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Servicio técnico creado exitosamente.',
      servicio: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar servicio técnico (Admin)
 * PUT /api/servicios/:id
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      categoria,
      icono,
      descripcion,
      beneficios,
      equipos_compatibles,
      tareas_incluidas,
      tiempo_estimado,
      precio_referencia,
      destacado,
      activo,
    } = req.body;

    const existe = await query('SELECT id FROM servicios WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Servicio no encontrado.',
      });
    }

    const beneficiosJson = beneficios ? JSON.stringify(beneficios) : undefined;
    const tareasJson = tareas_incluidas ? JSON.stringify(tareas_incluidas) : undefined;

    const { rows } = await query(
      `UPDATE servicios SET
        nombre = COALESCE($1, nombre),
        categoria = COALESCE($2, categoria),
        icono = COALESCE($3, icono),
        descripcion = COALESCE($4, descripcion),
        beneficios = CASE WHEN $5::text IS NOT NULL THEN $5::jsonb ELSE beneficios END,
        equipos_compatibles = COALESCE($6, equipos_compatibles),
        tareas_incluidas = CASE WHEN $7::text IS NOT NULL THEN $7::jsonb ELSE tareas_incluidas END,
        tiempo_estimado = COALESCE($8, tiempo_estimado),
        precio_referencia = COALESCE($9, precio_referencia),
        destacado = COALESCE($10, destacado),
        activo = COALESCE($11, activo),
        actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        nombre,
        categoria,
        icono,
        descripcion,
        beneficiosJson,
        equipos_compatibles,
        tareasJson,
        tiempo_estimado,
        precio_referencia,
        destacado !== undefined ? (destacado === true || destacado === 'true') : null,
        activo,
        id,
      ]
    );

    res.json({
      ok: true,
      mensaje: 'Servicio técnico actualizado exitosamente.',
      servicio: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar servicio técnico (Admin)
 * DELETE /api/servicios/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('DELETE FROM servicios WHERE id = $1 RETURNING id, nombre', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Servicio no encontrado.',
      });
    }

    res.json({
      ok: true,
      mensaje: `Servicio "${rows[0].nombre}" eliminado correctamente.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
