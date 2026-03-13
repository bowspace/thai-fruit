import { supabaseAdmin } from '../config/supabase.js';
import { env } from '../config/env.js';

export async function uploadImage(file) {
  const ext = file.originalname.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `products/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(env.storageBucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from(env.storageBucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
