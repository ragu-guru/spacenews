// lib/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  // connectionString: "postgres://postgres:admin@localhost:5432/postgres",
  connectionString: process.env.POSTGRES_URL,
});

export default pool;
