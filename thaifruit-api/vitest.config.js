import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    // Single fork so we don't fight rate-limit / Supabase rate ceilings,
    // and so the buyer-token cache is shared across files.
    pool: 'forks',
    isolate: false,
    testTimeout: 15000,
  },
});
