import { PrismaClient } from './generated/prisma/client/index.js';
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Success:", !!user);
  } catch (error) {
    console.error("Prisma Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
