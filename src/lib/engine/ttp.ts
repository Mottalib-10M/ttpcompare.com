/**
 * Trusted traveler engine: costs over five and ten years, the chooser, renewal windows, the .ics
 * reminder, children in the PreCheck lane, Known Traveler Number formats and processing times.
 * Every fee and duration is read from data/params-2026.json; nothing here reads the clock
 * ("today" is always passed by the caller, RECETTE §17.5).
 */
import P from '../../data/params-2026.json';
import { addDays, addMonths, addYears, dayNum, type Iso } from './dates';

export type Program = 'precheck' | 'globalEntry' | 'nexus' | 'sentri' | 'clear' | 'clearPrecheck';
export type ProviderId = 'idemia' | 'telos' | 'clear';
export type Channel = 'online' | 'inPerson';
export const PROVIDERS = P.precheck.providers as Array<{ id: ProviderId; name: string; enroll: number; renewOnline: number; renewInPerson: number; locations: number; ktnPrefix: string; site: string }>;
export const provider = (id: ProviderId) => PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
export const PROGRAM_NAME: Record<Program, string> = {
  precheck: 'TSA PreCheck', globalEntry: 'Global Entry', nexus: 'NEXUS', sentri: 'SENTRI', clear: 'CLEAR+', clearPrecheck: 'CLEAR+ with TSA PreCheck through CLEAR',
};
const r2 = (x: number) => Math.round(x * 100) / 100;

/** Cheapest published renewal across providers and channels. */
export function cheapestRenewal(): { amount: number; who: string } {
  let best = { amount: Infinity, who: '' };
  for (const p of PROVIDERS) {
    if (p.renewOnline < best.amount) best = { amount: p.renewOnline, who: `${p.name} online` };
    if (p.renewInPerson < best.amount) best = { amount: p.renewInPerson, who: `${p.name} in person` };
  }
  return best;
}
export const cheapestEnroll = () => PROVIDERS.reduce((a, b) => (b.enroll < a.enroll ? b : a));

export interface CostInput {
  program: Program;
  years: 5 | 10;
  provider?: ProviderId;
  channel?: Channel;
  adults?: number;
  /** children under 18 travelling with the adults */
  kids?: number;
  /** application-fee credit of the card, per cardholder, once every `cardEvery` years (0 = none) */
  cardCredit?: number;
  cardEvery?: number;
  /** CLEAR+ statement credit per calendar year (0 = none) */
  clearCredit?: number;
}
export interface CostLine { label: string; amount: number }
export interface CostOut { gross: number; credits: number; net: number; perYear: number; lines: CostLine[]; note: string }

/**
 * Fee payments at year 0 and, for ten years, a renewal at year 5. A card credit "once every N years"
 * covers a payment when N years have passed since the previous covered payment (N ≤ 5 covers both).
 */
