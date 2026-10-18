import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let ready: Promise<unknown> | null = null;

/** Создаёт таблицу при первом обращении и возвращает клиент. */
export async function getDb() {
  ready ??= db
    .batch([
      `CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, name TEXT, phone TEXT NOT NULL,
        intent TEXT, comment TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
        utm_content TEXT, utm_term TEXT, click_id TEXT, landing_url TEXT, referrer TEXT,
        user_agent TEXT, status TEXT NOT NULL DEFAULT 'new')`,
      `CREATE INDEX IF NOT EXISTS leads_phone_created ON leads (phone, created_at)`,
    ])
    .catch((e) => {
      ready = null;
      throw e;
    });
  await ready;
  return db;
}
