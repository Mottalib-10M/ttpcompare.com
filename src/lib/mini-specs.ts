/**
 * Mini-tools of the pages (RECETTE §9.3): one subject = one calculation, always through the engines
 * (`lib/engine/ttp.ts`, `lib/engine/volumes.ts`) and the data files, never a second formula.
 * Date inputs hold a day number (days since 1970-01-01, UTC); their default is the build day (§17.5).
 */
import type { MiniSpec } from './mini-types';
import P from '../data/params-2026.json';
import EOA from '../data/eoa-airports.json';
import { money, formatNumberL, dateL, pct } from './format-l';
import { cost, kidLane, processing, nexusInterviewDeadline, renewal, PROVIDERS, cheapestEnroll, cheapestRenewal, type Program } from './engine/ttp';
import { dayNum, isoOf, addYears } from './engine/dates';
import { reference, percentile, weekday, weekdayAverages, busiest, LAST_DAY, VOLUMES_READ } from './engine/volumes';

const BUILD_DAY: string = typeof __BUILD_DAY__ !== 'undefined' ? __BUILD_DAY__ : P.retrieved_at;
const TODAY = dayNum(BUILD_DAY);
const at = <T,>(list: T[], i: number) => list[Math.max(0, Math.min(list.length - 1, Math.round(i)))];
const yesNo = [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }];
const n0 = (v: number) => formatNumberL(v);
const days = (a: string, b: string) => dayNum(b) - dayNum(a);

