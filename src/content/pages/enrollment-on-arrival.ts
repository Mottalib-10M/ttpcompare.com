import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'enrollment-on-arrival', group: 'apply', order: 3,
  tool: { kind: 'mini:eoa' },
  related: ['global-entry-interview', 'global-entry-processing-time', 'enrollment-checklist', 'tsa-precheck-vs-global-entry', 'home'],
  sources: ['cbp-eoa', 'cbp-ge-faq', 'cbp-ge-apply'],
  en: {
    slug: 'enrollment-on-arrival', nav: 'Enrollment on Arrival airports', card: 'Every airport where CBP lists Enrollment on Arrival, by state and country, who can use it and the papers to carry.',
    title: 'Global Entry Enrollment on Arrival: Airports List and Rules',
    description: 'Global Entry Enrollment on Arrival: every airport on the CBP list by state and abroad, dated, who qualifies, the papers to carry and how it replaces a center.',
    h1: 'Enrollment on Arrival: finish Global Entry when you land',
    intro: 'Pick the state or country where you land from abroad: the tool lists the airports CBP names there.',
    resume: (h) => {
      const n = h.EOA.us.length + h.EOA.abroad.length;
      return `Enrollment on Arrival lets a conditionally approved Global Entry applicant complete the interview when landing from an international trip, without an appointment. You follow the signs to the CBP officer in the arrivals hall, show your documents and answer the questions; if all is in order, the interview is done and any appointment you had at an enrollment center is cancelled automatically. On the page CBP last modified on ${h.date(h.EOA.pageModified)}, which we read on ${h.date(h.EOA.read)}, the list counts ${n} airports: ${h.EOA.us.length} in the United States and its territories, and ${h.EOA.abroad.length} abroad, mostly CBP Preclearance airports where you clear US entry before boarding. Two conditions are easy to miss. You must already be conditionally approved; the program is not open before that. And you must arrive on an international journey; a domestic flight into one of those airports does not qualify. Carry a valid passport, proof of your current address and your green card if you have one.`;
    },
    faqs: (h) => [
      { q: 'Can I use Enrollment on Arrival before conditional approval?', a: 'No. CBP opens Enrollment on Arrival only to applicants whose TTP account shows conditional approval. If your application is still pending review, arriving at a listed airport changes nothing: you go through the normal passport line. Check the status in your account before the trip, since approval can come at any time and is announced by email.' },
      { q: 'Does my family need to do Enrollment on Arrival together?', a: 'Each conditionally approved applicant does their own interview, but traveling together makes it easy to do them one after the other. A minor needs a parent or legal guardian present, and CBP does not ask minors for proof of residence. A family member who is not yet conditionally approved cannot be interviewed on that arrival.' },
      { q: 'How long does Enrollment on Arrival add to my arrival?', a: 'CBP does not publish a duration. It depends on the queue at the dedicated booth and on the time of day. At some airports, CBP restricts the hours or the booths; Chicago O’Hare, for example, names specific booths in Terminal 5. Allow extra time if you have a connection, or keep the interview for a later trip.' },
    ],
    body: (h) => {
      const STATES: Record<string, string> = { AK: 'Alaska', AZ: 'Arizona', CA: 'California', CO: 'Colorado', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky', LA: 'Louisiana', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', NJ: 'New Jersey', NY: 'New York', NV: 'Nevada', NC: 'North Carolina', OH: 'Ohio', OR: 'Oregon', PA: 'Pennsylvania', TX: 'Texas', UT: 'Utah', VA: 'Virginia', WA: 'Washington', WI: 'Wisconsin' };
      const by = new Map<string, string[]>();
      for (const a of h.EOA.us) { const k = STATES[a.state] ?? a.state; by.set(k, [...(by.get(k) ?? []), `${a.name} (${a.code})`]); }
      const usRows = [...by.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => [k, v.join(', ')]);
      const ab = new Map<string, string[]>();
      for (const a of h.EOA.abroad) ab.set(a.country, [...(ab.get(a.country) ?? []), `${a.name} (${a.code})`]);
      const abRows = [...ab.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => [k, v.join(', ')]);
      return `<h2>Airports in the United States</h2>
${h.table(['State or territory', 'Airports CBP lists'], usRows, `CBP Enrollment on Arrival page, modified ${h.date(h.EOA.pageModified)}, read on ${h.date(h.EOA.read)}. Airport codes added by us.`, ['l', 'l'])}
<h2>Airports abroad</h2>
${h.table(['Country or territory', 'Airports CBP lists'], abRows, 'Mostly CBP Preclearance locations: you clear US entry there, before the flight.', ['l', 'l'])}
<p>CBP updates this list without notice, and some airports offer the service only during set hours. The date above tells you when we last read it; check the CBP page before counting on an airport.</p>
<h2>What to carry, step by step</h2>
<p>The checklist below covers the route from conditional approval to the officer's booth. Keep the documents in your hand luggage, not in a checked bag: you need them before baggage claim.</p>
<!--tool:checklist|{"route":"ge-eoa"}-->
<h2>Enrollment on Arrival or a center appointment?</h2>
<p>If you travel abroad within the next months, Enrollment on Arrival usually wins: no slot to find, no special trip. CBP confirms that you can keep an appointment you already booked and still use Enrollment on Arrival first; the appointment is then cancelled for you. If you do not travel soon, or arrive at an airport that is not on the list, book the ${h.a('global-entry-interview', 'interview at a center')}. Miami and Detroit also offer Enrollment on Departure to travelers flying out the same day, domestic or international.</p>
<h2>After the interview</h2>
<p>The decision comes by email and in your TTP account; CBP says the timeline can vary. Once approved, add your PASS ID as Known Traveler Number to get PreCheck, and use the kiosks or touchless portals on your next return. The ${h.a('global-entry-processing-time', 'processing time page')} explains what CBP publishes on delays.</p>`;
    },
  },
});