export function cost(i: CostInput): CostOut {
  const adults = Math.max(1, Math.round(i.adults ?? 1));
  const kids = Math.max(0, Math.round(i.kids ?? 0));
  const credit = Math.max(0, i.cardCredit ?? 0);
  const every = Math.max(1, i.cardEvery ?? 4);
  const lines: CostLine[] = [];
  let gross = 0, credits = 0;
  const pay = (label: string, amount: number, year: number, lastCovered: { y: number | null }, perPerson: number, covered = true) => {
    gross += amount;
    lines.push({ label, amount });
    if (covered && credit > 0 && perPerson > 0 && (lastCovered.y === null || year - lastCovered.y >= every)) {
      const c = Math.min(credit, perPerson) * adults;
      credits += c; lastCovered.y = year;
      lines.push({ label: `Card credit${adults > 1 ? `, ${adults} cardholders` : ''}`, amount: -c });
    }
  };
  const last = { y: null as number | null };
  const terms = i.years === 10 ? 2 : 1;
  let note = '';
  if (i.program === 'precheck') {
    const p = provider(i.provider ?? 'idemia');
    const renew = (i.channel ?? 'online') === 'online' ? p.renewOnline : p.renewInPerson;
    pay(`Enrollment with ${p.name}${adults > 1 ? ` × ${adults}` : ''}`, r2(p.enroll * adults), 0, last, p.enroll);
    if (terms === 2) pay(`Renewal with ${p.name}, ${(i.channel ?? 'online') === 'online' ? 'online' : 'in person'}${adults > 1 ? ` × ${adults}` : ''}`, r2(renew * adults), 5, last, renew);
    note = kids ? `Children 17 and under need no membership of their own when they fly with a PreCheck adult; from 13 they need the indicator on their boarding pass.` : `Fee of ${p.name} as published by TSA; the three providers sell the same membership.`;
  } else if (i.program === 'globalEntry' || i.program === 'nexus' || i.program === 'sentri') {
    const f = i.program === 'globalEntry' ? P.globalEntry.fee : i.program === 'nexus' ? P.nexus.fee : P.sentri.fee;
    for (let t = 0; t < terms; t++) pay(`${t ? 'Renewal' : 'Application'} fee${adults > 1 ? ` × ${adults}` : ''}`, f * adults, t * 5, last, f);
    if (kids) lines.push({ label: `${kids} child${kids > 1 ? 'ren' : ''} under 18`, amount: 0 });
    note = kids ? 'Applicants under 18 pay no fee when a parent or guardian is a member or applies at the same time.' : 'The fee is charged when you apply and is not refunded if the application is denied.';
  } else if (i.program === 'clear' || i.program === 'clearPrecheck') {
    const extra = Math.min(P.clear.familyMaxAdults, adults - 1);
    const perYear = P.clear.annual + extra * P.clear.familyAdd;
    const cc = Math.max(0, i.clearCredit ?? 0);
    let clearTotal = 0, clearCredits = 0;
    for (let y = 0; y < i.years; y++) {
      let year = perYear;
      if (i.program === 'clearPrecheck' && (y === 0 || y === 5)) {
        // TSA page: CLEAR issues a one-time code: CLEAR+ for $134 (new) or $146 (online renewal), price of CLEAR+ minus PreCheck.
        const pre = y === 0 ? provider('clear').enroll : provider('clear').renewOnline;
        const code = y === 0 ? P.precheck.clearPlusCodeNew : P.precheck.clearPlusCodeRenew;
        year = code + extra * P.clear.familyAdd;
        pay(`TSA PreCheck through CLEAR, year ${y + 1}${adults > 1 ? ` × ${adults}` : ''}`, r2(pre * adults), y, last, pre);
      }
      clearTotal += year;
      if (cc > 0) clearCredits += Math.min(cc, year);
    }
    gross += clearTotal;
    lines.push({ label: `CLEAR+ for ${i.years} years${extra ? `, ${extra} added adult${extra > 1 ? 's' : ''}` : ''}`, amount: clearTotal });
    if (clearCredits > 0) { credits += clearCredits; lines.push({ label: 'CLEAR+ card credit, each year', amount: -clearCredits }); }
    if (adults - 1 > P.clear.familyMaxAdults) note = `CLEAR adds at most ${P.clear.familyMaxAdults} adults to one membership; the others need their own.`;
    else note = kids ? `Children ${P.clear.kidsMaxAge} and under go through with a member at no charge.` : 'CLEAR+ renews every year at the published price unless you cancel.';
  }
  const net = Math.max(0, r2(gross - credits));
  return { gross: r2(gross), credits: r2(Math.min(credits, gross)), net, perYear: r2(net / i.years), lines, note };
}

/* ───────────────────────── Chooser ───────────────────────── */
export type Status = 'us' | 'lpr' | 'canadian' | 'mexican' | 'partner' | 'other';
export type CardKind = 'none' | 'ttp120' | 'ttp100' | 'ttpClear';
export interface Profile {
  status: Status;
  domestic: number; // round trips a year inside the US
  international: number; // round trips by air outside the US
  canadaLand: number; // land or sea crossings from Canada a year
  mexicoLand: number; // land crossings from Mexico a year
  military: boolean; // DoD ID holder
  card: CardKind;
  clearAirport: 'yes' | 'no' | 'unsure';
  passport: boolean;
}
export interface Choice { pick: string; programs: Program[]; perYear: number; perTrip: number | null; reasons: string[]; table: Array<{ program: string; eligible: boolean; fiveYears: number; gives: string }> }

const cardCredit = (c: CardKind) => (c === 'ttp120' || c === 'ttpClear' ? 120 : c === 'ttp100' ? 100 : 0);
export function eligible(status: Status) {
  return {
    precheck: status === 'us' || status === 'lpr',
    globalEntry: status === 'us' || status === 'lpr' || status === 'mexican' || status === 'partner',
    nexus: status === 'us' || status === 'lpr' || status === 'canadian',
    sentri: true,
  };
}

export function choose(p: Profile): Choice {
  const e = eligible(p.status);
  const credit = cardCredit(p.card);
  const trips = Math.max(0, p.domestic) + Math.max(0, p.international);
  const reasons: string[] = [];
  let programs: Program[] = [];
  let pick = '';
  const pre = cheapestEnroll();
  if (p.status === 'canadian') {
    programs = ['nexus'];
    pick = 'NEXUS';
    reasons.push('Canadian citizens cannot join TSA PreCheck or Global Entry directly; NEXUS members get TSA PreCheck and the Global Entry kiosks when entering the United States.');
  } else if (p.status === 'other') {
    if (p.mexicoLand > 0) { programs = ['sentri']; pick = 'SENTRI'; reasons.push('SENTRI has no citizenship requirement and speeds up land crossings from Mexico.'); }
    else { pick = 'None of the DHS programs'; reasons.push('TSA PreCheck is open to US citizens, US nationals and permanent residents; Global Entry to them and to the partner countries CBP lists.'); }
  } else if (p.status === 'mexican' || p.status === 'partner') {
    programs = ['globalEntry']; pick = 'Global Entry';
    reasons.push(p.status === 'mexican' ? 'Mexican nationals can apply for Global Entry, and Global Entry members get TSA PreCheck.' : 'Citizens of the partner countries listed by CBP can apply for Global Entry, with extra vetting by their own country; members get TSA PreCheck.');
  } else if (p.military) {
    programs = p.international > 0 ? ['globalEntry'] : [];
    pick = p.international > 0 ? 'Your DoD ID for PreCheck, plus Global Entry' : 'Your DoD ID number (free PreCheck)';
    reasons.push('Service members get TSA PreCheck at no cost by putting their DoD ID number in the Known Traveler Number field.');
    if (p.international > 0) reasons.push('Global Entry adds the customs kiosks when you fly back from abroad; it is the only part you would pay for.');
  } else if (p.canadaLand >= 2 && e.nexus) {
    programs = ['nexus']; pick = 'NEXUS';
    reasons.push(`NEXUS costs the same ${P.nexus.fee} dollars as Global Entry and adds the dedicated lanes into Canada; members also get the Global Entry kiosks and TSA PreCheck.`);
    reasons.push('The interview is done by both countries at a NEXUS enrollment center, most of them near the northern border.');
  } else if ((p.international > 0 || p.mexicoLand > 0 || credit >= P.globalEntry.fee) && p.passport) {
    programs = ['globalEntry']; pick = 'Global Entry';
    if (p.international > 0) reasons.push(`You fly back from abroad ${p.international} time${p.international > 1 ? 's' : ''} a year: Global Entry covers customs on the way in and includes TSA PreCheck on the way out.`);
    if (p.mexicoLand > 0) reasons.push('The Global Entry card also works in the SENTRI lanes from Mexico once your vehicle is registered with CBP.');
    if (credit >= P.globalEntry.fee) reasons.push(`Your card refunds up to ${credit} dollars of the fee, so Global Entry costs you nothing more than PreCheck would.`);
    reasons.push(`Over five years the gap with the cheapest PreCheck is ${r2(P.globalEntry.fee - pre.enroll)} dollars at enrollment.`);
  } else {
    programs = e.precheck ? ['precheck'] : [];
    pick = 'TSA PreCheck';
    if (!p.passport && (p.international > 0 || credit >= P.globalEntry.fee)) reasons.push('Global Entry needs a valid passport at the interview; without one, PreCheck is the program you can get now.');
    reasons.push(`You do not cross a border by air: PreCheck alone gives the faster security lane, from ${pre.enroll} dollars with ${pre.name} for five years.`);
  }
  // CLEAR+: only suggested where it can work and pay its way.
  const clearPaid = p.card === 'ttpClear';
  if (p.clearAirport !== 'no' && (clearPaid || p.domestic >= 12)) {
    programs = [...programs, 'clear'];
    pick += ' + CLEAR+';
    reasons.push(clearPaid ? 'Your card has a CLEAR+ credit: CLEAR+ then costs you nothing and skips the ID check line at airports with CLEAR lanes.' : `At ${p.domestic} round trips a year, CLEAR+ costs about ${r2(P.clear.annual / (2 * p.domestic))} dollars per departure. It only skips the ID check, so it is worth it where that line is long.`);
    if (p.clearAirport === 'unsure') reasons.push('Check that your home airport has CLEAR lanes on CLEAR’s own site before paying.');
  }
  // cost per year over five years, after card credits
  const base: Record<Program, CostInput> = {
    precheck: { program: 'precheck', years: 5, provider: pre.id, cardCredit: credit },
    globalEntry: { program: 'globalEntry', years: 5, cardCredit: credit },
    nexus: { program: 'nexus', years: 5, cardCredit: credit },
    sentri: { program: 'sentri', years: 5, cardCredit: credit },
    clear: { program: 'clear', years: 5, clearCredit: clearPaid ? P.clear.annual : 0 },
    clearPrecheck: { program: 'clearPrecheck', years: 5, cardCredit: credit },
  };
  const perYear = r2(programs.reduce((s, x) => s + cost(base[x]).perYear, 0));
  const table = [
    { program: 'TSA PreCheck', eligible: e.precheck && !p.military, fiveYears: p.military ? 0 : cost(base.precheck).net, gives: 'faster US security lane' },
    { program: 'Global Entry', eligible: e.globalEntry, fiveYears: cost(base.globalEntry).net, gives: 'customs kiosks on return + PreCheck' },
    { program: 'NEXUS', eligible: e.nexus, fiveYears: cost(base.nexus).net, gives: 'Canada and US lanes + kiosks + PreCheck' },
    { program: 'SENTRI', eligible: e.sentri, fiveYears: cost(base.sentri).net, gives: 'Mexico land lanes + PreCheck' },
    { program: 'CLEAR+', eligible: true, fiveYears: cost(base.clear).net, gives: 'skips the ID check line only' },
  ];
  return { pick, programs, perYear, perTrip: trips > 0 ? r2(perYear / trips) : null, reasons, table };
}

