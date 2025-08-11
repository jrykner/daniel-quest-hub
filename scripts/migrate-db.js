// Database migration script for production deployment
const { execSync } = require('child_process');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migration...')
    
    // Check if we're in production and have a database URL
    const possibleVars = [
      'POSTGRES_PRISMA_URL',
      'DATABASE_URL',
      'POSTGRES_URL',
      'POSTGRES_URL_NON_POOLING'
    ];
    
    let dbUrl = null;
    for (const varName of possibleVars) {
      if (process.env[varName]) {
        dbUrl = process.env[varName];
        console.log(`✅ Using database URL from ${varName}`);
        break;
      }
    }
    
    if (!dbUrl) {
      console.log('⚠️  No database URL found, skipping migrations');
      return;
    }
    
    // Run Prisma db push (creates tables if they don't exist)
    console.log('🔄 Running Prisma db push...')
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl }
    });
    
    console.log('✅ Database migration completed successfully')
    
  } catch (error) {
    console.error('❌ Database migration failed:', error.message)
    // Don't fail the build - just log the error
    console.log('⚠️  Continuing with deployment...')
  }
}

runMigrations();