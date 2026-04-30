import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { z } from 'zod';
import { app, expectSchema } from './helpers.js';
import { Category } from '../src/openapi/schemas.js';

describe('GET /api/v1/categories', () => {
  it('returns Category[] in camelCase', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expectSchema(z.array(Category), res.body);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('every category has the documented fields (no snake_case leak)', async () => {
    const res = await request(app).get('/api/v1/categories');
    const sample = res.body[0];
    expect(sample).toHaveProperty('sortOrder');
    expect(sample).not.toHaveProperty('sort_order');
    expect(sample).not.toHaveProperty('name_en');
  });
});
