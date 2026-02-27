import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Handle cleanup on hot reload
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGTERM', async () => {
    await prisma.$disconnect()
  })
  
  process.on('SIGINT', async () => {
    await prisma.$disconnect()
  })
}