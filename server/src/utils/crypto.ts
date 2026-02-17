import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashMPIN = async (mpin: string): Promise<string> => {
  return bcrypt.hash(mpin, SALT_ROUNDS);
};

export const compareMPIN = async (mpin: string, hashedMPIN: string): Promise<boolean> => {
  return bcrypt.compare(mpin, hashedMPIN);
};

export const generateUniqueId = (role?: string): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  
  // Special unique ID for election commission (only one exists)
  if (role === 'election_commission') {
    return 'EC-AGR-001';
  }
  
  // Admin users get ADMIN prefix
  if (role === 'admin') {
    return `ADMIN-AGR-${timestamp}-${randomStr}`.toUpperCase();
  }
  
  // Regular users/voters get standard format
  return `AGR-${timestamp}-${randomStr}`.toUpperCase();
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
