import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected PostgreSQL error:', err.message);
});

export default pool;