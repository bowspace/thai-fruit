import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import storesRoutes from './routes/stores.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { mountDocs } from './openapi/index.js';

export function createApp() {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

  // Body parsing
  app.use(express.json());

  // Health check
  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // OpenAPI docs (Swagger UI + raw spec) — mounted before resource routes
  mountDocs(app);

  // Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/categories', categoriesRoutes);
  app.use('/api/v1/stores', storesRoutes);
  app.use('/api/v1/products', productsRoutes);
  app.use('/api/v1/orders', ordersRoutes);
  app.use('/api/v1/upload', uploadRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
}
