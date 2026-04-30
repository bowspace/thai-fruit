import request from 'supertest';
import { createApp } from '../src/app.js';

// Reuse one app across tests — supertest doesn't bind a port, so this is safe.
export const app = createApp();

let cachedBuyerToken = null;

export async function getBuyerToken() {
  if (cachedBuyerToken) return cachedBuyerToken;
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'buyer@test.com', password: 'password123' });
  if (res.status !== 200) {
    throw new Error(`Test login failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  cachedBuyerToken = res.body.session.accessToken;
  return cachedBuyerToken;
}

// Asserts a Zod schema parses the response without throwing.
export function expectSchema(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const flat = result.error.issues.map(i => `${i.path.join('.') || '<root>'}: ${i.message}`).join('\n  ');
    throw new Error(`Response did not match schema:\n  ${flat}\n\nReceived:\n${JSON.stringify(data, null, 2).slice(0, 800)}`);
  }
}
