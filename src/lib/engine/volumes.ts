/**
 * TSA checkpoint throughput (public daily numbers, tsa.gov/travel/passenger-volumes), refreshed by
 * scripts/update-data.py. No wait time is computed here: TSA publishes how many people were screened
 * each day, not how long they waited. The tools compare days with each other, nothing more.
 */
import V from '../../data/tsa-volumes.json';
import { addDays, type Iso } from './dates';

const DAYS = V.days as Record<string, number>;
export const VOLUMES_READ: Iso = V.retrieved_at;
export const FIRST_DAY: Iso = Object.keys(DAYS)[0];
export const LAST_DAY: Iso = Object.keys(DAYS).slice(-1)[0];
const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const weekday = (d: Iso) => WEEKDAY[new Date(`${d}T00:00:00Z`).getUTCDay()];
export const count = (d: Iso): number | null => DAYS[d] ?? null;
export const yearDays = (y: number) => Object.entries(DAYS).filter(([d]) => d.startsWith(`${y}-`));

/** A date with a published number, or the same weekday 52 (then 104) weeks earlier. */
export function reference(d: Iso): { date: Iso; n: number; exact: boolean } | null {
  for (const back of [0, 364, 728]) {
    const x = addDays(d, -back);
    if (DAYS[x] != null) return { date: x, n: DAYS[x], exact: back === 0 };
  }
  return null;
}
/** Share of the days of the same year with fewer travelers screened. */
export function percentile(d: Iso): number {
  const y = Number(d.slice(0, 4));
  const list = yearDays(y).map(([, n]) => n);
  const v = DAYS[d];
  if (v == null || !list.length) return NaN;
  return list.filter((n) => n < v).length / list.length;
}
export function weekdayAverages(y: number): Array<{ day: string; avg: number }> {
  const acc = WEEKDAY.map(() => ({ s: 0, n: 0 }));
  for (const [d, n] of yearDays(y)) { const w = new Date(`${d}T00:00:00Z`).getUTCDay(); acc[w].s += n; acc[w].n += 1; }
  return WEEKDAY.map((day, i) => ({ day, avg: acc[i].n ? Math.round(acc[i].s / acc[i].n) : 0 }));
}
export function busiest(y: number, k = 10): Array<{ date: Iso; n: number }> {
  return yearDays(y).map(([date, n]) => ({ date, n })).sort((a, b) => b.n - a.n).slice(0, k);
}
export function quietest(y: number, k = 5): Array<{ date: Iso; n: number }> {
  return yearDays(y).map(([date, n]) => ({ date, n })).sort((a, b) => a.n - b.n).slice(0, k);
}
export function yearTotal(y: number, upTo?: Iso): number {
  return yearDays(y).filter(([d]) => !upTo || d <= upTo).reduce((s, [, n]) => s + n, 0);
}
