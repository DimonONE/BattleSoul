// import { Pool } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import * as schema from "@shared/schema";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL must be set");
// }

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool, schema });

// // Проверка соединения
// (async () => {
//   try {
//     await pool.query('SELECT 1');
//     console.log("✅ Successfully connected to the database!");
//   } catch (err) {
//     console.error("❌ Failed to connect to the database:", err);
//   }
// })();

import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import 'dotenv/config'

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Создаем стандартный пул для TCP/SSL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool, { schema });

