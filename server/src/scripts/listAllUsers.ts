import { connectDatabase } from '../config/database';
import { User } from '../models/User';

async function listAllUsers() {
  try {
    console.log('🔍 Fetching all users from database...\n');

    await connectDatabase();

    const users = await User.find({}).select('+mpin');

    console.log('═'.repeat(80));
    console.log(`📊 TOTAL USERS IN DATABASE: ${users.length}`);
    console.log('═'.repeat(80));
    console.log();

    users.forEach((user, index) => {
      console.log(`${index + 1}️⃣  USER #${index + 1}`);
      console.log('─'.repeat(80));
      console.log(`👤 Full Name:      ${user.fullName}`);
      console.log(`📱 Phone:          ${user.phone}`);
      console.log(`🆔 Aadhaar:        ${user.aadhaar}`);
      console.log(`🔑 Unique ID:      ${user.uniqueId}`);
      console.log(`🔐 MPIN:           ${user.mpin} (hashed)`);
      console.log(`👔 Role:           ${user.role}`);
      console.log(`✅ Verified:       ${user.isVerified ? 'Yes' : 'No'}`);
      console.log(`💼 Wallet:         ${user.walletAddress || 'Not assigned'}`);
      console.log(`🌐 DID:            ${user.did || 'Not assigned'}`);
      console.log(`📍 Address:        ${user.address}`);
      console.log(`📅 Created:        ${user.createdAt}`);
      console.log('═'.repeat(80));
      console.log();
    });

    console.log('✅ Query completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listAllUsers();
