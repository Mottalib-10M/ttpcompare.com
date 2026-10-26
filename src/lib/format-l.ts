/** Formatting for the en-US pages (RECETTE §4: one locale, en-US, US dollars). */
export type L = 'en';
const TAG = 'en-US';
export const langTag = (_lang: L = 'en') => TAG;
const cache = new Map<string, Intl.NumberFormat>();
function nf(o: Intl.NumberFormatOptions) {
  const k = JSON.stringify(o);
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(TAG, o));
  return cache.get(k)!;
}
export const formatNumberL = (v: number, _lang: L = 'en', d = 0) => nf({ minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
/** $120, $79.75: cents only when the official figure has them. */
export const money = (v: number, _lang: L = 'en') => {
  const cents = Math.round(Math.abs(v) * 100) % 100 !== 0;
  return `${v < 0 ? '-' : ''}$${formatNumberL(Math.abs(v), 'en', cents ? 2 : 0)}`;
};
export const pct = (v: number, _lang: L = 'en', d = 0) => `${formatNumberL(v * 100, 'en', d)}%`;
/** "2026-10-24" → "October 24, 2026" (UTC, never shifts a day). */
export const dateL = (iso: string, _lang: L = 'en') => new Date(`${iso}T00:00:00Z`).toLocaleDateString(TAG, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** "Oct 24, 2026" for tables. */
export const dateS = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(TAG, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
