import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
app.listen(env.port, () => {
  console.log(`ThaiFruit API running on port ${env.port}`);
  console.log(`Docs:  http://localhost:${env.port}/api/v1/docs`);
});
