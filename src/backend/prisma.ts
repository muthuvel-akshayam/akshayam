import { PrismaClient, Prisma } from '../../generated/prisma/client/client'
export { Prisma }
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';

const prismaClientSingleton = () => {
  // If there's no connection string in development, we can mock or throw, but typically we want it to run.
  if (!connectionString) {
    console.warn("DATABASE_URL is not set");
  }
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal4: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal4 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal4 = prisma
