import { PrismaClient } from '../generated/prisma'

declare global {
  var prisma: PrismaClient | undefined
}

// Check for different database URL environment variable names
const getDatabaseUrl = () => {
  // Common environment variable names used by various providers
  const possibleVars = [
    'DATABASE_URL',
    'POSTGRES_URL', 
    'SUPABASE_URL',
    'DB_URL',
    'POSTGRESQL_URL',
    'DATABASE_PRIVATE_URL',
    'POSTGRES_PRIVATE_URL'
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