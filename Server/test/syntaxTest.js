// Simple syntax test to verify all modules can be imported
const testSyntax = async () => {
  try {
    console.log('🔍 Testing module syntax...');
    
    // Test database module syntax
    const databaseModule = await import('../config/database.js');
    console.log('✅ Database module syntax OK');
    
    // Test monitoring utilities syntax
    const monitorModule = await import('../utils/dbMonitor.js');
    console.log('✅ Monitoring utilities syntax OK');
    
    // Test connection test syntax (without executing it)
    const testModule = await import('./connectionTest.js');
    console.log('✅ Connection test syntax OK');
    
    console.log('✅ All modules have valid syntax');
    console.log('✅ No syntax errors found in any module');
    
  } catch (error) {
    console.error('❌ Syntax test failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
};

testSyntax();
