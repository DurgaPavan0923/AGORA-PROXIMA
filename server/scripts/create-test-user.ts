import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// User Schema (inline to avoid import issues)
const UserSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    aadhaar: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{12}$/,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'election_commission', 'voter'],
      default: 'user',
    },
    mpin: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: String,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    did: {
      type: String,
      unique: true,
      sparse: true,
    },
    sbtTokenId: {
      type: String,
    },
    encryptedPrivateKey: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agora';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Check if user already exists
    const existingUser = await User.findOne({ phone: '9999999999' });
    if (existingUser) {
      console.log('⚠ Test user already exists!');
      console.log('\nLogin Credentials:');
      console.log('═══════════════════════════════════════');
      console.log('Unique ID: IND-CITIZEN-2024-TEST001');
      console.log('Phone:     9999999999');
      console.log('MPIN:      1234');
      console.log('═══════════════════════════════════════\n');
      process.exit(0);
    }

    // Hash the MPIN
    const hashedMpin = await bcrypt.hash('1234', 10);

    // Create test user
    const testUser = new User({
      uniqueId: 'IND-CITIZEN-2024-TEST001',
      fullName: 'Test User',
      phone: '9999999999',
      aadhaar: '123456789012',
      address: '123 Test Street, Test City, Test State - 123456',
      role: 'voter',
      mpin: hashedMpin,
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: 'System Admin',
    });

    await testUser.save();
    console.log('✓ Test user created successfully!\n');

    console.log('Login Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('Unique ID: IND-CITIZEN-2024-TEST001');
    console.log('Phone:     9999999999');
    console.log('MPIN:      1234');
    console.log('═══════════════════════════════════════\n');

    console.log('📝 Instructions:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the frontend: cd ../client && npm run dev');
    console.log('3. Navigate to: http://localhost:3000/auth');
    console.log('4. Login with the credentials above\n');

    console.log('⚠ Note: OTP verification might be skipped in development mode');
    console.log('   If OTP is required, check the backend console for the OTP\n');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  }
}

createTestUser();
