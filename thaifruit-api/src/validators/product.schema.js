import { z } from 'zod';

const unitSchema = z.object({
  label: z.string().min(1),
  label_en: z.string().optional(),
  label_cn: z.string().optional(),
  price: z.number().positive(),
  sort_order: z.number().int().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().optional(),
  name_cn: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  description_cn: z.string().optional(),
  category_id: z.string().optional(),
  images: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  units: z.array(unitSchema).min(1),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  name_en: z.string().optional(),
  name_cn: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  description_cn: z.string().optional(),
  category_id: z.string().optional(),
  images: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  units: z.array(unitSchema).optional(),
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  store_id: z.string().uuid().optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
