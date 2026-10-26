import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nexus-vs-global-entry', group: 'choose', order: 3,
  tool: { kind: 'chooser', props: { canadaLand: 6, international: 1, domestic: 3 } },
  mini: { kind: 'mini:nexus-deadline' },
  related: ['tsa-precheck-vs-global-entry', 'sentri-vs-global-entry', 'global-entry-interview', 'global-entry-renewal', 'home'],
  sources: ['cbp-nexus-apply', 'cbsa-nexus', 'cbsa-nexus-eligible', 'fr-nexus-fee', 'cbp-fees', 'cbp-precheck', 'cbp-ge-card'],
  en: {
    slug: 'nexus-vs-global-entry', nav: 'NEXUS vs Global Entry', card: 'Same $120 fee, five years each: what NEXUS adds at the Canadian border, who can apply, the two-country interview and the new deadline.',
    title: 'NEXUS vs Global Entry: Same $120, What NEXUS Adds for Canada',
    description: 'NEXUS vs Global Entry: both $120 for five years with TSA PreCheck. NEXUS adds Canada lanes and kiosks, a two-country interview and a deadline from April 2027.',
    h1: 'NEXUS vs Global Entry: the same fee, a different border',
    intro: 'Count your crossings from Canada and your trips abroad: the chooser says whether NEXUS or Global Entry fits, and what it costs per trip.',
    resume: (h) => {
      const N = h.P.nexus;
      return `Since October 1, 2024, NEXUS and Global Entry cost the same: ${h.m(N.fee)} per adult for five years, after CBP raised NEXUS from ${h.m(N.previousFee)}. Both give TSA PreCheck through the PASS ID, and both let you use the Global Entry kiosks when you fly into the United States. NEXUS adds the other direction: dedicated lanes and eGates when you enter Canada by air, land or boat, and the NEXUS lanes at the northern land border into the United States. In exchange it asks more. Both countries run a risk assessment, the interview is held with US and Canadian officers at a NEXUS enrollment center, and permanent residents need three years of residence. Children under 18 apply free. For anyone who crosses into Canada more than once or twice a year and can reach a NEXUS center, NEXUS gives everything Global Entry gives at the same price; for everyone else, Global Entry and its Enrollment on Arrival are easier to get.`;
    },
    faqs: (h) => {
      const N = h.P.nexus;
      return [
        { q: 'Does NEXUS give me Global Entry benefits?', a: 'Yes, at the airport. CBP states that NEXUS members can use the Global Entry kiosks when entering the United States, including at the Canadian airports with US preclearance, and they receive TSA PreCheck with their PASS ID. What NEXUS does not give is the Global Entry card itself, which some members use as a second travel document in land lanes.' },
        { q: 'Can a Canadian citizen get TSA PreCheck?', a: 'Only through NEXUS. TSA PreCheck enrollment is open to US citizens, US nationals and permanent residents, and Global Entry does not list Canada among its partner countries. CBP states that Canadian citizens who are NEXUS members are eligible for PreCheck: they enter their PASS ID in the Known Traveler Number field, exactly like a US member.' },
        { q: 'How long do I have to schedule my NEXUS interview?', a: `It depends on the date of your conditional approval. The Canada Border Services Agency says that from ${h.date(N.interviewRuleFrom)}, applicants approved on or after that date have ${N.interviewYearsAfter} years to schedule it. Those approved before have ${N.interviewYearsBefore} years from approval or until ${h.date(N.interviewLastDate)}, whichever comes first. Missing the deadline means starting the application again and paying again.` },
        { q: 'Do my children pay for NEXUS?', a: `No. CBP's NEXUS page says children under 18 must also apply and, if eligible, are admitted free of charge, and the CBSA puts it simply: children under 18 are free. Each child still needs a separate application, an interview and their own card, because a NEXUS card only works for the person who holds it. The adult fee is ${h.m(N.fee)}.` },
      ];
    },
    body: (h) => {
      const N = h.P.nexus, G = h.P.globalEntry;
      const rows = [
        ['Fee, five years', h.m(N.fee), h.m(G.fee)],
        ['Children under 18', 'free', 'free with a member parent'],
        ['Who can apply', 'US and Canadian citizens and permanent residents; Mexican Viajero Confiable members', 'US citizens and residents, Mexican nationals, partner countries'],
        ['Entering the US by air', 'Global Entry kiosks', 'Global Entry kiosks'],
        ['Entering Canada', 'NEXUS kiosks, eGates and lanes', 'regular processing'],
        ['US land border', 'NEXUS lanes (north)', 'NEXUS and SENTRI lanes with the card'],
        ['TSA PreCheck', 'yes, with the PASS ID', 'yes, with the PASS ID'],
        ['Interview', 'US and Canadian officers, NEXUS center', 'CBP officer, center or on arrival'],
      ];
      return `<h2>What each one opens</h2>
${h.table(['', 'NEXUS', 'Global Entry'], rows, `CBP, CBSA and Federal Register pages, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>The Global Entry card works in the NEXUS lanes when you drive into the United States from Canada, but CBP warns that it is not valid for entering Canada through those lanes. That one line explains most choices: a Global Entry member who drives to Canada waits with everyone else on the way in, and a NEXUS member does not.</p>
<h2>The fee change of 2024</h2>
<p>CBP published a final rule and a Federal Register notice on April 2, 2024 that harmonized the three programs from October 1, 2024: NEXUS went from ${h.m(N.previousFee)} to ${h.m(N.fee)}, Global Entry from ${h.m(G.previousFee)} to ${h.m(G.fee)}, and SENTRI from a sum of separate fees to ${h.m(h.P.sentri.fee)}. The same rule exempted applicants under 18 when a parent or guardian is a member or applies at the same time. Before the change, NEXUS was the cheapest way to get Global Entry benefits; it no longer is, but it is not dearer either.</p>
<h2>Interview: the real difference</h2>
<p>Global Entry can be completed on arrival from abroad at the airports CBP lists, with no appointment, or at an enrollment center, and renewals may be done by video. NEXUS needs officers of both countries: CBP's own FAQ notes that anyone who wants to use NEXUS to enter Canada must complete an enrollment interview with the Canada Border Services Agency. NEXUS enrollment centers sit at airports and crossings near the northern border, which is a long trip for travelers who live elsewhere. Applicants approved conditionally now face a deadline to schedule that interview, which the tool below computes.</p>
<!--tool:mini:nexus-deadline-->
<h2>Who should pick which</h2>
<p>Pick NEXUS if you live near the northern border or travel to Canada several times a year, by car or by plane, and can reach a NEXUS center for the interview. Pick Global Entry if your trips abroad go elsewhere, if you cross into Canada once a year or less, or if you want to finish the process on your next return flight. A permanent resident must also count residence: NEXUS asks for three years with at least 183 days a year in Canada or the United States. Both programs give PreCheck, so do not buy PreCheck separately; the ${h.a('known-traveler-number', 'Known Traveler Number page')} explains which number goes in your reservations.</p>
<p>Whichever you pick, the PASS ID you receive is your Known Traveler Number for TSA PreCheck at US airports.</p>`;
    },
  },
});