/* Enrollment on Arrival: states and countries with a listed airport */
const GROUPS = (() => {
  const g = new Map<string, string[]>();
  for (const x of EOA.us) g.set(x.state, [...(g.get(x.state) ?? []), `${x.name} (${x.code})`]);
  const us = [...g.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const ab = new Map<string, string[]>();
  for (const x of EOA.abroad) ab.set(x.country, [...(ab.get(x.country) ?? []), `${x.name} (${x.code})`]);
  return [...us.map(([k, v]) => ({ label: k, list: v, abroad: false })), ...[...ab.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => ({ label: k, list: v, abroad: true }))];
})();
const STATE_NAMES: Record<string, string> = { AK: 'Alaska', AZ: 'Arizona', CA: 'California', CO: 'Colorado', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky', LA: 'Louisiana', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', NJ: 'New Jersey', NY: 'New York', NV: 'Nevada', NC: 'North Carolina', OH: 'Ohio', OR: 'Oregon', PA: 'Pennsylvania', TX: 'Texas', UT: 'Utah', VA: 'Virginia', WA: 'Washington', WI: 'Wisconsin' };
const groupLabel = (g: { label: string; abroad: boolean }) => (g.abroad ? `${g.label} (abroad)` : STATE_NAMES[g.label] ?? g.label);

const MIL = [
  { label: 'Active duty, Reserve, National Guard or Coast Guard', cost: 0, how: 'Enter your DoD ID number in the Known Traveler Number field of each reservation.', note: 'Also cadets of the service academies, USPHS and NOAA Corps members.' },
  { label: 'DoD civilian employee', cost: 0, how: 'Opt in once through ID Card Office Online, then use your DoD ID number as KTN.', note: 'The benefit stops when you leave DoD.' },
  { label: 'Military spouse', cost: -P.military.spouseDiscount, how: `${money(P.military.spouseDiscount)} off the enrollment or renewal fee of a provider.`, note: 'You still enroll and get your own KTN.' },
  { label: 'Military survivor family (TAPS letter)', cost: 0, how: 'Enrollment and renewal at no cost with the TAPS verification letter or a TSA acknowledgment form.', note: 'Pick an enrollment provider; the process varies by provider.' },
  { label: 'Veteran: VA-issued wheelchair or prosthetic, or permanent blindness', cost: 0, how: 'Free under the VETS Safe Travel Act, with the fee waiver letter in your VA.gov account.', note: 'Through CLEAR or IDEMIA only, for veterans enrolled in VA health care.' },
  { label: 'Other veteran or retiree', cost: null, how: 'Regular enrollment: the free DoD benefit ends when you leave DoD.', note: 'A card fee credit may cover the fee.' },
  { label: 'Adult dependent (18 or over), not DoD-affiliated', cost: null, how: 'Regular enrollment: the free benefit does not extend to adult dependents.', note: 'Children 17 and under can still follow a PreCheck parent.' },
];
const DENIED = [
  { label: 'My Global Entry, NEXUS or SENTRI application was denied', path: 'Request reconsideration in your TTP account', detail: 'CBP sends the reason in writing. The request goes to the CBP Ombudsman, in English, with the denial date and reason, a summary and court documents in PDF for any arrest, even expunged.' },
  { label: 'My TSA PreCheck application was denied', path: 'Follow the letter from TSA', detail: 'TSA explains the reason and the steps to correct a record. Fees are not refunded once the in-person step is done.' },
  { label: 'I have a KTN but no PreCheck on my boarding pass', path: 'Check the reservation first', detail: 'The name, date of birth and KTN in the reservation must match your membership. If it keeps happening, contact TSA (AskTSA or the TSA Contact Center); TSA does not promise the lane on every flight.' },
  { label: 'I am delayed or sent to extra screening on every trip', path: 'DHS TRIP', detail: 'File an inquiry with the DHS Traveler Redress Inquiry Program. You receive a seven-digit Redress Control Number to add to future reservations.' },
  { label: 'My membership was suspended or revoked', path: 'Wait for the review or contest it', detail: 'TSA says recurrent-vetting suspensions usually take under 30 days and up to 90. CBP revocations follow the same reconsideration route as a denial.' },
];

const SPECS: Record<string, () => MiniSpec> = {
  eoa: () => ({
    title: 'Enrollment on Arrival airports where you land', cta: 'Every EoA airport and what to bring', ctaPage: 'enrollment-on-arrival',
    inputs: [{ id: 's', label: 'State or country of arrival', def: GROUPS.findIndex((g) => g.label === 'NY'), options: GROUPS.map((g, i) => ({ value: String(i), label: groupLabel(g) })) }],
    run: (v) => {
      const g = at(GROUPS, v.s);
      return { head: [`Airports listed by CBP in ${groupLabel(g)}`, n0(g.list.length)], rows: g.list.slice(0, 6).map((x) => ['Listed', x] as [string, string]), note: `CBP list read on ${dateL(EOA.read)} (page modified ${dateL(EOA.pageModified)}). Only for conditionally approved applicants, on an international arrival.` };
    },
  }),
  busy: () => ({
    title: 'How busy were checkpoints on this date?', cta: 'TSA wait times explained', ctaPage: 'tsa-wait-times',
    inputs: [{ id: 'd', label: 'Travel date', def: TODAY, date: true, help: 'Past date: the TSA count. Later date: the same weekday a year earlier.' }],
    run: (v) => {
      const d = isoOf(v.d);
      const r = reference(d);
      if (!r) return { head: ['No published number for this date', 'n/a'], rows: [['Numbers available up to', dateL(LAST_DAY)]], note: 'TSA publishes daily totals from 2019; this tool keeps the last two years.' };
      const p = percentile(r.date);
      return {
        head: [r.exact ? `Travelers screened on ${dateL(r.date)}` : `Same weekday a year earlier, ${dateL(r.date)}`, n0(r.n)],
        rows: [['Busier than', `${pct(p)} of days that year`], ['Weekday', weekday(r.date)], ['Year’s busiest day', `${dateL(busiest(Number(r.date.slice(0, 4)), 1)[0].date)}`]],
        note: `TSA checkpoint numbers, nationwide, read on ${dateL(VOLUMES_READ)}. They count people, not minutes of waiting.`,
      };
    },
  }),
  'precheck-time': () => ({
    title: 'When should your Known Traveler Number arrive?', cta: 'TSA PreCheck approval time', ctaPage: 'tsa-precheck-processing-time',
    inputs: [{ id: 'd', label: 'Date of your in-person appointment', def: TODAY, date: true }],
    run: (v) => {
      const r = processing('precheck', isoOf(v.d));
      return { head: ['Most applicants, between', `${dateL(r.typical[0])} and ${dateL(r.typical[1])}`], rows: [['Some applications, up to', dateL(r.latest)], ['Fees once the visit is done', 'not refunded']], note: `TSA: most KTNs in ${P.precheck.ktnDaysTypical.join('-')} days, some up to ${P.precheck.ktnDaysMax} days.` };
    },
  }),
  'ge-time': () => ({
    title: 'Global Entry: the dates CBP’s figures give', cta: 'Global Entry processing time', ctaPage: 'global-entry-processing-time',
    inputs: [{ id: 'd', label: 'Date you submitted the application', def: TODAY, date: true }],
    run: (v) => {
      const r = processing('globalEntry', isoOf(v.d));
      return { head: [`${pct(P.globalEntry.approvedShare)} of applications approved by`, dateL(r.typical[1])], rows: [['Some take up to', `${dateL(r.latest)} or longer`], ['Card, if approved by the 2-week mark', `by ${dateL(r.card!)}`]], note: 'CBP figure: 80% approved within 2 weeks, some 12 months or more. Approval here means conditional approval, before the interview.' };
    },
  }),
  kids: () => ({
    title: 'Can my child use the PreCheck lane with me?', cta: 'TSA PreCheck for kids and families', ctaPage: 'tsa-precheck-for-kids',
    inputs: [
      { id: 'age', label: 'Child’s age', def: 14, max: 25 },
      { id: 'ind', label: 'PreCheck on your boarding pass?', def: 1, options: yesNo },
      { id: 'same', label: 'Same airline reservation?', def: 1, options: yesNo },
    ],
    run: (v) => {
      const r = kidLane(Math.round(v.age), v.ind === 1, v.same === 1);
      return { head: ['TSA PreCheck lane', r.lane === 'yes' ? 'Yes' : r.lane === 'maybe' ? 'If the indicator shows' : 'No'], rows: [['Rule', r.why]], note: 'Rule from the TSA PreCheck families page; TSA does not promise the lane on a given flight.' };
    },
  }),
  military: () => ({
    title: 'What TSA PreCheck costs you as a service member or family', cta: 'Military TSA PreCheck', ctaPage: 'military-tsa-precheck',
    inputs: [{ id: 's', label: 'Your situation', def: 0, options: MIL.map((x, i) => ({ value: String(i), label: x.label })) }],
    run: (v) => {
      const x = at(MIL, v.s);
      const pre = cheapestEnroll();
      const c = x.cost === null ? `from ${money(pre.enroll)}` : x.cost < 0 ? `from ${money(pre.enroll + x.cost)}` : '$0';
      return { head: ['Five years of TSA PreCheck', c], rows: [['How', x.how], ['Note', x.note]], note: 'TSA uniformed service members, spouses, survivor families and VETS Safe Travel Act pages.' };
    },
  }),
  denied: () => ({
    title: 'Denied, revoked or stuck in screening: where to go', cta: 'Denials and DHS TRIP', ctaPage: 'global-entry-denied',
    inputs: [{ id: 's', label: 'What happened', def: 0, options: DENIED.map((x, i) => ({ value: String(i), label: x.label })) }],
    run: (v) => { const x = at(DENIED, v.s); return { head: ['Route', x.path], rows: [['What to send', x.detail]], note: 'Free official routes only; no paid service can speed up a CBP or TSA review.' }; },
  }),
  card: () => ({
    title: 'What your card’s fee credit leaves you to pay', cta: 'Cards that pay for Global Entry', ctaPage: 'credit-cards-that-pay-for-global-entry',
    inputs: [
      { id: 'c', label: 'Card', def: 0, options: P.cards.map((c, i) => ({ value: String(i), label: c.name })) },
      { id: 'p', label: 'Program', def: 0, options: [{ value: '0', label: `Global Entry (${money(P.globalEntry.fee)})` }, { value: '1', label: `TSA PreCheck, ${cheapestEnroll().name} (${money(cheapestEnroll().enroll)})` }] },
    ],
    run: (v) => {
      const c = at(P.cards, v.c);
      const fee = v.p === 0 ? P.globalEntry.fee : cheapestEnroll().enroll;
      const cr = v.p === 1 && c.precheckCredit ? c.precheckCredit : c.credit;
      const left = Math.max(0, fee - cr);
      return { head: ['Left for you to pay', money(left)], rows: [['Credit', `up to ${money(cr)}, once every ${c.everyYears} years`], ['Covers', c.covers], ['Annual fee of the card', c.annualFee ? money(c.annualFee) : 'see the issuer’s page']], note: `Issuer’s page read on ${dateL(P.retrieved_at)}. The fee must be charged to the card.` };
    },
  }),
  'clear-cost': () => ({
    title: 'CLEAR+: what each departure costs you', cta: 'CLEAR vs TSA PreCheck', ctaPage: 'clear-vs-tsa-precheck',
    inputs: [
      { id: 'n', label: 'Flights departing a CLEAR airport, per year', def: 12, max: 500 },
      { id: 'a', label: 'Adults on the membership', def: 1, max: 4 },
      { id: 'cr', label: 'CLEAR credit on your card ($ a year)', def: 0, unit: '$', max: 1000 },
    ],
    run: (v) => {
      const c = cost({ program: 'clear', years: 5, adults: Math.max(1, Math.round(v.a)), clearCredit: v.cr });
      const flights = Math.max(1, Math.round(v.n)) * Math.max(1, Math.round(v.a));
      return { head: ['Per departure, per person', money(Math.round((c.perYear / flights) * 100) / 100)], rows: [['Per year, after credit', money(c.perYear)], ['Five years', money(c.net)]], note: `CLEAR price page: ${money(P.clear.annual)} a year, ${money(P.clear.familyAdd)} per added adult (up to ${P.clear.familyMaxAdults}), children ${P.clear.kidsMaxAge} and under free.` };
    },
  }),
  gap: () => ({
    title: 'What Global Entry costs on top of PreCheck', cta: 'TSA PreCheck vs Global Entry', ctaPage: 'tsa-precheck-vs-global-entry',
    inputs: [{ id: 't', label: 'Trips abroad by air in five years', def: 5, max: 500 }],
    run: (v) => {
      const pre = cheapestEnroll();
      const gap = P.globalEntry.fee - pre.enroll;
      const t = Math.max(0, Math.round(v.t));
      return { head: ['Extra for Global Entry, per return trip', t ? money(Math.round((gap / t) * 100) / 100) : money(gap)], rows: [['Gap over five years', money(gap)], ['Gap at renewal', money(P.globalEntry.fee - cheapestRenewal().amount)], ['Global Entry includes', 'TSA PreCheck']], note: `Against the cheapest PreCheck enrollment (${pre.name}, ${money(pre.enroll)}). Global Entry also needs a passport and an interview.` };
    },
  }),
  family: () => ({
    title: 'Five years for the whole family', cta: 'Full cost calculator', ctaPage: 'trusted-traveler-cost-calculator',
    inputs: [
      { id: 'p', label: 'Program', def: 1, options: [{ value: '0', label: 'TSA PreCheck' }, { value: '1', label: 'Global Entry' }, { value: '2', label: 'CLEAR+' }] },
      { id: 'a', label: 'Adults (18 and over)', def: 2, max: 9 },
      { id: 'k', label: 'Children under 18', def: 2, max: 9 },
    ],
    run: (v) => {
      const prog = (['precheck', 'globalEntry', 'clear'] as Program[])[Math.round(v.p)] ?? 'globalEntry';
      const c = cost({ program: prog, years: 5, adults: Math.max(1, Math.round(v.a)), kids: Math.round(v.k), provider: cheapestEnroll().id });
      return { head: ['Family total, five years', money(c.net)], rows: [['Per year', money(c.perYear)], ['Children', prog === 'globalEntry' ? 'apply, no fee with a member parent' : prog === 'precheck' ? 'no membership needed (rules by age)' : 'free with a member']], note: c.note };
    },
  }),
  'nexus-deadline': () => ({
    title: 'NEXUS: last day to schedule your interview', cta: 'NEXUS vs Global Entry', ctaPage: 'nexus-vs-global-entry',
    inputs: [{ id: 'd', label: 'Date of conditional approval', def: TODAY, date: true }],
    run: (v) => {
      const a = isoOf(v.d), dl = nexusInterviewDeadline(a);
      return { head: ['Schedule the interview by', dateL(dl)], rows: [['Rule applied', a >= P.nexus.interviewRuleFrom ? `approved on or after ${dateL(P.nexus.interviewRuleFrom)}: 2 years` : `approved before ${dateL(P.nexus.interviewRuleFrom)}: 5 years or ${dateL(P.nexus.interviewLastDate)}, whichever comes first`]], note: 'Canada Border Services Agency, interview scheduling deadlines.' };
    },
  }),
  remote: () => ({
    title: 'Can you do the renewal interview by video?', cta: 'Global Entry renewal', ctaPage: 'global-entry-renewal',
    inputs: [
      { id: 'r', label: 'Renewing (not a first application)?', def: 1, options: yesNo },
      { id: 'age', label: 'Your age', def: 40, max: 120 },
      { id: 'ph', label: 'Years since CBP took your photo', def: 5, max: 50 },
      { id: 'ph14', label: 'Age when that photo was taken', def: 35, max: 120 },
    ],
    run: (v) => {
      const fails: string[] = [];
      if (v.r !== 1) fails.push('first applications are not in the pilot');
      if (v.age < P.globalEntry.remoteMinAge) fails.push(`under ${P.globalEntry.remoteMinAge}`);
      if (v.ph > P.globalEntry.remotePhotoYears) fails.push(`photo older than ${P.globalEntry.remotePhotoYears} years`);
      if (v.ph14 < 14) fails.push('photo taken before age 14');
      return { head: ['Remote interview', fails.length ? 'Not eligible' : 'Eligible if CBP offers it'], rows: [['Why', fails.length ? fails.join('; ') : 'renewal, adult, recent photo on file'], ['Length', `about ${P.globalEntry.remoteMinutes} minutes on Zoom`]], note: 'CBP remote interview pilot: also needs conditional approval for the renewal and fingerprints already on file.' };
    },
  }),
  scam: () => ({
    title: 'Is this renewal site official?', cta: 'TSA PreCheck renewal', ctaPage: 'tsa-precheck-renewal',
    inputs: [
      { id: 'g', label: 'Does the address end in .gov?', def: 0, options: yesNo },
      { id: 'p', label: 'Price the site asks ($)', def: 140, unit: '$', max: 2000, decimals: 2 },
    ],
    run: (v) => {
      const max = Math.max(...PROVIDERS.flatMap((p) => [p.renewOnline, p.renewInPerson]));
      const official = v.g === 1;
      return { head: ['Verdict', official ? (v.p <= max + 0.001 ? 'Looks official' : 'Price above every provider') : 'Not an official TSA PreCheck site'], rows: [['Official renewal prices', `${money(cheapestRenewal().amount)} to ${money(max)}`], ['Official sites', PROVIDERS.map((p) => p.site).join(', ')]], note: 'TSA: a site to register for PreCheck that does not end in .gov is not official. Fraud: ReportFraud.ftc.gov and your card issuer.' };
    },
  }),
  'precheck-renew': () => ({
    title: 'TSA PreCheck: when the online renewal opens', cta: 'Renewal dates and calendar file', ctaPage: 'tsa-precheck-renewal',
    inputs: [{ id: 'd', label: 'Expiration date of your PreCheck', def: dayNum(addYears(BUILD_DAY, 1)), date: true }],
    run: (v) => {
      const r = renewal('precheck', isoOf(v.d), BUILD_DAY);
      return { head: ['Online renewal opens', dateL(r.events[0].date)], rows: [['TSA advises renewing by', dateL(r.events[1].date)], ['Expires', dateL(r.events[2].date)]], note: r.status };
    },
  }),
  'ge-renew': () => ({
    title: 'Global Entry: your renewal window', cta: 'Renewal dates and calendar file', ctaPage: 'global-entry-renewal',
    inputs: [{ id: 'd', label: 'Expiration date on your TTP account', def: dayNum(addYears(BUILD_DAY, 1)), date: true }],
    run: (v) => {
      const r = renewal('globalEntry', isoOf(v.d), BUILD_DAY);
      return { head: ['Renewal opens', dateL(r.events[0].date)], rows: [['Apply before', dateL(r.events[2].date)], ['Benefits kept, if applied in time, until', dateL(r.events[3].date)], ['Days until expiry', n0(days(BUILD_DAY, isoOf(v.d)))]], note: r.status };
    },
  }),
  'weekday': () => ({
    title: 'Average travelers screened per day, by weekday', cta: 'TSA wait times explained', ctaPage: 'tsa-wait-times',
    inputs: [{ id: 'y', label: 'Year', def: 0, options: [{ value: '0', label: '2025 (full year)' }, { value: '1', label: '2026 (to date)' }] }],
    run: (v) => {
      const y = v.y === 1 ? 2026 : 2025;
      const w = weekdayAverages(y).sort((a, b) => b.avg - a.avg);
      return { head: [`Busiest weekday in ${y}`, w[0].day], rows: w.slice(0, 4).map((x) => [x.day, n0(x.avg)] as [string, string]).concat([[`Quietest: ${w[6].day}`, n0(w[6].avg)]]), note: `TSA checkpoint numbers, read on ${dateL(VOLUMES_READ)}.` };
    },
  }),
};

export function getSpec(kind: string): MiniSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown mini-tool ${kind}`);
  return f();
}
export const MINI_KINDS = Object.keys(SPECS);
