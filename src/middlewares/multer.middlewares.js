// In uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination directory for uploaded files
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Set the file name with original name and timestamp
    cb(null, Date.now() + path.extname(file.originalname))
}});





// Define file filter function to validate file type
const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf','image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Define the size limit for file uploads (e.g., 2MB)
const limits = {
  fileSize: 10 * 1024 * 1024 // 2MB
};

// Create the multer instance with storage, fileFilter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

export {upload};
