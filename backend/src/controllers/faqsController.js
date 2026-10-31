const { query } = require('../config/db');

/**
 * Obtener listado de preguntas frecuentes
 * GET /api/faqs
 */
const getAll = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM faqs WHERE activo = TRUE ORDER BY orden ASC, id ASC');
    res.json({
      ok: true,
      total: rows.length,
      faqs: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva FAQ (Admin)
 * POST /api/faqs
 */
const create = async (req, res, next) => {
  try {
    const { pregunta, respuesta, categoria, orden } = req.body;

    if (!pregunta || !respuesta) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La pregunta y la respuesta son obligatorias.',
      });
    }

    const { rows } = await query(
      `INSERT INTO faqs (pregunta, respuesta, categoria, orden)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [pregunta.trim(), respuesta.trim(), categoria || 'General', orden || 0]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Pregunta frecuente creada exitosamente.',
      faq: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar FAQ (Admin)
 * PUT /api/faqs/:id
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pregunta, respuesta, categoria, orden, activo } = req.body;

    const { rows } = await query(
      `UPDATE faqs SET
        pregunta = COALESCE($1, pregunta),
        respuesta = COALESCE($2, respuesta),
        categoria = COALESCE($3, categoria),
        orden = COALESCE($4, orden),
        activo = COALESCE($5, activo)
       WHERE id = $6
       RETURNING *`,
      [pregunta, respuesta, categoria, orden, activo, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pregunta frecuente no encontrada.',
      });
    }

    res.json({
      ok: true,
      mensaje: 'Pregunta frecuente actualizada.',
      faq: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar FAQ (Admin)
 * DELETE /api/faqs/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('DELETE FROM faqs WHERE id = $1 RETURNING id', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pregunta frecuente no encontrada.',
      });
    }

    res.json({
      ok: true,
      mensaje: 'Pregunta frecuente eliminada.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
