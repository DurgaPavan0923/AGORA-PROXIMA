# Quick Start Guide

Get the Agora backend up and running in 5 minutes.

## Prerequisites

- Node.js v18+
- MongoDB v6+

## Installation

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env file and set:
#    - MONGODB_URI (your MongoDB connection string)
#    - JWT_SECRET (a secure random string)
#    - CLIENT_URL (your frontend URL)

# 5. Start MongoDB (if not running)
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# 6. Run the server
npm run dev
```

## Verify Installation

Visit `http://localhost:5000` in your browser. You should see:

```json
{
  "message": "Agora Backend API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

## Create First Admin User

Since admin approval is required for users, you'll need to manually create the first admin user in MongoDB:

```javascript
// Connect to MongoDB shell
mongo

// Use agora database
use agora

// Insert admin user
db.users.insertOne({
  uniqueId: "AGR-ADMIN-001",
  fullName: "Admin User",
  phone: "9999999999",
  aadhaar: "999999999999",
  address: "Admin Office",
  role: "admin",
  mpin: "$2a$10$xyz...", // Hash of "123456" - use bcrypt to generate
  isVerified: true,
  verifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use this Node.js script:

```javascript
// createAdmin.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/agora');
  
  const User = mongoose.model('User', new mongoose.Schema({
    uniqueId: String,
    fullName: String,
    phone: String,
    aadhaar: String,
    address: String,
    role: String,
    mpin: String,
    isVerified: Boolean,
    verifiedAt: Date,
  }, { timestamps: true }));

  const mpin = await bcrypt.hash('123456', 10);
  
  await User.create({
    uniqueId: 'AGR-ADMIN-001',
    fullName: 'Admin User',
    phone: '9999999999',
    aadhaar: '999999999999',
    address: 'Admin Office',
    role: 'admin',
    mpin,
    isVerified: true,
    verifiedAt: new Date(),
  });

  console.log('Admin created! Login with phone: 9999999999, MPIN: 123456');
  process.exit(0);
}

createAdmin();
```

## Test the API

### 1. Request OTP
```bash
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999"}'
```

Check console logs for OTP.

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp-mpin \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999", "otp": "YOUR_OTP", "mpin": "123456"}'
```

### 3. Use the token
```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. Read [README.md](./README.md) for full documentation
2. Check [API_DOCS.md](./API_DOCS.md) for all endpoints
3. Connect your frontend to `http://localhost:5000`

## Common Issues

### MongoDB not connecting
- Check if MongoDB is running
- Verify MONGODB_URI in .env file

### Port already in use
- Change PORT in .env file
- Or kill process on port 5000: `npx kill-port 5000`

### JWT token errors
- Make sure JWT_SECRET is set in .env
- Token expires after 24 hours by default

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Use production MongoDB (MongoDB Atlas)
4. Enable HTTPS
5. Set proper CORS origin

```bash
npm run build
npm start
```

## Support

For issues, check the main README or open an issue on the repository.
