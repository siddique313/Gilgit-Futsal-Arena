/**
 * Runs Supabase migration SQL file against the database.
 * Uses DB_* or DATABASE_URL from .env.local / .env.
 *
 * Usage: npm run migration:run
 */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnv(filePath) {
  const full = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      )
        val = val.slice(1, -1).replace(/\\n/g, "\n");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

// Load env (same order as Nest ConfigModule)
loadEnv(".env.local");
loadEnv(".env");

const migrationPath = path.join(
  __dirname,
  "..",
  "supabase",
  "migrations",
  "001_initial_schema.sql",
);

if (!fs.existsSync(migrationPath)) {
  console.error("Migration file not found:", migrationPath);
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, "utf8");

async function run() {
  const connectionConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME,
      };

  const client = new Client(connectionConfig);
  try {
    await client.connect();
    await client.query(sql);
    console.log(
      "Migration 001_initial_schema.sql ran successfully. Tables updated.",
    );
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
