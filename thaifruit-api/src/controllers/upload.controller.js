import * as uploadService from '../services/upload.service.js';

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const url = await uploadService.uploadImage(req.file);
    res.json({ url });
  } catch (err) {
    next(err);
  }
}
