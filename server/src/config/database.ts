import mongoose from 'mongoose';

// Fallback MongoDB URI if .env not loaded
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Agora:Nishant1106@cluster0.2ycxoxb.mongodb.net/agora?retryWrites=true&w=majority';

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('🔍 MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
    
    // Check if MongoDB URI has placeholder password
    if (MONGODB_URI.includes('<db_password>')) {
      console.warn('⚠️  WARNING: MongoDB password not configured!');
      console.warn('⚠️  Please replace <db_password> in server/.env');
      console.warn('⚠️  See FIX_MONGODB_NOW.md for instructions');
      console.warn('⚠️  Server will run in LIMITED MODE without database');
      return; // Don't crash, just warn
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️  Server will continue without database (limited functionality)');
    // Don't crash - let server run for frontend testing
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});
