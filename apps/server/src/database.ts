import 'dotenv/config';
import pg from 'pg';
import { readdir, readFile } from 'node:fs/promises';
const mode=process.argv[2];if(!['migrate','seed'].includes(mode))throw new Error('Expected migrate or seed');
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});const c=await pool.connect();
try {
  await c.query('BEGIN');
  await c.query("SELECT pg_advisory_xact_lock(734621)");
  await c.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  const dir=new URL(`../../../db/${mode==='migrate'?'migrations':'seeds'}/`,import.meta.url);
  for(const file of (await readdir(dir)).filter(n=>n.endsWith('.sql')).sort()){
    if(mode==='migrate' && (await c.query('SELECT 1 FROM schema_migrations WHERE name=$1',[file])).rowCount)continue;
    await c.query(await readFile(new URL(file,dir),'utf8'));
    if(mode==='migrate')await c.query('INSERT INTO schema_migrations(name) VALUES($1)',[file]);
    console.log('Applied',file);
  }
  await c.query('COMMIT');
} catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();await pool.end();}
