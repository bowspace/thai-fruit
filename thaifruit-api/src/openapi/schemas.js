// Response Zod schemas — mirror utils/mappers.js so the OpenAPI spec stays
// in lock-step with what the API actually returns.

import { z } from 'zod';
import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  signupSchema,
  loginSchema,
} from '../validators/auth.schema.js';
import {
  createStoreSchema,
  updateStoreSchema,
} from '../validators/store.schema.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validators/product.schema.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/order.schema.js';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// ---------- Common ----------

export const ErrorResponse = registry.register(
  'ErrorResponse',
  z.object({
    error: z.string().openapi({ example: 'Invalid login credentials' }),
  })
);

// ---------- Category ----------

export const Category = registry.register(
  'Category',
  z.object({
    id: z.string().openapi({ example: 'orange' }),
    name: z.string().openapi({ example: 'ส้ม' }),
    nameEn: z.string().nullable().openapi({ example: 'Orange' }),
    nameCn: z.string().nullable().openapi({ example: '橙子' }),
    icon: z.string().nullable().openapi({ example: '🍊' }),
    sortOrder: z.number().int().openapi({ example: 1 }),
  })
);

// ---------- Store ----------

export const Store = registry.register(
  'Store',
  z.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid().nullable(),
    name: z.string(),
    nameEn: z.string().nullable(),
    nameCn: z.string().nullable(),
    owner: z.string().nullable(),
    description: z.string().nullable(),
    descriptionEn: z.string().nullable(),
    descriptionCn: z.string().nullable(),
    address: z.string().nullable(),
    addressEn: z.string().nullable(),
    addressCn: z.string().nullable(),
    pickup: z.string().nullable(),
    pickupEn: z.string().nullable(),
    pickupCn: z.string().nullable(),
    phone: z.string().nullable(),
    avatar: z.string().openapi({ example: '🌳' }),
    rating: z.number().openapi({ example: 4.8 }),
    totalSales: z.number().int().openapi({ example: 1250 }),
    isActive: z.boolean().optional(),
    createdAt: z.string().openapi({ format: 'date-time', example: '2026-04-30T12:00:00.000+00:00' }).optional(),
  })
);

// ---------- Product ----------

export const ProductUnit = registry.register(
  'ProductUnit',
  z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    label: z.string().openapi({ example: 'ลัง 5 กก.' }),
    labelEn: z.string().nullable(),
    labelCn: z.string().nullable(),
    price: z.number().openapi({ example: 100 }),
    sortOrder: z.number().int(),
  })
);

export const Product = registry.register(
  'Product',
  z.object({
    id: z.string().uuid(),
    storeId: z.string().uuid(),
    name: z.string(),
    nameEn: z.string().nullable(),
    nameCn: z.string().nullable(),
    description: z.string().nullable(),
    descriptionEn: z.string().nullable(),
    descriptionCn: z.string().nullable(),
    category: z.string().nullable(),
    images: z.array(z.string()),
    featured: z.boolean(),
    isActive: z.boolean().optional(),
    createdAt: z.string().openapi({ format: 'date-time', example: '2026-04-30T12:00:00.000+00:00' }).optional(),
    units: z.array(ProductUnit),
    store: Store.partial().optional(),
  })
);

export const ProductListResponse = registry.register(
  'ProductListResponse',
  z.object({
    products: z.array(Product),
    total: z.number().int().nullable(),
    page: z.number().int(),
    limit: z.number().int(),
  })
);

export const ProductDetailResponse = registry.register(
  'ProductDetailResponse',
  Product.extend({
    related: z.array(Product),
  })
);

// ---------- Order ----------

export const OrderItem = registry.register(
  'OrderItem',
  z.object({
    id: z.string().uuid(),
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    productName: z.string(),
    unitLabel: z.string(),
    unitPrice: z.number(),
    qty: z.number().int(),
    subtotal: z.number(),
  })
);

export const Order = registry.register(
  'Order',
  z.object({
    id: z.string().uuid(),
    orderNumber: z.string().openapi({ example: 'TF-1A2B3C' }),
    storeId: z.string().uuid(),
    buyerId: z.string().uuid(),
    status: z.enum(['pending', 'confirmed', 'shipped', 'done', 'cancelled']),
    total: z.number(),
    note: z.string().nullable(),
    items: z.array(OrderItem),
    createdAt: z.string().openapi({ format: 'date-time', example: '2026-04-30T12:00:00.000+00:00' }).optional(),
    updatedAt: z.string().openapi({ format: 'date-time', example: '2026-04-30T12:00:00.000+00:00' }).optional(),
    store: Store.partial().optional(),
  })
);

// ---------- Auth ----------

export const Profile = registry.register(
  'Profile',
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    nameEn: z.string().nullable(),
    nameCn: z.string().nullable(),
    avatar: z.string().nullable(),
    role: z.enum(['buyer', 'seller']),
    lineId: z.string().nullable(),
    createdAt: z.string().openapi({ format: 'date-time', example: '2026-04-30T12:00:00.000+00:00' }).optional(),
  })
);

export const Session = registry.register(
  'Session',
  z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.number().int().optional(),
    expiresIn: z.number().int().optional(),
    tokenType: z.string().openapi({ example: 'bearer' }),
  })
);

export const AuthResponse = registry.register(
  'AuthResponse',
  z.object({
    user: Profile,
    session: Session,
  })
);

export const HealthResponse = registry.register(
  'HealthResponse',
  z.object({
    status: z.literal('ok'),
    timestamp: z.string().openapi({ format: 'date-time', example: '2026-04-30T12:00:00.000+00:00' }),
  })
);

export const UploadResponse = registry.register(
  'UploadResponse',
  z.object({
    url: z.string().url(),
  })
);

// ---------- Re-export request schemas (registered for $ref reuse) ----------

export const SignupRequest = registry.register('SignupRequest', signupSchema);
export const LoginRequest = registry.register('LoginRequest', loginSchema);
export const CreateStoreRequest = registry.register('CreateStoreRequest', createStoreSchema);
export const UpdateStoreRequest = registry.register('UpdateStoreRequest', updateStoreSchema);
export const CreateProductRequest = registry.register('CreateProductRequest', createProductSchema);
export const UpdateProductRequest = registry.register('UpdateProductRequest', updateProductSchema);
export const ProductQuery = productQuerySchema;
export const CreateOrderRequest = registry.register('CreateOrderRequest', createOrderSchema);
export const UpdateOrderStatusRequest = registry.register('UpdateOrderStatusRequest', updateOrderStatusSchema);
