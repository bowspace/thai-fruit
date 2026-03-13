import 'dotenv/config';
import fs from 'fs';
import postgres from 'postgres';

// Build connection string from env
// Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
const ref = new URL(process.env.SUPABASE_URL).hostname.split('.')[0];
const password = process.env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_SERVICE_KEY;

const sql = postgres({
  host: `aws-0-ap-southeast-1.pooler.supabase.com`,
  port: 6543,
  database: 'postgres',
  username: `postgres.${ref}`,
  password: password,
  ssl: 'require',
  connection: { application_name: 'thaifruit-migrations' },
});

try {
  // Test connection
  const [{ current_database }] = await sql`SELECT current_database()`;
  console.log('Connected to:', current_database);

  // Read and run the combined migration
  const migrationSQL = fs.readFileSync(
    new URL('./migrations/000_all_migrations.sql', import.meta.url),
    'utf-8',
  );

  console.log('Running migrations...');
  await sql.unsafe(migrationSQL);
  console.log('Migrations completed successfully!');

  // Verify tables
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log('Tables created:', tables.map(t => t.table_name).join(', '));

  // Verify seed data
  const cats = await sql`SELECT count(*) as n FROM categories`;
  console.log('Categories seeded:', cats[0].n);

} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await sql.end();
}
