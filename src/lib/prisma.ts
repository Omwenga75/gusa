import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

let dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.STORAGE_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.STORAGE_URL

if (dbUrl) {
  // Remove channel_binding parameter which causes TLS/SCRAM negotiation delays
  dbUrl = dbUrl.replace(/([?&])channel_binding=[^&]+(&|$)/, '$1').replace(/[?&]$/, '')
  
  // Ensure connection timeout is bounded to prevent slow serverless hangs
  if (!dbUrl.includes('connect_timeout')) {
    const sep = dbUrl.includes('?') ? '&' : '?'
    dbUrl += `${sep}connect_timeout=15`
  }
  if (!dbUrl.includes('pool_timeout')) {
    const sep = dbUrl.includes('?') ? '&' : '?'
    dbUrl += `${sep}pool_timeout=20`
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: {
              url: dbUrl,
            },
          },
        }
      : undefined
  )

// Cache Prisma client on globalThis across warm serverless function invocations
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma
