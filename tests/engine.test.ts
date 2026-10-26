/** Engine cases worked out by hand from the TSA, CBP, CBSA and CLEAR figures of params-2026.json (read 2026-10-26). */
import { describe, expect, it } from 'vitest';
import { cost, choose, renewal, ics, kidLane, decodeKtn, processing, nexusInterviewDeadline, cheapestRenewal, type Profile } from '../src/lib/engine/ttp';

describe('cost over five and ten years', () => {
  it('TSA PreCheck', () => {
    expect(cost({ program: 'precheck', years: 5, provider: 'idemia' }).net).toBe(79.75);
    expect(cost({ program: 'precheck', years: 10, provider: 'idemia', channel: 'online' }).net).toBe(138.5);
    expect(cost({ program: 'precheck', years: 10, provider: 'telos', channel: 'inPerson' }).net).toBe(143.75);
    expect(cost({ program: 'precheck', years: 10, provider: 'clear', channel: 'online' }).net).toBe(157.9);
    expect(cost({ program: 'precheck', years: 5, provider: 'telos', adults: 2 }).net).toBe(170);
  });
  it('Global Entry, NEXUS and SENTRI with and without a card credit', () => {
    expect(cost({ program: 'globalEntry', years: 5 }).net).toBe(120);
    expect(cost({ program: 'globalEntry', years: 10 }).net).toBe(240);
    expect(cost({ program: 'globalEntry', years: 10, cardCredit: 120, cardEvery: 4 }).net).toBe(0);
    expect(cost({ program: 'globalEntry', years: 10, cardCredit: 100, cardEvery: 4 }).net).toBe(40);
    // a credit once every 6 years covers the first fee only within ten years
    expect(cost({ program: 'globalEntry', years: 10, cardCredit: 120, cardEvery: 6 }).net).toBe(120);
    expect(cost({ program: 'globalEntry', years: 5, adults: 2, kids: 2 }).net).toBe(240);
    expect(cost({ program: 'nexus', years: 5, kids: 3 }).net).toBe(120);
    expect(cost({ program: 'sentri', years: 10 }).net).toBe(240);
    // PreCheck credit of $85 on a $79.75 fee: the fee is fully refunded, never more
    expect(cost({ program: 'precheck', years: 5, provider: 'idemia', cardCredit: 85 }).net).toBe(0);
  });
  it('CLEAR+ and the CLEAR code with PreCheck', () => {
    expect(cost({ program: 'clear', years: 5 }).net).toBe(1095);
    expect(cost({ program: 'clear', years: 5, adults: 2 }).net).toBe(1720);
    expect(cost({ program: 'clear', years: 5, adults: 6 }).net).toBe(5 * (219 + 3 * 125));
    expect(cost({ program: 'clear', years: 5, clearCredit: 219 }).net).toBe(0);
    expect(cost({ program: 'clearPrecheck', years: 5 }).net).toBe(1094.95);
    expect(cost({ program: 'clearPrecheck', years: 10 }).net).toBe(2189.9);
  });
  it('cheapest PreCheck renewal', () => {
    expect(cheapestRenewal().amount).toBe(58.75);
  });
});

const base: Profile = { status: 'us', domestic: 4, international: 0, canadaLand: 0, mexicoLand: 0, military: false, card: 'none', clearAirport: 'unsure', passport: true };
describe('chooser', () => {
  it('picks the program from the profile', () => {
    expect(choose(base).pick).toBe('TSA PreCheck');
    expect(choose({ ...base, international: 2 }).pick).toBe('Global Entry');
    expect(choose({ ...base, international: 2, passport: false }).pick).toBe('TSA PreCheck');
    expect(choose({ ...base, card: 'ttp120' }).pick).toBe('Global Entry');
    expect(choose({ ...base, canadaLand: 6, international: 1 }).pick).toBe('NEXUS');
    expect(choose({ ...base, status: 'canadian' }).pick).toBe('NEXUS');
    expect(choose({ ...base, military: true }).pick).toBe('Your DoD ID number (free PreCheck)');
    expect(choose({ ...base, status: 'other', mexicoLand: 10 }).pick).toBe('SENTRI');
    expect(choose({ ...base, card: 'ttpClear', clearAirport: 'yes' }).pick).toBe('Global Entry + CLEAR+');
    expect(choose({ ...base, domestic: 20, clearAirport: 'no' }).pick).toBe('TSA PreCheck');
  });
  it('cost per year and per round trip', () => {
    const c = choose(base);
    expect(c.perYear).toBe(15.95);
    expect(c.perTrip).toBe(3.99);
    expect(choose({ ...base, international: 2, card: 'ttp120' }).perYear).toBe(0);
  });
});

describe('renewal windows and calendar file', () => {
  it('TSA PreCheck: six months, sixty days', () => {
    const r = renewal('precheck', '2027-03-15', '2026-10-26');
    expect(r.events.map((e) => e.date)).toEqual(['2026-09-15', '2027-01-14', '2027-03-15']);
    expect(r.status).toMatch(/renew by this date in 80 days/);
  });
  it('Global Entry: one year before, 24 months after', () => {
    const r = renewal('globalEntry', '2027-06-30', '2026-10-26');
    expect(r.events.map((e) => e.date)).toEqual(['2026-06-30', '2027-06-29', '2027-06-30', '2029-06-30']);
  });
  it('builds a valid iCalendar file', () => {
    const r = renewal('precheck', '2027-03-15', '2026-10-26');
    const f = ics(r.events, '2026-10-26');
    expect(f.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(f.match(/BEGIN:VEVENT/g)?.length).toBe(3);
    expect(f).toContain('DTSTART;VALUE=DATE:20270114');
    expect(f.split('\r\n').every((l) => l.length <= 75)).toBe(true);
  });
});

describe('children, KTN, processing, NEXUS deadline', () => {
  it('children in the PreCheck lane', () => {
    expect(kidLane(10, true, false).lane).toBe('yes');
    expect(kidLane(15, true, true).lane).toBe('maybe');
    expect(kidLane(15, true, false).lane).toBe('no');
    expect(kidLane(8, false, true).lane).toBe('no');
    expect(kidLane(18, true, true).lane).toBe('no');
  });
  it('Known Traveler Number formats', () => {
    expect(decodeKtn('TT1234567').kind).toBe('precheck');
    expect(decodeKtn('ac 1234-5678').title).toMatch(/CLEAR/);
    expect(decodeKtn('987654321').kind).toBe('cbp');
    expect(decodeKtn('123456789').kind).toBe('unknown');
    expect(decodeKtn('1234567890').kind).toBe('dod');
    expect(decodeKtn('').kind).toBe('empty');
  });
  it('processing dates', () => {
    expect(processing('precheck', '2026-10-26')).toEqual({ typical: ['2026-10-29', '2026-10-31'], latest: '2026-12-25', card: null });
    const g = processing('globalEntry', '2026-10-26');
    expect(g.typical[1]).toBe('2026-11-09');
    expect(g.latest).toBe('2027-10-26');
  });
  it('NEXUS interview deadline', () => {
    expect(nexusInterviewDeadline('2027-05-01')).toBe('2029-05-01');
    expect(nexusInterviewDeadline('2025-06-01')).toBe('2029-04-01');
    expect(nexusInterviewDeadline('2023-01-10')).toBe('2028-01-10');
  });
});
