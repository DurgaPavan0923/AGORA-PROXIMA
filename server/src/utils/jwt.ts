import jwt, { SignOptions } from 'jsonwebtoken';

export interface JWTPayload {
  uniqueId: string;
  role: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET || '';
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
}

export const generateToken = (payload: JWTPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, getSecret(), options);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, getSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
