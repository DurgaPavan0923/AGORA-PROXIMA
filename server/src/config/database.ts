import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in environment variables');
      console.warn('⚠️  Server will continue without database (limited functionality)');
      return;
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 — fixes DNS resolution on many networks
    });
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
