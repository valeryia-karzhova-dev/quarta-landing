import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { normalizePhone, PHONE_HINT } from '@/lib/phone';

const INTENTS = ['Подписка', 'Разовый заказ', 'Вопрос'];
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>(); // простой rate-limit, работает в пределах одного инстанса

const s = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (body: object, status: number) => NextResponse.json(body, { status });

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 8;
}

async function notify(text: string) {
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chat } = process.env;
  if (!token || !chat) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML' }),
      signal: AbortSignal.timeout(5000),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return json({ code: 'rate_limited', message: 'Слишком много попыток. Подождите минуту.' }, 429);

  const raw = await req.text();
  if (raw.length > 10_000) return json({ code: 'too_large', message: 'Слишком большой запрос.' }, 413);
  let b: any;
  try {
    b = JSON.parse(raw);
  } catch {
    return json({ code: 'bad_json', message: 'Не удалось прочитать заявку.' }, 400);
  }
  if (s(b.website, 100)) return json({ status: 'created' }, 201); // honeypot: бот получает «успех»

  const name = s(b.name, 60);
  const intent = s(b.intent, 30);
  const comment = s(b.comment, 500);
  const phone = normalizePhone(s(b.phone, 40));
  if (!phone) return json({ code: 'invalid_phone', message: PHONE_HINT }, 400);
  if (name.length < 2 || !INTENTS.includes(intent)) {
    return json({ code: 'invalid_input', message: 'Проверьте имя и тип заявки.' }, 400);
  }

  const a = (typeof b.attribution === 'object' && b.attribution) || {};
  const at = (k: string) => s(a[k], 300);
  const id = s(b.idempotencyKey, 64) || crypto.randomUUID();
  const clickId = at('yclid') || at('fbclid') || at('gclid');

  let stored: 'created' | 'duplicate' | 'failed' = 'failed';
  try {
    const db = await getDb();
    const now = Date.now();
    // Один атомарный запрос: вставка только если за 10 минут нет заявки с этим номером.
    const r = await db.execute({
      sql: `INSERT OR IGNORE INTO leads (id, created_at, name, phone, intent, comment, utm_source, utm_medium,
              utm_campaign, utm_content, utm_term, click_id, landing_url, referrer, user_agent)
            SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            WHERE NOT EXISTS (SELECT 1 FROM leads WHERE phone = ? AND created_at > ?)`,
      args: [id, now, name, phone, intent, comment, at('utm_source'), at('utm_medium'), at('utm_campaign'),
        at('utm_content'), at('utm_term'), clickId, at('landing'), at('referrer'),
        s(req.headers.get('user-agent'), 300), phone, now - WINDOW_MS],
    });
    stored = r.rowsAffected > 0 ? 'created' : 'duplicate';
  } catch (e) {
    console.error('lead db error', e);
  }
  if (stored === 'duplicate') return json({ status: 'duplicate', leadId: id }, 200);

  const src = at('utm_source')
    ? [at('utm_source'), at('utm_medium'), at('utm_campaign'), at('utm_content')].filter(Boolean).join(' / ')
    : at('referrer') || 'прямой заход';
  const sent = await notify(
    [`<b>Новая заявка: ${esc(intent)}</b>`, esc(name), esc(phone), comment && esc(comment),
      `Источник: ${esc(src)}`, at('landing') && `Страница: ${esc(at('landing'))}`].filter(Boolean).join('\n'),
  );
  // БД не записала, но менеджер получил сообщение в Telegram: заявку считаем принятой.
  if (stored === 'failed' && !sent) return json({ code: 'unavailable', message: 'Не удалось отправить заявку.' }, 503);
  return json({ status: 'created', leadId: id }, 201);
}
