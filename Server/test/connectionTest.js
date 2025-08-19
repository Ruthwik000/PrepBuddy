import connectDB from '../config/database.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📋 Environment check:');
    console.log('- MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set!');
      console.log('💡 Please create a .env file with your MongoDB connection string');
      process.exit(1);
    }
    
    await connectDB();
    console.log('✅ Connection test successful');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('🔍 Full error:', error);
    process.exit(1);
  }
};

// Only run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection();
}
