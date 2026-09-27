import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

let dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.STORAGE_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.STORAGE_URL

// Ensure Neon connections use the high-performance pooled endpoint on serverless Vercel
if (dbUrl && dbUrl.includes('neon.tech') && !dbUrl.includes('-pooler')) {
  const atIndex = dbUrl.indexOf('@')
  const dotIndex = dbUrl.indexOf('.', atIndex)
  if (atIndex !== -1 && dotIndex !== -1) {
    dbUrl = dbUrl.slice(0, dotIndex) + '-pooler' + dbUrl.slice(dotIndex)
  }
}

// Optimize serverless connection pooling parameters
if (dbUrl && dbUrl.includes('neon.tech') && !dbUrl.includes('connection_limit')) {
  const separator = dbUrl.includes('?') ? '&' : '?'
  dbUrl += `${separator}connection_limit=10&pool_timeout=20`
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

// Cache the Prisma client on globalThis in both dev and production to reuse connections in warm lambdas
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma
