import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { generateWallet, createDID } from '../blockchain/web3Config';

/**
 * Script to generate blockchain wallets for all users who don't have one
 * Run with: npm run generate-wallets
 */
async function generateWalletsForUsers() {
  try {
    console.log('🚀 Starting wallet generation for users...\n');

    // Connect to database
    await connectDatabase();

    // Find all users without wallet addresses
    const usersWithoutWallet = await User.find({
      $or: [
        { walletAddress: { $exists: false } },
        { walletAddress: null },
        { walletAddress: '' }
      ]
    });

    if (usersWithoutWallet.length === 0) {
      console.log('✅ All users already have wallets!\n');
      process.exit(0);
    }

    console.log(`📋 Found ${usersWithoutWallet.length} users without wallets\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutWallet) {
      try {
        // Generate new wallet
        const wallet = generateWallet();
        
        // Create DID
        const did = createDID(user.aadhaar, user.phone);

        // Update user with wallet info
        user.walletAddress = wallet.address;
        user.encryptedPrivateKey = wallet.privateKey; // In production, encrypt this!
        user.did = did;

        await user.save();

        console.log(`✅ Generated wallet for user: ${user.fullName} (${user.uniqueId})`);
        console.log(`   - Wallet: ${wallet.address}`);
        console.log(`   - DID: ${did}\n`);

        successCount++;
      } catch (error) {
        console.error(`❌ Failed to generate wallet for user ${user.uniqueId}:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   - Total users: ${usersWithoutWallet.length}`);
    console.log(`   - Success: ${successCount}`);
    console.log(`   - Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    if (successCount > 0) {
      console.log('✅ Wallet generation completed successfully!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
generateWalletsForUsers();
