import pkg from "pg";
const { Client } = pkg;
import "dotenv/config";

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    console.log("Connecting to:", process.env.DATABASE_URL?.split('@')[1]);
    await client.connect();
    console.log("✅ Connection successful!");
    const res = await client.query("SELECT NOW()");
    console.log("Result:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.end();
  }
}

test();
