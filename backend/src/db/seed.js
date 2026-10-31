const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function runSeed() {
  console.log('[Seed] Iniciando migración y siembra de datos en PostgreSQL...');
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sqlContent);
    console.log('[Seed] ✅ Migración y datos iniciales aplicados exitosamente.');

    // Verificar conteos
    const { rows: usuarios } = await pool.query('SELECT COUNT(*) FROM usuarios');
    const { rows: productos } = await pool.query('SELECT COUNT(*) FROM productos');
    const { rows: servicios } = await pool.query('SELECT COUNT(*) FROM servicios');
    const { rows: faqs } = await pool.query('SELECT COUNT(*) FROM faqs');

    console.log(`[Seed] Estadísticas actuales en Base de Datos:`);
    console.log(` - Usuarios Admin: ${usuarios[0].count}`);
    console.log(` - Productos Catálogo: ${productos[0].count}`);
    console.log(` - Servicios Técnicos: ${servicios[0].count}`);
    console.log(` - Preguntas Frecuentes: ${faqs[0].count}`);

  } catch (err) {
    console.error('[Seed Error]: Error al sembrar base de datos:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
