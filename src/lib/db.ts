import { PrismaClient } from '../generated/prisma'

declare global {
  var prisma: PrismaClient | undefined
}

// Check for different database URL environment variable names
const getDatabaseUrl = () => {
  // Common environment variable names used by various providers
  // POSTGRES_PRISMA_URL is specifically for Prisma operations
  const possibleVars = [
    'POSTGRES_PRISMA_URL',
    'DATABASE_URL',
    'POSTGRES_URL', 
    'POSTGRES_URL_NON_POOLING',
    'DATABASE_PRIVATE_URL',
    'POSTGRES_PRIVATE_URL',
    'SUPABASE_URL',
    'DB_URL',
    'POSTGRESQL_URL'
  ]
  
  for (const varName of possibleVars) {
    const url = process.env[varName]
    if (url) {
      console.log(`Using database URL from ${varName}`)
      return url
    }
  }
  
  console.error('No database URL found. Checked variables:', possibleVars)
  return undefined
}

export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}