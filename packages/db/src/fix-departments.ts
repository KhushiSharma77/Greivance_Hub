import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const OFFICIAL_DEPARTMENTS = [
  "Public Works Department (PWD)",
  "Water Supply & Sewerage Board",
  "State Electricity Board",
  "Municipal Corporation (Solid Waste)",
  "Traffic Police",
  "Environment & Forest Department",
  "General Administration",
];

async function main() {
  console.log("🛠️ Starting Department Fix Script...");
  const client = await pool.connect();

  try {
    // 1. Get all departments
    const { rows: departments } = await client.query('SELECT * FROM "Department"');
    console.log(`Found ${departments.length} departments.`);
    departments.forEach(d => console.log(`- "${d.name}"`));

    // 2. Identify duplicates and unoffical ones
    const processedNames = new Set();
    
    for (const dept of departments) {
      const isOfficial = OFFICIAL_DEPARTMENTS.includes(dept.name);
      const isDuplicate = processedNames.has(dept.name);
      
      if (!isOfficial || isDuplicate) {
        console.log(`⚠️ Action needed for: "${dept.name}" (ID: ${dept.id}, Official: ${isOfficial}, Duplicate: ${isDuplicate})`);

        // Find target
        let targetDeptName = dept.name;
        if (!isOfficial) {
            if (dept.name.toLowerCase().includes("water")) targetDeptName = "Water Supply & Sewerage Board";
            else if (dept.name.toLowerCase().includes("road") || dept.name.toLowerCase().includes("pothole") || dept.name.toLowerCase().includes("pwd")) targetDeptName = "Public Works Department (PWD)";
            else if (dept.name.toLowerCase().includes("electricity") || dept.name.toLowerCase().includes("power")) targetDeptName = "State Electricity Board";
            else if (dept.name.toLowerCase().includes("waste") || dept.name.toLowerCase().includes("garbage")) targetDeptName = "Municipal Corporation (Solid Waste)";
            else if (dept.name.toLowerCase().includes("traffic")) targetDeptName = "Traffic Police";
            else if (dept.name.toLowerCase().includes("forest") || dept.name.toLowerCase().includes("environment")) targetDeptName = "Environment & Forest Department";
            else targetDeptName = "General Administration";
        }

        // Get target department ID (pick the oldest one or the first one found)
        const { rows: targetRows } = await client.query(
            'SELECT id FROM "Department" WHERE name = $1 AND id != $2 ORDER BY "createdAt" ASC LIMIT 1', 
            [targetDeptName, dept.id]
        );
        
        if (targetRows.length > 0) {
          const targetId = targetRows[0].id;
          console.log(`➡️ Merging into "${targetDeptName}" (ID: ${targetId})`);

          // Update grievances
          await client.query('UPDATE "Grievance" SET "departmentId" = $1 WHERE "departmentId" = $2', [targetId, dept.id]);
          // Update users
          await client.query('UPDATE "User" SET "departmentId" = $1 WHERE "departmentId" = $2', [targetId, dept.id]);
          // Delete old
          await client.query('DELETE FROM "Department" WHERE id = $1', [dept.id]);
          console.log(`✅ Merged and deleted "${dept.name}".`);
        } else if (!isOfficial) {
             console.log(`🆕 Keeping "${dept.name}" as the primary for its name (it will be renamed if needed).`);
             // Rename if it's unofficial but the only one
             if (targetDeptName !== dept.name) {
                 await client.query('UPDATE "Department" SET name = $1 WHERE id = $2', [targetDeptName, dept.id]);
                 console.log(`📝 Renamed to "${targetDeptName}".`);
             }
        }
      }
      processedNames.add(dept.name);
    }

    console.log("🏁 Department Fix Script completed!");
  } catch (e) {
    console.error("❌ Error during fix:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
