const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno locales si existe el archivo .env
const envFile = path.resolve(__dirname, '../../.env');
if (require('fs').existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

const { Pool } = require('pg');

const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Supabase y proveedores cloud requieren SSL
  if (process.env.DATABASE_URL.includes('supabase') || process.env.DB_SSL === 'true') {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  const dbUser = process.env.DB_USER || 'tecnofix_admin';
  const dbPassword = process.env.DB_PASSWORD || 'tecnofix_secure_pass_2026';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const dbName = process.env.DB_NAME || 'tecnofix_db';

  poolConfig.connectionString = `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[PostgreSQL Error Inesperado]:', err);
});

/**
 * Ejecuta una consulta SQL preparada con parámetros
 * @param {string} text - Consulta SQL
 * @param {Array} params - Parámetros seguros
 * @returns {Promise<any>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Obtiene un cliente dedicado del pool para transacciones
 */
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient,
};
