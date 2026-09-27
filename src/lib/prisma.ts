import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

let dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.STORAGE_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.STORAGE_URL

// Ensure Neon connections use the high-performance pooled endpoint on serverless Vercel
if (dbUrl && dbUrl.includes('.aws.neon.tech') && !dbUrl.includes('-pooler.')) {
  dbUrl = dbUrl.replace('.aws.neon.tech', '-pooler.c-14.aws.neon.tech')
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

