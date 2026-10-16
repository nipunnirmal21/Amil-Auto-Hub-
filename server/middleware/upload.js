import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const uploadRoot = path.resolve('server/uploads');
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

function createStorage(folder) {
  const destination = path.join(uploadRoot, folder);
  mkdirSync(destination, { recursive: true });
  return multer.diskStorage({
    destination,
    filename(_req, file, callback) {
      const extension = extensions[file.mimetype] || '.jpg';
      callback(null, `${Date.now()}-${randomUUID()}${extension}`);
    },
  });
}

function imageUpload(folder) {
  return multer({
    storage: createStorage(folder),
    limits: { fileSize: 5 * 1024 * 1024, files: 7 },
    fileFilter(_req, file, callback) {
      if (!allowedMimeTypes.has(file.mimetype)) {
        const error = new Error('Only JPEG, PNG, and WebP images are allowed.');
        error.status = 400;
        return callback(error);
      }
      return callback(null, true);
    },
  });
}

export const productUpload = imageUpload('products').fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 6 },
]);
export const billboardUpload = imageUpload('billboards').single('image');
