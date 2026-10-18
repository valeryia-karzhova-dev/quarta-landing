'use client';
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { formatPhone, normalizePhone, PHONE_HINT } from '@/lib/phone';

const INTENTS = ['Подписка', 'Разовый заказ', 'Вопрос'];
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'fbclid', 'gclid'];
const uid = () => (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

/** Источник заявки: первое касание, обновляется при новых UTM. */
function readAttribution(): Record<string, string> {
  let o: Record<string, string> = {};
  try { o = JSON.parse(sessionStorage.getItem('kv') || '{}'); } catch {}
  const p = new URLSearchParams(location.search);
  const n: Record<string, string> = {};
  KEYS.forEach((k) => { const v = p.get(k); if (v) n[k] = v; });
  if (Object.keys(n).length || !o.landing) o = { ...n, landing: location.href, referrer: document.referrer };
  try { sessionStorage.setItem('kv', JSON.stringify(o)); } catch {}
  return o;
}

export default function LeadForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [intent, setIntent] = useState(INTENTS[1]);
  const [comment, setComment] = useState('');
  const [site, setSite] = useState('');
  const [eName, setEName] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const attr = useRef<Record<string, string>>({});
  const key = useRef('');
  const nameEl = useRef<HTMLInputElement>(null);
  const phoneEl = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    attr.current = readAttribution();
    key.current = uid();
    // кнопки «Хочу» на странице подставляют тип заявки и комментарий
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      const b = t.closest<HTMLElement>('[data-i]');
      if (b) {
        setIntent(b.dataset.i ?? INTENTS[1]);
        const n = b.dataset.n;
        if (n) setComment((c) => c || `Хочу: ${n}`);
      }
      if (!t.closest('.dd')) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
  }, [open]);

  const pick = (v: string) => {
    setIntent(v);
    setOpen(false);
    document.getElementById('ddb')?.focus();
  };
  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const el = document.activeElement as HTMLElement;
    if (e.key === 'ArrowDown') { e.preventDefault(); ((el.nextElementSibling as HTMLElement | null) ?? el).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); ((el.previousElementSibling as HTMLElement | null) ?? el).focus(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    else if (e.key === 'Escape') { setOpen(false); document.getElementById('ddb')?.focus(); }
  };

  const phoneBlur = () => {
    const n = normalizePhone(phone);
    if (n) { setPhone(formatPhone(n)); setEPhone(''); }
    else if (phone) setEPhone(PHONE_HINT);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const nm = name.trim();
    const n = normalizePhone(phone);
    setState('idle');
    setEName(nm.length < 2 ? 'Напишите, как к вам обращаться' : '');
    setEPhone(n ? '' : PHONE_HINT);
    if (nm.length < 2) { nameEl.current?.focus(); return; }
    if (!n) { phoneEl.current?.focus(); return; }
    setBusy(true);
    const c = new AbortController();
    const tm = setTimeout(() => c.abort(), 10000);
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: c.signal,
        body: JSON.stringify({ name: nm, phone: n, intent, comment: comment.trim(), website: site, idempotencyKey: key.current, attribution: attr.current }),
      });
      if (r.status === 400) {
        const j = await r.json().catch(() => ({}));
        setEPhone(j.message || 'Проверьте номер телефона');
        phoneEl.current?.focus();
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      setState('ok');
      key.current = uid();
    } catch {
      setState('fail'); // тот же idempotencyKey: повторная отправка не создаст дубль
    } finally {
      clearTimeout(tm);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <fieldset disabled={state === 'ok'} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <label htmlFor="name">Имя</label>
        <input id="name" ref={nameEl} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" aria-invalid={!!eName} required />
        <span className="er">{eName}</span>

        <label htmlFor="phone">Телефон</label>
        <input id="phone" ref={phoneEl} type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 29 123-45-67"
          value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={phoneBlur} aria-invalid={!!ePhone} required />
        <span className="er">{ePhone}</span>

        <label htmlFor="ddb">Что интересует</label>
        <div className="dd">
          <button type="button" id="ddb" className="ddb" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>{intent}</button>
          {open && (
            <ul className="ddl" role="listbox" aria-label="Что интересует" ref={list} onKeyDown={onListKey}>
              {INTENTS.map((v) => (
                <li key={v} role="option" tabIndex={-1} aria-selected={v === intent} onClick={() => pick(v)}>{v}</li>
              ))}
            </ul>
          )}
        </div>

        <label htmlFor="comment">Комментарий</label>
        <textarea id="comment" maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} />
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={site} onChange={(e) => setSite(e.target.value)} />
        <p className="note">Нажимая кнопку, вы соглашаетесь на обработку имени и телефона, чтобы мы вам перезвонили.</p>
      </fieldset>
      {state !== 'ok' && <button className="btn" type="submit" disabled={busy}>{busy ? 'Отправляем…' : 'Отправить заявку'}</button>}
      {state === 'fail' && (
        <div className="fail" role="alert">
          Заявка не отправилась, но всё, что вы ввели, сохранено. Нажмите «Отправить заявку» ещё раз. Если не выходит, позвоните <a href="tel:+375290000000">+375 29 000-00-00</a> или напишите в <a href="https://t.me/kvarta_roast">Telegram</a>.
        </div>
      )}
      {state === 'ok' && (
        <div className="ok" role="status">
          <h3>Заявка принята</h3>
          <p>Позвоним в рабочее время: пн–пт 8:00–20:00, сб–вс 10:00–18:00.</p>
        </div>
      )}
    </form>
  );
}
