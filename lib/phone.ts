export const PHONE_HINT = 'Введите белорусский номер, например +375 29 123-45-67';

/** Приводит номер к виду +375XXXXXXXXX или возвращает null. Принимаются коды 25, 29, 33, 44. */
export function normalizePhone(v: string): string | null {
  let d = v.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('80')) d = '375' + d.slice(2);
  else if (d.length === 10 && d[0] === '0') d = '375' + d.slice(1);
  else if (d.length === 9) d = '375' + d;
  return /^375(25|29|33|44)\d{7}$/.test(d) ? '+' + d : null;
}

export const formatPhone = (p: string) => p.replace(/(\+375)(\d\d)(\d{3})(\d\d)(\d\d)/, '$1 $2 $3-$4-$5');
