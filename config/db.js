// src/config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
// Asegúrate de que tu URL lleve al final:
//   ?sslmode=require
// Neon lo recomienda así.
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  keepAlive: true,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // aquí no salimos, solo logueamos
});

// Probamos la conexión sin dejar cliente “colgado”
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to the database');
  } catch (err) {
    console.error('❌ Error connecting to the database', err);
  }
})();

export default pool;
