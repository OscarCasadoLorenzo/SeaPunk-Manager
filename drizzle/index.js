const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('./schema');

// Create a connection pool
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  user: process.env.PGUSER || 'user',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'seapunkdb',
  ssl: false,
});

// Create Drizzle instance
const db = drizzle(pool, { schema });

module.exports = { db, schema };
