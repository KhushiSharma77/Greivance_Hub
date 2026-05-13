import { prisma } from '../src/index';

async function main() {
    const users = await prisma.user.findMany({
        include: { _count: { select: { grievances: true } } }
    });
    console.log('--- USERS ---');
    users.forEach(u => console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Verified: ${u.isVerified}, Complaints: ${u._count.grievances}`));

    const grievances = await prisma.grievance.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
    });
    console.log('\n--- RECENT GRIEVANCES ---');
    grievances.forEach(g => console.log(`ID: ${g.id}, Status: ${g.status}, Public: ${g.isPublic}, User: ${g.user.name}, Priority: ${g.priority}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
