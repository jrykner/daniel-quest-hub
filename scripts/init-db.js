// Database initialization script
const { PrismaClient } = require('../src/generated/prisma')

async function initializeDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Checking database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if tables exist by trying to count users
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Database tables exist. Current user count: ${userCount}`)
    } catch (error) {
      console.log('⚠️  Database tables might not exist yet:', error.message)
      console.log('Run: npx prisma db push to create tables')
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Please check your DATABASE_URL or other database environment variables')
  } finally {
    await prisma.$disconnect()
  }
}

initializeDatabase()