// Wire every Express route into the OpenAPI registry. The order in which
// paths are registered drives the order they appear in Swagger UI.

import { z } from 'zod';
import {
  registry,
  Category,
  Store,
  Product,
  ProductListResponse,
  ProductDetailResponse,
  Order,
  Profile,
  AuthResponse,
  HealthResponse,
  UploadResponse,
  ErrorResponse,
  SignupRequest,
  LoginRequest,
  CreateStoreRequest,
  UpdateStoreRequest,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQuery,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from './schemas.js';

// Bearer (Supabase JWT) — required by every protected endpoint
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const json = (schema) => ({
  description: 'OK',
  content: { 'application/json': { schema } },
});

const error = (description) => ({
  description,
  content: { 'application/json': { schema: ErrorResponse } },
});

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

// ---------- Health ----------

registry.registerPath({
  method: 'get',
  path: '/api/v1/health',
  tags: ['System'],
  summary: 'Server liveness probe',
  responses: { 200: json(HealthResponse) },
});

// ---------- Auth ----------

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/signup',
  tags: ['Auth'],
  summary: 'Create a new buyer or seller account',
  request: {
    body: { content: { 'application/json': { schema: SignupRequest } } },
  },
  responses: {
    201: json(AuthResponse),
    400: error('Validation error'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/login',
  tags: ['Auth'],
  summary: 'Sign in with email + password',
  request: {
    body: { content: { 'application/json': { schema: LoginRequest } } },
  },
  responses: {
    200: json(AuthResponse),
    400: error('Invalid credentials'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/auth/me',
  tags: ['Auth'],
  summary: 'Return the authenticated user’s profile',
  security: [{ bearerAuth: [] }],
  responses: {
    200: json(Profile),
    401: error('Missing or invalid token'),
  },
});

// ---------- Categories ----------

registry.registerPath({
  method: 'get',
  path: '/api/v1/categories',
  tags: ['Catalog'],
  summary: 'List all fruit categories (seeded, ASCII slugs)',
  responses: { 200: json(z.array(Category)) },
});

// ---------- Stores ----------

registry.registerPath({
  method: 'get',
  path: '/api/v1/stores',
  tags: ['Catalog'],
  summary: 'List active stores',
  responses: { 200: json(z.array(Store)) },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/stores/{id}',
  tags: ['Catalog'],
  summary: 'Get a store by id',
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: json(Store),
    404: error('Store not found'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/stores',
  tags: ['Seller'],
  summary: 'Create the seller’s store (one per owner)',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateStoreRequest } } },
  },
  responses: {
    201: json(Store),
    401: error('Unauthenticated'),
    409: error('Owner already has a store'),
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/v1/stores/{id}',
  tags: ['Seller'],
  summary: 'Update the seller’s own store',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: { content: { 'application/json': { schema: UpdateStoreRequest } } },
  },
  responses: {
    200: json(Store),
    401: error('Unauthenticated'),
    403: error('Not your store'),
  },
});

// ---------- Products ----------

registry.registerPath({
  method: 'get',
  path: '/api/v1/products',
  tags: ['Catalog'],
  summary: 'List active products with optional filtering',
  request: { query: ProductQuery },
  responses: { 200: json(ProductListResponse) },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/products/{id}',
  tags: ['Catalog'],
  summary: 'Get a product with units, store, and related products',
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: json(ProductDetailResponse),
    404: error('Product not found'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/products',
  tags: ['Seller'],
  summary: 'Create a product in the seller’s own store',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateProductRequest } } },
  },
  responses: {
    201: json(Product),
    401: error('Unauthenticated'),
    403: error('You do not have a store'),
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/v1/products/{id}',
  tags: ['Seller'],
  summary: 'Update a product owned by the seller',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: { content: { 'application/json': { schema: UpdateProductRequest } } },
  },
  responses: {
    200: json(Product),
    401: error('Unauthenticated'),
    403: error('Not your product'),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/products/{id}',
  tags: ['Seller'],
  summary: 'Soft-delete a product (sets is_active=false)',
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: json(z.object({ success: z.boolean() })),
    401: error('Unauthenticated'),
    403: error('Not your product'),
  },
});

// ---------- Orders ----------

registry.registerPath({
  method: 'post',
  path: '/api/v1/orders',
  tags: ['Orders'],
  summary: 'Place an order. Items spanning multiple stores split into one order per store.',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateOrderRequest } } },
  },
  responses: {
    201: json(z.array(Order)),
    400: error('Invalid product or unit references'),
    401: error('Unauthenticated'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/orders',
  tags: ['Orders'],
  summary: 'List orders. Buyers see their own orders; sellers see orders for their store.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: json(z.array(Order)),
    401: error('Unauthenticated'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/orders/{id}',
  tags: ['Orders'],
  summary: 'Get a single order. Allowed for the buyer or the store owner.',
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: json(Order),
    401: error('Unauthenticated'),
    403: error('Access denied'),
    404: error('Order not found'),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/orders/{id}/status',
  tags: ['Seller'],
  summary: 'Seller transitions an order through its status states',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: { content: { 'application/json': { schema: UpdateOrderStatusRequest } } },
  },
  responses: {
    200: json(Order),
    401: error('Unauthenticated'),
    403: error('Not your store order'),
    404: error('Order not found'),
  },
});

// ---------- Upload ----------

registry.registerPath({
  method: 'post',
  path: '/api/v1/upload/image',
  tags: ['Seller'],
  summary: 'Upload a product image (JPG/PNG, max 5 MB) to Supabase Storage',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            image: z.any().openapi({ type: 'string', format: 'binary' }),
          }),
        },
      },
    },
  },
  responses: {
    201: json(UploadResponse),
    401: error('Unauthenticated'),
    413: error('File too large'),
  },
});

export { registry };
