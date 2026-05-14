import pkg from "pg";
const { Pool } = pkg;
import { hash } from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const departments = [
  { name: "Public Works Department (PWD)", city: "Delhi" },
  { name: "Water Supply & Sewerage Board", city: "Delhi" },
  { name: "State Electricity Board", city: "Delhi" },
  { name: "Municipal Corporation (Solid Waste)", city: "Delhi" },
  { name: "Traffic Police", city: "Delhi" },
  { name: "Environment & Forest Department", city: "Delhi" },
  { name: "General Administration", city: "Delhi" },
];

async function main() {
  console.log("🌱 Starting RAW SQL seed...");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Create Departments
    console.log("Creating departments...");
    const deptIds = new Map();
    for (const dept of departments) {
      const res = await client.query(
        `INSERT INTO "Department" (id, name, "City", "createdAt") 
         VALUES ($1, $1, $2, NOW()) 
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "City" = EXCLUDED."City"
         RETURNING id`,
        [dept.name, dept.city]
      );
      deptIds.set(dept.name, res.rows[0].id);
    }

    // 2. Create Officers
    console.log("Creating officer accounts...");
    const password = await hash("Officer@123", 10);

    const officerEmails = [
      { email: "officer.pwd@grievancehub.com", name: "PWD Officer", deptName: "Public Works Department (PWD)" },
      { email: "officer.water@grievancehub.com", name: "Water Board Officer", deptName: "Water Supply & Sewerage Board" },
      { email: "officer.electricity@grievancehub.com", name: "Electricity Officer", deptName: "State Electricity Board" },
      { email: "officer.waste@grievancehub.com", name: "Waste Mgmt Officer", deptName: "Municipal Corporation (Solid Waste)" },
      { email: "officer.traffic@grievancehub.com", name: "Traffic Officer", deptName: "Traffic Police" },
    ];

    for (const off of officerEmails) {
      const deptId = deptIds.get(off.deptName);
      await client.query(
        `INSERT INTO "User" (id, email, name, password, role, "departmentId", "isVerified", "createdAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, 'officer', $4, true, NOW()) 
         ON CONFLICT (email) DO UPDATE SET "departmentId" = EXCLUDED."departmentId", role = EXCLUDED.role`,
        [off.email, off.name, password, deptId]
      );
    }

    // 3. Create an Admin
    console.log("Creating admin account...");
    await client.query(
        `INSERT INTO "User" (id, email, name, password, role, "isVerified", "createdAt") 
         VALUES (gen_random_uuid(), 'admin@grievancehub.com', 'Super Admin', $1, 'admin', true, NOW()) 
         ON CONFLICT (email) DO NOTHING`,
        [password]
    );

    await client.query("COMMIT");
    console.log("✅ RAW SQL Seed completed successfully!");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Seed error:", e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
