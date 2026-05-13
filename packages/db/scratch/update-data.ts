import { prisma } from '../src/index';

async function main() {
    console.log('Updating priorities...');
    const result = await prisma.grievance.updateMany({
        where: { priority: null },
        data: { priority: 'High' } // Just for testing visibility
    });
    console.log(`Updated ${result.count} grievances.`);

    const userResult = await prisma.user.updateMany({
        where: { isVerified: false },
        data: { isVerified: true }
    });
    console.log(`Updated ${userResult.count} users.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
