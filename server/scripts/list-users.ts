import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// User Schema
const UserSchema = new mongoose.Schema(
  {
    uniqueId: String,
    fullName: String,
    phone: String,
    aadhaar: String,
    address: String,
    role: String,
    mpin: String,
    isVerified: Boolean,
    verifiedAt: Date,
    verifiedBy: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

async function listUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agora';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    const users = await User.find({}).select('-mpin').sort({ createdAt: -1 });

    console.log(`Found ${users.length} user(s):\n`);
    console.log('═══════════════════════════════════════════════════════════════');

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.fullName}`);
      console.log(`   Unique ID:  ${user.uniqueId}`);
      console.log(`   Phone:      ${user.phone}`);
      console.log(`   Aadhaar:    ${user.aadhaar}`);
      console.log(`   Role:       ${user.role}`);
      console.log(`   Verified:   ${user.isVerified ? '✓ Yes' : '✗ No'}`);
      console.log(`   Created:    ${user.createdAt}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    // Check for test user specifically
    const testUser = users.find(u => u.phone === '9999999999');
    if (testUser) {
      console.log('🎯 Test User Found!');
      console.log('\nLogin Credentials:');
      console.log('═══════════════════════════════════════');
      console.log(`Unique ID: ${testUser.uniqueId}`);
      console.log('Phone:     9999999999');
      console.log('MPIN:      1234 (default)');
      console.log('═══════════════════════════════════════\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  }
}

listUsers();
