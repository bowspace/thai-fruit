import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import * as ctrl from '../controllers/upload.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = Router();

router.post('/image', requireAuth, upload.single('image'), ctrl.uploadImage);

export default router;
