import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM "Department"');
    console.log("Departments:");
    rows.forEach(r => console.log(JSON.stringify(r, null, 2)));
  } finally {
    client.release();
    await pool.end();
  }
}
main();
