const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.warn("[db] DATABASE_URL is not set — the pool will fail to connect.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("[db] idle client error", err);
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id               SERIAL PRIMARY KEY,
      name             TEXT NOT NULL,
      phone            TEXT,
      email            TEXT NOT NULL,
      service_interest TEXT,
      category         TEXT,
      assigned_to      TEXT,
      message          TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

module.exports = { pool, ensureSchema };
