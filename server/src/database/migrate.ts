import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { requireDatabase } from "./pool.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const migration = await readFile(join(root, "migrations/0001_identity_organization.sql"), "utf8");
const pool = requireDatabase();

try {
  await pool.query(migration);
  console.log("[db] applied 0001_identity_organization.sql");
} finally {
  await pool.end();
}
