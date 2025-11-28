// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export const db = client