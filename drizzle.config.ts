import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER || 'user',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'seapunkdb',
    ssl: false,
  },
} satisfies Config;
