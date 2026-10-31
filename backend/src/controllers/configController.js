const { query } = require('../config/db');

/**
 * Obtener configuración global del negocio
 * GET /api/config
 */
const getAll = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT clave, valor, descripcion, actualizado_en FROM configuracion ORDER BY clave');
    const configMap = {};
    rows.forEach(r => {
      configMap[r.clave] = r.valor;
    });

    res.json({
      ok: true,
      config: configMap,
      detallado: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una clave de configuración o múltiples claves (Admin)
 * PUT /api/config
 */
const update = async (req, res, next) => {
  try {
    const { config } = req.body;

    if (!config || typeof config !== 'object') {
      return res.status(400).json({
        ok: false,
        mensaje: 'Se esperaba un objeto de configuración con pares clave-valor.',
      });
    }

    for (const [clave, valor] of Object.entries(config)) {
      await query(
        `INSERT INTO configuracion (clave, valor, actualizado_en)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (clave) DO UPDATE 
         SET valor = EXCLUDED.valor, actualizado_en = CURRENT_TIMESTAMP`,
        [clave, String(valor)]
      );
    }

    res.json({
      ok: true,
      mensaje: 'Configuración actualizada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  update,
};
