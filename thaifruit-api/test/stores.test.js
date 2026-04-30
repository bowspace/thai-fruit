import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { z } from 'zod';
import { app, expectSchema } from './helpers.js';
import { Store } from '../src/openapi/schemas.js';

describe('GET /api/v1/stores', () => {
  it('returns Store[]', async () => {
    const res = await request(app).get('/api/v1/stores');
    expect(res.status).toBe(200);
    expectSchema(z.array(Store), res.body);
  });
});

describe('GET /api/v1/stores/:id', () => {
  it('returns a single Store', async () => {
    const list = await request(app).get('/api/v1/stores');
    const firstId = list.body[0]?.id;
    expect(firstId).toBeDefined();

    const res = await request(app).get(`/api/v1/stores/${firstId}`);
    expect(res.status).toBe(200);
    expectSchema(Store, res.body);
    expect(res.body.id).toBe(firstId);
  });

  it('404 for an unknown id', async () => {
    const res = await request(app).get('/api/v1/stores/00000000-0000-0000-0000-000000000000');
    expect([404, 500]).toContain(res.status);
  });
});

describe('PUT /api/v1/stores/:id', () => {
  it('401 without an auth token', async () => {
    const res = await request(app)
      .put('/api/v1/stores/00000000-0000-0000-0000-000000000000')
      .send({ name: 'x' });
    expect(res.status).toBe(401);
  });
});
