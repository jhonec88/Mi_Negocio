const { query } = require('../config/db');

/**
 * Obtener todos los productos con filtros opcionales
 * GET /api/productos
 */
const getAll = async (req, res, next) => {
  try {
    const { categoria, disponible, destacado, busqueda, limite } = req.query;

    let sql = 'SELECT * FROM productos WHERE activo = TRUE';
    const params = [];
    let paramIndex = 1;

    if (categoria && categoria !== 'todos') {
      sql += ` AND categoria = $${paramIndex++}`;
      params.push(categoria);
    }

    if (disponible) {
      sql += ` AND disponible = $${paramIndex++}`;
      params.push(disponible);
    }

    if (destacado === 'true') {
      sql += ` AND destacado = TRUE`;
    }

    if (busqueda && busqueda.trim()) {
      sql += ` AND (nombre ILIKE $${paramIndex} OR marca ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex})`;
      params.push(`%${busqueda.trim()}%`);
      paramIndex++;
    }

    sql += ' ORDER BY id ASC';

    if (limite && !isNaN(parseInt(limite, 10))) {
      sql += ` LIMIT ${parseInt(limite, 10)}`;
    }

    const { rows } = await query(sql, params);

    res.json({
      ok: true,
      total: rows.length,
      productos: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener producto por ID
 * GET /api/productos/:id
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM productos WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado.',
      });
    }

    res.json({
      ok: true,
      producto: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo producto (Admin)
 * POST /api/productos
 */
const create = async (req, res, next) => {
  try {
    const {
      nombre,
      categoria,
      marca,
      precio,
      imagen,
      disponible,
      destacado,
      descripcion,
      especificaciones,
      stock,
    } = req.body;

    if (!nombre || !categoria || precio === undefined) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El nombre, la categoría y el precio son obligatorios.',
      });
    }

    const imgPath = imagen && imagen.trim() ? imagen.trim() : 'assets/images/productos/placeholder-tech.svg';
    const specsJson = especificaciones && typeof especificaciones === 'object'
      ? JSON.stringify(especificaciones)
      : '{}';

    const { rows } = await query(
      `INSERT INTO productos 
        (nombre, categoria, marca, precio, imagen, disponible, destacado, descripcion, especificaciones, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
       RETURNING *`,
      [
        nombre.trim(),
        categoria.trim(),
        marca ? marca.trim() : 'General',
        parseInt(precio, 10),
        imgPath,
        disponible || 'disponible',
        destacado === true || destacado === 'true',
        descripcion ? descripcion.trim() : '',
        specsJson,
        stock ? parseInt(stock, 10) : 10,
      ]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Producto creado exitosamente.',
      producto: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar producto existente (Admin)
 * PUT /api/productos/:id
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      categoria,
      marca,
      precio,
      imagen,
      disponible,
      destacado,
      descripcion,
      especificaciones,
      stock,
      activo,
    } = req.body;

    const existe = await query('SELECT id FROM productos WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado.',
      });
    }

    const specsJson = especificaciones && typeof especificaciones === 'object'
      ? JSON.stringify(especificaciones)
      : undefined;

    const { rows } = await query(
      `UPDATE productos SET
        nombre = COALESCE($1, nombre),
        categoria = COALESCE($2, categoria),
        marca = COALESCE($3, marca),
        precio = COALESCE($4, precio),
        imagen = COALESCE($5, imagen),
        disponible = COALESCE($6, disponible),
        destacado = COALESCE($7, destacado),
        descripcion = COALESCE($8, descripcion),
        especificaciones = CASE WHEN $9::text IS NOT NULL THEN $9::jsonb ELSE especificaciones END,
        stock = COALESCE($10, stock),
        activo = COALESCE($11, activo),
        actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        nombre,
        categoria,
        marca,
        precio !== undefined ? parseInt(precio, 10) : null,
        imagen,
        disponible,
        destacado !== undefined ? (destacado === true || destacado === 'true') : null,
        descripcion,
        specsJson,
        stock !== undefined ? parseInt(stock, 10) : null,
        activo,
        id,
      ]
    );

    res.json({
      ok: true,
      mensaje: 'Producto actualizado exitosamente.',
      producto: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar producto (Admin)
 * DELETE /api/productos/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('DELETE FROM productos WHERE id = $1 RETURNING id, nombre', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado.',
      });
    }

    res.json({
      ok: true,
      mensaje: `Producto "${rows[0].nombre}" eliminado correctamente.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener listado de categorías disponibles
 * GET /api/productos/categorias
 */
const getCategorias = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT DISTINCT categoria, COUNT(*) as cantidad FROM productos WHERE activo = TRUE GROUP BY categoria ORDER BY categoria'
    );
    res.json({
      ok: true,
      categorias: rows,
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
  getCategorias,
};
