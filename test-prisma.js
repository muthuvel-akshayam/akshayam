const { PrismaClient } = require('./generated/prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'User';
    `;
    console.log("Columns:", columns);
  } catch (error) {
    console.error("Prisma Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
