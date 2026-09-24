import { PrismaClient } from './generated/prisma/client/client/index.js';
const prisma = new PrismaClient();

async function main() {
  const otps = await prisma.otpVerification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('LATEST OTPS:', otps);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
