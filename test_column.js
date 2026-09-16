const { PrismaClient } = require('./generated/prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name='Expectations' AND column_name='preferredResidentArea';`;
        console.log("Query result:", result);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
