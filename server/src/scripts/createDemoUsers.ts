import mongoose from 'mongoose';
import { User } from '../models/User';
import { Election } from '../models/Election';
import { hashMPIN } from '../utils/crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Agora:Nishant1106@cluster0.2ycxoxb.mongodb.net/agora?retryWrites=true&w=majority';

async function createDemoUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Hash MPIN (1234) for all demo users
    const hashedMPIN = await hashMPIN('1234');

    // Demo Users
    const demoUsers = [
      {
        uniqueId: 'ADMIN-AGR-001',
        fullName: 'Admin User',
        phone: '8888888001',
        address: '456 Admin Lane, Delhi',
        aadhaar: '888888888801',
        role: 'admin',
        isVerified: true,
        mpin: hashedMPIN,
      },
      {
        uniqueId: 'EC-AGR-001',
        fullName: 'Election Commission',
        phone: '7777777001',
        address: '789 EC Tower, New Delhi',
        aadhaar: '777777777701',
        role: 'election_commission',
        isVerified: true,
        mpin: hashedMPIN,
      },
    ];

    // Clear existing admin/EC users
    await User.deleteMany({ 
      uniqueId: { $in: ['ADMIN-AGR-001', 'EC-AGR-001'] } 
    });
    console.log('🗑️  Cleared existing admin/EC users');

    // Create admin and EC users
    await User.insertMany(demoUsers);
    console.log('✅ Created admin and election commission users');

    // Create demo election
    await Election.deleteMany({ title: 'Demo Municipal Election 2025' });
    
    const demoElection = new Election({
      title: 'Demo Municipal Election 2025',
      description: 'Choose your local representative for the upcoming term',
      type: 'local',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'active',
      parties: [
        {
          id: 'party-001',
          name: 'Progressive Party',
          symbol: '🌟',
          manifesto: 'Focus on education and infrastructure development',
        },
        {
          id: 'party-002',
          name: 'People\'s Alliance',
          symbol: '🤝',
          manifesto: 'Healthcare and employment for all',
        },
        {
          id: 'party-003',
          name: 'Green Future',
          symbol: '🌱',
          manifesto: 'Environmental sustainability and clean energy',
        },
      ],
      totalVotes: 110,
      createdBy: 'EC-AGR-001',
    });

    await demoElection.save();
    console.log('✅ Created demo election');

    console.log('\n🎉 Admin and EC users created successfully!\n');
    console.log('═══════════════════════════════════════════════');
    console.log('📋 ADMIN & EC LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════\n');

    console.log('👨‍💼 ADMIN:');
    console.log('   Unique ID: ADMIN-AGR-001');
    console.log('   Phone: 8888888001');
    console.log('   MPIN: 1234\n');

    console.log('🏛️  ELECTION COMMISSION:');
    console.log('   Unique ID: EC-AGR-001');
    console.log('   Phone: 7777777001');
    console.log('   MPIN: 1234\n');

    console.log('═══════════════════════════════════════════════');
    console.log('📱 HOW TO LOGIN:');
    console.log('═══════════════════════════════════════════════\n');
    console.log('1. Go to: http://localhost:3000/auth');
    console.log('2. Enter Unique ID (ADMIN-AGR-001 or EC-AGR-001)');
    console.log('3. Click "Request OTP"');
    console.log('4. Check backend console for OTP (6-digit code)');
    console.log('5. Enter the OTP');
    console.log('6. Enter MPIN: 1234');
    console.log('7. Login successful!\n');
    console.log('📝 Note: Regular users/voters must register through');
    console.log('   the registration form and get verified by admin.\n');

    console.log('═══════════════════════════════════════════════');
    console.log('🗳️  DEMO ELECTION CREATED:');
    console.log('═══════════════════════════════════════════════\n');
    console.log('Title: Demo Municipal Election 2025');
    console.log('Type: Local Election');
    console.log('Status: Active');
    console.log('Parties: 3 (Progressive Party, People\'s Alliance, Green Future)');
    console.log('Current Votes: 110 total\n');

    console.log('✅ Admin and EC users ready to manage the platform!\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    process.exit(1);
  }
}

createDemoUsers();
