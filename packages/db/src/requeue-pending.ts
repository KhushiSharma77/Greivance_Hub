import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function guessDepartment(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("electricity") || t.includes("electric") || t.includes("power") || t.includes("light") || t.includes("wire") || t.includes("transformer")) {
    return "State Electricity Board";
  }
  if (t.includes("water") || t.includes("sewage") || t.includes("drain") || t.includes("pipe") || t.includes("leakage")) {
    return "Water Supply & Sewerage Board";
  }
  if (t.includes("road") || t.includes("pothole") || t.includes("street") || t.includes("pavement") || t.includes("bridge")) {
    return "Public Works Department (PWD)";
  }
  if (t.includes("garbage") || t.includes("waste") || t.includes("trash") || t.includes("clean")) {
    return "Municipal Corporation (Solid Waste)";
  }
  if (t.includes("traffic") || t.includes("signal") || t.includes("parking")) {
    return "Traffic Police";
  }
  if (t.includes("pollution") || t.includes("tree") || t.includes("forest") || t.includes("park")) {
    return "Environment & Forest Department";
  }
  return "General Administration";
}

async function main() {
  console.log("🛠️ Fixing grievances with missing departments...");
  const client = await pool.connect();

  try {
    // Find all grievances (PENDING or ANALYZED) with no department assigned
    const { rows: stuck } = await client.query(`
      SELECT id, "originalText", status, "departmentId"
      FROM "Grievance"
      WHERE "departmentId" IS NULL
    `);

    console.log(`Found ${stuck.length} grievances needing fix.`);

    for (const g of stuck) {
      const deptName = guessDepartment(g.originalText);
      console.log(`\n📋 Grievance: "${g.originalText.substring(0, 60)}..." (Status: ${g.status})`);
      
      // Find the department
      const { rows: deptRows } = await client.query(
        `SELECT id FROM "Department" WHERE name = $1 LIMIT 1`,
        [deptName]
      );

      if (deptRows.length === 0) {
        console.error(`   ❌ Department "${deptName}" not found in DB!`);
        continue;
      }

      const deptId = deptRows[0].id;
      console.log(`   → Assigning to: "${deptName}" (ID: ${deptId})`);

      // Update the grievance
      await client.query(
        `UPDATE "Grievance" SET "departmentId" = $1, status = 'ANALYZED', "updatedAt" = NOW() WHERE id = $2`,
        [deptId, g.id]
      );

      console.log(`   ✅ Fixed.`);
    }

    console.log("\n🏁 Fix complete!");
  } catch (e) {
    console.error("❌ Error:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
