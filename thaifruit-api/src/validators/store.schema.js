import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().optional(),
  name_cn: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  description_cn: z.string().optional(),
  address: z.string().optional(),
  address_en: z.string().optional(),
  address_cn: z.string().optional(),
  pickup_info: z.string().optional(),
  pickup_info_en: z.string().optional(),
  pickup_info_cn: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().optional(),
});

export const updateStoreSchema = createStoreSchema.partial();
