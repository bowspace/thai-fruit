import { z } from 'zod';

const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  unit_id: z.string().uuid(),
  qty: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  note: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'done', 'cancelled']),
});
