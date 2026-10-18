'use client';
import { useEffect, useState } from 'react';

const BASE = { d: '', m: '', label: 'Обжарено в четверг', line: 'Партия 5 кг. Доставка по Минску в пятницу.' };

export default function RoastTag() {
  const [s, setS] = useState(BASE);
  useEffect(() => {
    // последняя обжарка (четверг) по времени Минска
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Minsk' }));
    const dow = now.getDay();
    const t = new Date(now);
    t.setDate(now.getDate() - ((dow + 3) % 7));
    setS({
      d: String(t.getDate()),
      m: t.toLocaleDateString('ru', { day: 'numeric', month: 'long' }).replace(/^\d+\s*/, ''),
      label: dow === 4 ? 'Жарим сегодня' : BASE.label,
      line: dow === 5 ? 'Сегодня развозим по Минску.' : BASE.line,
    });
  }, []);
  return (
    <div className="tag">
      <span>{s.label}</span>
      <br />
      <span className="d"><b>{s.d}</b><span>{s.m}</span></span>
      <p>{s.line}</p>
    </div>
  );
}
