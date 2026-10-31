const { query } = require('../config/db');

/**
 * Obtener estadísticas consolidadas para el Dashboard de la Consola
 * GET /api/stats/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Conteo de Productos
    const productosTotales = await query('SELECT COUNT(*) as total FROM productos WHERE activo = TRUE');
    const productosStockBajo = await query('SELECT COUNT(*) as bajo FROM productos WHERE activo = TRUE AND stock <= 5');

    // 2. Conteo de Servicios
    const serviciosTotales = await query('SELECT COUNT(*) as total FROM servicios WHERE activo = TRUE');

    // 3. Conteo de Mensajes / Cotizaciones
    const mensajesTotales = await query('SELECT COUNT(*) as total FROM mensajes_contacto');
    const mensajesNuevos = await query("SELECT COUNT(*) as nuevos FROM mensajes_contacto WHERE estado = 'nuevo'");

    // 4. Últimas solicitudes de contacto recibidas
    const ultimosMensajes = await query(
      'SELECT id, nombre, telefono, tipo_solicitud, estado, creado_en FROM mensajes_contacto ORDER BY creado_en DESC LIMIT 5'
    );

    // 5. Productos destacados o con stock crítico
    const productosCriticos = await query(
      'SELECT id, nombre, categoria, precio, stock, disponible FROM productos WHERE activo = TRUE ORDER BY stock ASC LIMIT 5'
    );

    res.json({
      ok: true,
      stats: {
        totalProductos: parseInt(productosTotales.rows[0].total, 10),
        productosStockBajo: parseInt(productosStockBajo.rows[0].bajo, 10),
        totalServicios: parseInt(serviciosTotales.rows[0].total, 10),
        totalMensajes: parseInt(mensajesTotales.rows[0].total, 10),
        mensajesNuevos: parseInt(mensajesNuevos.rows[0].nuevos, 10),
      },
      ultimosMensajes: ultimosMensajes.rows,
      productosCriticos: productosCriticos.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
