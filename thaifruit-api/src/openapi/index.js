// Generates the OpenAPI document from the Zod registry and mounts Swagger UI.
// Call mountDocs(app) once during app setup, before resource routes.

import swaggerUi from 'swagger-ui-express';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry.js';

let cachedSpec = null;

function buildSpec() {
  if (cachedSpec) return cachedSpec;
  const generator = new OpenApiGeneratorV3(registry.definitions);
  cachedSpec = generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'ThaiFruit API',
      version: '1.0.0',
      description:
        'REST API for the ThaiFruit marketplace. Buyer flows (browse · cart · order) and seller flows (store · products · orders).',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local dev' },
      { url: 'https://nonsecretly-unclinging-anne.ngrok-free.dev', description: 'ngrok tunnel (current session)' },
    ],
    tags: [
      { name: 'System', description: 'Health and infrastructure' },
      { name: 'Auth', description: 'Sign-up, sign-in, current user' },
      { name: 'Catalog', description: 'Public reads — categories, stores, products' },
      { name: 'Orders', description: 'Buyer and seller order flows' },
      { name: 'Seller', description: 'Endpoints scoped to the seller’s own store' },
    ],
  });
  return cachedSpec;
}

export function getOpenApiSpec() {
  return buildSpec();
}

export function mountDocs(app) {
  const spec = buildSpec();
  app.get('/api/v1/openapi.json', (_req, res) => res.json(spec));
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spec, {
    customSiteTitle: 'ThaiFruit API Docs',
    swaggerOptions: { persistAuthorization: true },
  }));
}
