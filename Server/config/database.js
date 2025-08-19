import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Connection options with pooling configuration
    const options = {
      // Connection Pool Settings
      maxPoolSize: 20,        // Maximum number of connections
      minPoolSize: 5,         // Minimum number of connections
      maxIdleTimeMS: 30000,   // Close connections after 30s of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a socket can be idle
      
      // Heartbeat frequency (for detecting failed connections)
      heartbeatFrequencyMS: 10000,
      
      // Retry configuration
      retryWrites: true,
      retryReads: true,
      
      // Write Concern (adjust based on needs)
      w: 'majority',
      wtimeoutMS: 5000,
      
      // Read Preference
      readPreference: 'primaryPreferred',
      
      // Compression
      compressors: ['zlib'],
      
      // Connection pool events for monitoring
      monitorCommands: true
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Connection Pool Size: ${options.maxPoolSize}`);
    
    // Monitor connection events
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected');
    });

    return conn;
  } catch (error) {
    console.error('💥 Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
