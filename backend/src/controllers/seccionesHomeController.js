const { query } = require('../config/db');

/**
 * Obtener secciones de la página principal
 * GET /api/secciones-home
 */
const getAll = async (req, res, next) => {
  try {
    const { admin, pagina } = req.query;

    const conditions = [];
    const params = [];

    if (admin !== 'true') {
      conditions.push('activo = TRUE');
    }

    if (pagina) {
      params.push(pagina);
      conditions.push(`pagina = $${params.length}`);
    }

    let sql = 'SELECT * FROM secciones_home';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY orden ASC, id ASC';

    const { rows } = await query(sql, params);

    res.json({
      ok: true,
      total: rows.length,
      secciones: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener sección por ID
 * GET /api/secciones-home/:id
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM secciones_home WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Sección no encontrada.',
      });
    }

    res.json({
      ok: true,
      seccion: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva sección de la página principal (Admin)
 * POST /api/secciones-home
 */
const create = async (req, res, next) => {
  try {
    const {
      pagina,
      titulo,
      subtitulo,
      descripcion,
      imagen,
      texto_boton,
      enlace_boton,
      posicion_texto,
      orden,
      activo,
    } = req.body;

    if (!titulo || !descripcion || !imagen) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El título, la descripción y la imagen son obligatorios.',
      });
    }

    const { rows } = await query(
      `INSERT INTO secciones_home 
        (pagina, titulo, subtitulo, descripcion, imagen, texto_boton, enlace_boton, posicion_texto, orden, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        pagina ? pagina.trim() : 'inicio',
        titulo.trim(),
        subtitulo ? subtitulo.trim() : '',
        descripcion.trim(),
        imagen.trim(),
        texto_boton ? texto_boton.trim() : 'Más Información',
        enlace_boton ? enlace_boton.trim() : 'contacto.html',
        posicion_texto || 'centro',
        orden !== undefined ? parseInt(orden, 10) : 0,
        activo !== undefined ? (activo === true || activo === 'true') : true,
      ]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Sección de inicio creada con éxito.',
      seccion: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar sección existente (Admin)
 * PUT /api/secciones-home/:id
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      subtitulo,
      descripcion,
      imagen,
      texto_boton,
      enlace_boton,
      posicion_texto,
      orden,
      activo,
    } = req.body;

    const existe = await query('SELECT id FROM secciones_home WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Sección no encontrada.',
      });
    }

    const { rows } = await query(
      `UPDATE secciones_home SET
        titulo = COALESCE($1, titulo),
        subtitulo = COALESCE($2, subtitulo),
        descripcion = COALESCE($3, descripcion),
        imagen = COALESCE($4, imagen),
        texto_boton = COALESCE($5, texto_boton),
        enlace_boton = COALESCE($6, enlace_boton),
        posicion_texto = COALESCE($7, posicion_texto),
        orden = COALESCE($8, orden),
        activo = COALESCE($9, activo),
        actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        titulo ? titulo.trim() : null,
        subtitulo !== undefined ? subtitulo.trim() : null,
        descripcion ? descripcion.trim() : null,
        imagen ? imagen.trim() : null,
        texto_boton !== undefined ? texto_boton.trim() : null,
        enlace_boton !== undefined ? enlace_boton.trim() : null,
        posicion_texto || null,
        orden !== undefined ? parseInt(orden, 10) : null,
        activo !== undefined ? (activo === true || activo === 'true') : null,
        id,
      ]
    );

    res.json({
      ok: true,
      mensaje: 'Sección actualizada correctamente.',
      seccion: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar sección (Admin)
 * DELETE /api/secciones-home/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM secciones_home WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Sección no encontrada.',
      });
    }

    res.json({
      ok: true,
      mensaje: 'Sección eliminada exitosamente.',
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

