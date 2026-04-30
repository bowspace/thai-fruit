import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, expectSchema } from './helpers.js';
import { ProductListResponse, ProductDetailResponse } from '../src/openapi/schemas.js';

describe('GET /api/v1/products', () => {
  it('returns ProductListResponse with default pagination', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expectSchema(ProductListResponse, res.body);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('respects the limit query param', async () => {
    const res = await request(app).get('/api/v1/products?limit=1');
    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(1);
    expect(res.body.products.length).toBeLessThanOrEqual(1);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/v1/products?category=orange');
    expect(res.status).toBe(200);
    if (res.body.products.length > 0) {
      for (const p of res.body.products) {
        expect(p.category).toBe('orange');
      }
    }
  });

  it('rejects invalid query (limit > 100)', async () => {
    const res = await request(app).get('/api/v1/products?limit=999');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/products/:id', () => {
  it('returns ProductDetailResponse with related[]', async () => {
    const list = await request(app).get('/api/v1/products?limit=1');
    const firstId = list.body.products[0]?.id;
    expect(firstId).toBeDefined();

    const res = await request(app).get(`/api/v1/products/${firstId}`);
    expect(res.status).toBe(200);
    expectSchema(ProductDetailResponse, res.body);
    expect(res.body.id).toBe(firstId);
    expect(Array.isArray(res.body.related)).toBe(true);
  });
});

describe('POST /api/v1/products', () => {
  it('401 without an auth token', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: 'x', units: [{ label: 'kg', price: 100 }] });
    expect(res.status).toBe(401);
  });
});