/* ───────────────────────── Renewal windows ───────────────────────── */
export type RenewProgram = 'precheck' | 'globalEntry' | 'nexus' | 'sentri' | 'clear';
export interface RenewEvent { date: Iso; title: string; detail: string }
export function renewal(program: RenewProgram, expiry: Iso, today: Iso): { events: RenewEvent[]; status: string } {
  const ev: RenewEvent[] = [];
  if (program === 'precheck') {
    const opens = addMonths(expiry, -P.precheck.renewOnlineMonthsBefore);
    const advise = addDays(expiry, -P.precheck.renewAdviseDaysBefore);
    ev.push({ date: opens, title: 'TSA PreCheck: online renewal opens', detail: `TSA: online renewal is possible up to ${P.precheck.renewOnlineMonthsBefore} months before expiry, and the new five years start when the current ones end. Renew only on a site ending in .gov (IDEMIA, Telos or CLEAR).` });
    ev.push({ date: advise, title: 'TSA PreCheck: renew by this date', detail: `TSA encourages renewing at least ${P.precheck.renewAdviseDaysBefore} days before expiry, because some approvals take up to ${P.precheck.ktnDaysMax} days.` });
    ev.push({ date: expiry, title: 'TSA PreCheck membership expires', detail: 'Without a renewal, the PreCheck indicator stops appearing on boarding passes after this date.' });
  } else if (program === 'clear') {
    for (let y = 0; y < 5; y++) ev.push({ date: addYears(expiry, y), title: 'CLEAR+ renews', detail: `CLEAR+ is billed every year (${P.clear.annual} dollars at the published price) unless you cancel before this date.` });
  } else {
    const name = PROGRAM_NAME[program];
    const opens = addMonths(expiry, -P.globalEntry.renewMonthsBefore);
    ev.push({ date: opens, title: `${name}: renewal opens`, detail: `CBP: you can renew one year before expiry on ttp.dhs.gov. The fee is ${P.globalEntry.fee} dollars.` });
    ev.push({ date: addDays(expiry, -1), title: `${name}: last day to apply and keep benefits`, detail: `If the renewal is submitted before expiry, CBP lets you keep using the benefits up to ${P.globalEntry.graceMonths} months after the expiration date while it is processed.` });
    ev.push({ date: expiry, title: `${name} membership expires`, detail: 'Applied before this date: benefits continue while the renewal is pending. Not applied: benefits stop today.' });
    ev.push({ date: addMonths(expiry, P.globalEntry.graceMonths), title: `${name}: end of the 24-month extension`, detail: 'Benefits stop here if the renewal is still not approved.' });
  }
  const d = dayNum(today);
  const next = ev.find((x) => dayNum(x.date) >= d);
  const status = !next ? 'Every date is past: the membership has expired, apply again.' : `Next: ${next.title.toLowerCase()} in ${dayNum(next.date) - d} days.`;
  return { events: ev, status };
}

