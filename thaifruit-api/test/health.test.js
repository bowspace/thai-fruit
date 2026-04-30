import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, expectSchema } from './helpers.js';
import { HealthResponse } from '../src/openapi/schemas.js';

describe('GET /api/v1/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expectSchema(HealthResponse, res.body);
  });
});
