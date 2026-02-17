# Agora Backend API

Backend server for Agora - A secure citizen governance platform for voting and proposals.

## Features

- **User Authentication**: OTP + MPIN based secure authentication
- **User Verification**: Admin approval workflow for new users
- **Elections Management**: Create and manage elections with multiple parties
- **Proposals System**: Community proposals with yes/no/abstain voting
- **Role-Based Access Control**: User, Admin, and Election Commission roles
- **Vote Privacy**: Secure voting with one-vote-per-user enforcement
- **Statistics & Analytics**: Track voting participation and trends

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password/MPIN hashing
- Security: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or pnpm

## Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `CLIENT_URL`: Your frontend URL (for CORS)

4. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (creates pending user)
- `POST /api/auth/request-otp` - Request OTP for login
- `POST /api/auth/verify-otp-mpin` - Verify OTP and MPIN to login
- `GET /api/auth/verify` - Verify authentication token
- `POST /api/auth/id-proof` - Issue ID proof for user

### Admin
- `GET /api/admin/pending-users` - Get all pending user registrations
- `POST /api/admin/verify-user` - Approve and verify pending user
- `POST /api/admin/reject-user` - Reject pending user
- `POST /api/admin/create-election-commission` - Create election commission user
- `GET /api/admin/stats` - Get admin statistics

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get election by ID
- `POST /api/elections` - Create new election (Election Commission/Admin only)
- `PUT /api/elections/:id` - Update election (Election Commission/Admin only)
- `POST /api/elections/:id/vote` - Vote in election
- `GET /api/elections/:id/check-voted` - Check if user has voted

### Proposals
- `GET /api/proposals` - Get all proposals (with optional filters)
- `GET /api/proposals/:id` - Get proposal by ID
- `POST /api/proposals` - Create new proposal
- `POST /api/proposals/:id/vote` - Vote on proposal (yes/no/abstain)
- `GET /api/proposals/:id/check-voted` - Check if user has voted
- `PUT /api/proposals/:id/status` - Update proposal status (Admin/EC only)

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-mpin` - Change user MPIN
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/voting-history` - Get user's voting history

## Authentication Flow

1. **Registration**:
   - User submits registration with Aadhaar, phone, etc.
   - Creates a pending user awaiting admin approval

2. **Admin Verification**:
   - Admin reviews pending users
   - On approval, generates unique ID and sets initial MPIN
   - User account is activated

3. **Login**:
   - User requests OTP with phone number
   - OTP sent to phone (currently logged to console in dev)
   - User verifies OTP and MPIN
   - JWT token issued for session

4. **Protected Routes**:
   - Include JWT token in Authorization header: `Bearer <token>`
   - Or token automatically sent via httpOnly cookie

## Database Models

- **User**: Verified users with unique IDs
- **PendingUser**: Users awaiting verification
- **Election**: Election details with parties
- **Vote**: Individual votes in elections
- **Proposal**: Community proposals
- **ProposalVote**: Individual votes on proposals
- **OTP**: Temporary OTP records

## Security Features

- MPIN hashing with bcrypt
- JWT-based authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation
- One vote per user enforcement
- HTTP-only cookies for tokens

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── adminController.ts
│   │   ├── electionController.ts
│   │   ├── proposalController.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   └── auth.ts           # Authentication middleware
│   ├── models/
│   │   ├── User.ts
│   │   ├── PendingUser.ts
│   │   ├── Election.ts
│   │   ├── Vote.ts
│   │   ├── Proposal.ts
│   │   ├── ProposalVote.ts
│   │   └── OTP.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── admin.ts
│   │   ├── elections.ts
│   │   ├── proposals.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── jwt.ts            # JWT utilities
│   │   └── crypto.ts         # Encryption utilities
│   └── server.ts             # Main server file
├── package.json
├── tsconfig.json
└── .env.example
```

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting

### Testing
```bash
npm run lint
```

## Deployment

### Environment Variables
Make sure to set production values for:
- `NODE_ENV=production`
- `JWT_SECRET` (use a strong, random secret)
- `MONGODB_URI` (production database)
- `CLIENT_URL` (production frontend URL)

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Integration with Frontend

The frontend (Next.js client) should:

1. Make API requests to `http://localhost:5000/api` (development)
2. Include JWT token in requests:
   ```javascript
   fetch('/api/elections', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```
3. Handle cookie-based authentication automatically

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
