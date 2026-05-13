import prisma from "@team-call-of-code/db";

async function setup() {
  console.log("Creating default department...");
  const dept = await prisma.department.create({
    data: { name: 'General Support', City: 'Test City' }
  });

  console.log("Upgrading all users to officer...");
  await prisma.user.updateMany({
    data: { role: 'officer', departmentId: dept.id }
  });

  console.log("Assigning all grievances to the new department...");
  await prisma.grievance.updateMany({
    data: { departmentId: dept.id }
  });

  console.log("Done! You can now view the officer portal.");
}

setup().catch(console.error).finally(() => prisma.$disconnect());
