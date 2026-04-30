import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, expectSchema, getBuyerToken } from './helpers.js';
import { AuthResponse, Profile } from '../src/openapi/schemas.js';

describe('POST /api/v1/auth/login', () => {
  it('returns AuthResponse for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'buyer@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expectSchema(AuthResponse, res.body);
    expect(res.body.session.accessToken).toBeTruthy();
  });

  it('rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'buyer@test.com', password: 'wrong-password' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('400 for malformed body', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('returns the buyer Profile when authenticated', async () => {
    const token = await getBuyerToken();
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expectSchema(Profile, res.body);
    expect(res.body.email).toBe('buyer@test.com');
  });

  it('401 without a token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('401 with a garbage token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer not-a-real-jwt');
    expect(res.status).toBe(401);
  });
});
