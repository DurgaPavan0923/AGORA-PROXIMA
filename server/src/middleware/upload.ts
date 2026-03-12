import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Create uploads directory safely
const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Secure storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${file.fieldname}-${timestamp}-${random}${ext}`);
  },
});

// Strict file validation
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeType = 'application/pdf';
  const allowedExtension = '.pdf';

  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === allowedMimeType && ext === allowedExtension) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Specific registration upload middleware
export const registrationUpload = upload.fields([
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'voterIdCard', maxCount: 1 },
]);