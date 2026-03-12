// ===============================
// Environment Configuration
// ===============================
import 'dotenv/config';

// ===============================
// Core Imports
// ===============================
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

// ===============================
// Internal Imports
// ===============================
import { connectDatabase } from './config/database';
import { authenticate, requireRole } from './middleware/auth';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import electionRoutes from './routes/elections';
import proposalRoutes from './routes/proposals';
import userRoutes from './routes/user';

// ===============================
// App Initialization
// ===============================
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// Database Connection
// ===============================
connectDatabase();

// ===============================
// Security Middleware
// ===============================
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate Limiter
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests. Please try again later.',
    },
  })
);

// ===============================
// Body Parsing
// ===============================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ===============================
// Performance Middleware
// ===============================
app.use(compression());

// Logging
app.use(
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')
);

// ===============================
// Secure File Access (Protected)
// ===============================
// Prevent public access to uploads
app.get(
  '/uploads/:filename',
  authenticate,
  requireRole('admin'),
  (req: Request, res: Response) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    res.sendFile(filePath);
  }
);

// ===============================
// API Routes
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/user', userRoutes);

// ===============================
// Health Check
// ===============================
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Agora Backend API',
  });
});

// ===============================
// Root Endpoint
// ===============================
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Agora Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      elections: '/api/elections',
      proposals: '/api/proposals',
      user: '/api/user',
    },
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Error:', err);

    res.status(500).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        message: err.message,
      }),
    });
  }
);

// ===============================
// Process-Level Error Handling
// ===============================
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});