/** iCalendar file (RFC 5545), all-day events, built in the browser: nothing is sent. */
export function ics(events: RenewEvent[], stamp: Iso, uidBase = 'renewal'): string {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const fold = (line: string) => { const out: string[] = []; let s = line; while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); } out.push(s); return out.join('\r\n'); };
  const d = (iso: Iso) => iso.replace(/-/g, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Radif Partners//Trusted traveler reminders//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  events.forEach((e, i) => {
    lines.push('BEGIN:VEVENT', `UID:${uidBase}-${i}-${d(e.date)}@trusted-traveler-reminder`, `DTSTAMP:${d(stamp)}T000000Z`, `DTSTART;VALUE=DATE:${d(e.date)}`, `DTEND;VALUE=DATE:${d(addDays(e.date, 1))}`, fold(`SUMMARY:${esc(e.title)}`), fold(`DESCRIPTION:${esc(e.detail)}`), 'TRANSP:TRANSPARENT',
      'BEGIN:VALARM', 'ACTION:DISPLAY', fold(`DESCRIPTION:${esc(e.title)}`), 'TRIGGER:-P7D', 'END:VALARM', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

/* ───────────────────────── Children in the PreCheck lane ───────────────────────── */
export function kidLane(age: number, adultHasIndicator: boolean, sameReservation: boolean): { lane: 'yes' | 'no' | 'maybe'; why: string } {
  const K = P.kids;
  if (age >= K.ownKtnAge) return { lane: 'no', why: `From ${K.ownKtnAge}, a traveler needs a Known Traveler Number of their own.` };
  if (!adultHasIndicator) return { lane: 'no', why: 'A child can only follow an adult whose boarding pass shows the TSA PreCheck indicator.' };
  if (age <= K.noIndicatorMaxAge) return { lane: 'yes', why: `Children ${K.noIndicatorMaxAge} and under go through with the adult; their own boarding pass needs no indicator.` };
  return sameReservation
    ? { lane: 'maybe', why: `From ${K.indicatorMinAge} to ${K.indicatorMaxAge}, only if the indicator also appears on the child's boarding pass: same airline, same reservation, and leave the child's KTN field empty.` }
    : { lane: 'no', why: `From ${K.indicatorMinAge} to ${K.indicatorMaxAge}, the child must be on the same reservation as the PreCheck adult to get the indicator.` };
}

/* ───────────────────────── Known Traveler Number ───────────────────────── */
export interface KtnOut { kind: 'precheck' | 'cbp' | 'dod' | 'unknown' | 'empty'; title: string; detail: string }
export function decodeKtn(raw: string): KtnOut {
  const s = raw.replace(/[\s-]/g, '').toUpperCase();
  if (!s) return { kind: 'empty', title: 'Type the number as it appears', detail: 'Spaces and dashes are ignored. Nothing you type leaves this page.' };
  const pre = PROVIDERS.find((p) => s.startsWith(p.ktnPrefix));
  if (pre && s.length >= P.precheck.ktnLength[0] && s.length <= P.precheck.ktnLength[1] && /^[A-Z0-9]+$/.test(s))
    return { kind: 'precheck', title: `TSA PreCheck number from ${pre.name}`, detail: `Starts with ${pre.ktnPrefix} and has ${s.length} characters: the format TSA gives for members enrolled through ${pre.name}. It stays the same after a renewal. Global Entry cannot be renewed with it.` };
  if (/^\d{9}$/.test(s) && P.precheck.passIdPrefixes.some((x) => s.startsWith(x)))
    return { kind: 'cbp', title: 'CBP PASS ID (Global Entry, NEXUS or SENTRI)', detail: 'Nine digits starting with one of the prefixes TSA lists: the membership number printed on the back of a CBP trusted traveler card. Put it in the Known Traveler Number field to get PreCheck.' };
  if (/^\d{10}$/.test(s))
    return { kind: 'dod', title: 'Possibly a DoD ID number', detail: 'Ten digits with no letters: the length of the DoD ID number that service members enter as their Known Traveler Number. TSA PreCheck numbers of 10 characters start with TT, TE or AC.' };
  return { kind: 'unknown', title: 'Not a format TSA describes', detail: 'TSA PreCheck numbers have 9 or 10 characters and start with TT, TE or AC; CBP PASS IDs have 9 digits. Look the number up on the official TSA KTN lookup tool or your TTP account.' };
}

/* ───────────────────────── Processing time ───────────────────────── */
export function processing(program: 'precheck' | 'globalEntry', applied: Iso) {
  if (program === 'precheck') {
    const [a, b] = P.precheck.ktnDaysTypical;
    return { typical: [addDays(applied, a), addDays(applied, b)] as [Iso, Iso], latest: addDays(applied, P.precheck.ktnDaysMax), card: null as Iso | null };
  }
  return { typical: [applied, addDays(applied, P.globalEntry.approvedWeeks * 7)] as [Iso, Iso], latest: addMonths(applied, P.globalEntry.maxMonths), card: addDays(applied, P.globalEntry.approvedWeeks * 7 + P.globalEntry.cardWeeks[1] * 7) };
}

/** NEXUS interview deadline after conditional approval (CBSA, rule of April 1, 2027). */
export function nexusInterviewDeadline(approved: Iso): Iso {
  const N = P.nexus;
  if (approved >= N.interviewRuleFrom) return addYears(approved, N.interviewYearsAfter);
  const five = addYears(approved, N.interviewYearsBefore);
  return five < N.interviewLastDate ? five : N.interviewLastDate;
}
