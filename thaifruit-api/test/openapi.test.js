import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './helpers.js';

describe('OpenAPI surface', () => {
  it('serves the JSON spec', async () => {
    const res = await request(app).get('/api/v1/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.info.title).toBe('ThaiFruit API');
    expect(Object.keys(res.body.paths || {}).length).toBeGreaterThan(10);
  });

  it('declares bearerAuth security scheme', async () => {
    const res = await request(app).get('/api/v1/openapi.json');
    expect(res.body.components?.securitySchemes?.bearerAuth?.scheme).toBe('bearer');
  });

  it('serves the Swagger UI HTML', async () => {
    const res = await request(app).get('/api/v1/docs/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('swagger-ui');
  });
});
