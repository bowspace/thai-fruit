import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { z } from 'zod';
import { app, expectSchema, getBuyerToken } from './helpers.js';
import { Order } from '../src/openapi/schemas.js';

describe('GET /api/v1/orders', () => {
  it('returns Order[] for the authenticated buyer', async () => {
    const token = await getBuyerToken();
    const res = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expectSchema(z.array(Order), res.body);
  });

  it('401 without a token', async () => {
    const res = await request(app).get('/api/v1/orders');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/orders', () => {
  it('400 with empty body', async () => {
    const token = await getBuyerToken();
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('401 without a token', async () => {
    const res = await request(app).post('/api/v1/orders').send({ items: [] });
    expect(res.status).toBe(401);
  });
});
