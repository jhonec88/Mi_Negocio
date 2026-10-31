const path = require('path');
const dotenv = require('dotenv');

// Cargar explícitamente el archivo .env de backend con override: true para ignorar variables de entorno del sistema
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const { Pool } = require('pg');

const dbUser = process.env.DB_USER || 'tecnofix_admin';
const dbPassword = process.env.DB_PASSWORD || 'tecnofix_secure_pass_2026';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'tecnofix_db';

const pool = new Pool({
  connectionString: `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

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
