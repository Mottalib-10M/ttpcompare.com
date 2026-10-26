/**
 * Dates civiles en jours entiers (UTC), sans fuseau ni heure : « 2026-10-24 » ↔ numéro de jour.
 * Aucune lecture de l'horloge ici : « aujourd'hui » est toujours passé par l'appelant (hydratation, RECETTE §17.5).
 */
export type Iso = string; // « AAAA-MM-JJ »

export function dayNum(d: Iso): number {
  const [y, m, j] = d.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, j) / 86400000);
}
export function isoOf(n: number): Iso {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}
export function addDays(d: Iso, n: number): Iso {
  return isoOf(dayNum(d) + n);
}
/** Ajoute des années civiles ; un 29 février tombe au 28 février d'une année non bissextile. */
export function addYears(d: Iso, n: number): Iso {
  const [y, m, j] = d.split('-').map(Number);
  const yy = y + n;
  const last = new Date(Date.UTC(yy, m, 0)).getUTCDate();
  return `${yy}-${String(m).padStart(2, '0')}-${String(Math.min(j, last)).padStart(2, '0')}`;
}
export function addMonths(d: Iso, n: number): Iso {
  const [y, m, j] = d.split('-').map(Number);
  const t = y * 12 + (m - 1) + n;
  const yy = Math.floor(t / 12), mm = (t % 12) + 1;
  const last = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  return `${yy}-${String(mm).padStart(2, '0')}-${String(Math.min(j, last)).padStart(2, '0')}`;
}
export const maxIso = (...xs: Iso[]) => xs.reduce((a, b) => (a > b ? a : b));
export const minIso = (...xs: Iso[]) => xs.reduce((a, b) => (a < b ? a : b));

/** Un voyage hors du pays : jour du départ et jour du retour (retour vide = toujours dehors). */
export interface Trip { out: Iso; back: Iso | null }

/**
 * Jours d'absence d'un voyage tombant dans la fenêtre [from, to] (bornes comprises).
 * Les trois pays ne comptent que les jours entiers passés dehors : le jour du départ et celui du
 * retour sont des jours de présence (UK : guidance « whole days » ; CA : « no time at all in Canada » ;
 * AU : document FOI fa-250801434). Un aller-retour dans la journée ou le lendemain ne compte donc pas.
 */
export function absentDaysIn(t: Trip, from: Iso, to: Iso): number {
  const first = dayNum(t.out) + 1;
  const last = t.back ? dayNum(t.back) - 1 : Number.POSITIVE_INFINITY;
  const a = Math.max(first, dayNum(from)), b = Math.min(last, dayNum(to));
  return b >= a ? b - a + 1 : 0;
}
export function totalAbsent(trips: Trip[], from: Iso, to: Iso): number {
  return trips.reduce((s, t) => s + absentDaysIn(t, from, to), 0);
}
/** Vrai si la personne est dehors toute la journée « d » (ni départ ni retour ce jour-là). */
export function isAbroadAllDay(trips: Trip[], d: Iso): boolean {
  return trips.some((t) => absentDaysIn(t, d, d) === 1);
}
/** Voyages valides : retour au plus tôt le jour du départ ; triés ; chevauchements refusés. */
export function checkTrips(trips: Trip[]): string | null {
  const s = [...trips].sort((a, b) => (a.out < b.out ? -1 : 1));
  for (let i = 0; i < s.length; i++) {
    if (s[i].back && s[i].back! < s[i].out) return `retour avant départ (${s[i].out})`;
    if (i > 0 && (!s[i - 1].back || s[i - 1].back! > s[i].out)) return `voyages qui se chevauchent (${s[i].out})`;
  }
  return null;
}
