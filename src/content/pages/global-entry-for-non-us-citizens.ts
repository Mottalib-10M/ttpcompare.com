import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'global-entry-for-non-us-citizens', group: 'choose', order: 5,
  tool: { kind: 'chooser', props: { status: 'partner', international: 3, domestic: 1 } },
  mini: { kind: 'mini:ge-time' },
  related: ['nexus-vs-global-entry', 'sentri-vs-global-entry', 'global-entry-interview', 'tsa-precheck-vs-global-entry', 'home'],
  sources: ['cbp-ge-eligibility', 'cbp-ge-faq', 'cbp-precheck', 'tsa-faq', 'cbsa-nexus-eligible', 'cbp-sentri'],
  en: {
    slug: 'global-entry-for-non-us-citizens', nav: 'Global Entry for non-US citizens', card: 'Green card holders, Mexican nationals, the partner countries CBP lists, Canadians and everyone else: which program each can join.',
    title: 'Global Entry for Non-US Citizens: Who Qualifies in 2026',
    description: 'Global Entry for non-US citizens: green card holders, Mexican nationals and 21 partner countries can apply; Canadians use NEXUS. Rules, extra vetting, the fee.',
    h1: 'Global Entry and the other programs for non-US citizens',
    intro: 'Choose your nationality and your trips: the chooser lists the programs you can join and what they would cost you.',
    resume: (h) => {
      const G = h.P.globalEntry;
      const partners = G.countries.filter((c) => c !== 'Mexico');
      return `Global Entry is not only for US citizens. CBP opens it to lawful permanent residents of the United States, to Mexican nationals and to citizens of ${partners.length} partner countries: ${partners.join(', ')}. Citizens of a partner country usually go through an extra check by their own government, sometimes with its own fee, before or after the CBP application, and the fee to CBP is the same ${h.m(G.fee)} for five years. Canada is not on the list because Canadians have NEXUS, run jointly by both countries, which gives the Global Entry kiosks and TSA PreCheck. Travelers of every other nationality cannot join Global Entry, but SENTRI has no citizenship requirement and covers the land border from Mexico. TSA PreCheck itself is open only to US citizens, US nationals and permanent residents; partner-country citizens get it as Global Entry members. Each program still requires admissibility to the United States and a clean customs and immigration record.`;
    },
    faqs: (h) => {
      const G = h.P.globalEntry;
      return [
        { q: 'Can a green card holder apply for Global Entry?', a: `Yes. Lawful permanent residents apply exactly like citizens, on ttp.dhs.gov, for the same ${h.m(G.fee)}. They bring their permanent resident card to the interview with their passport, and they can use Enrollment on Arrival. CBP also issues them a Global Entry card. They are equally eligible for TSA PreCheck on its own, should they prefer it.` },
        { q: 'Can UK citizens get Global Entry?', a: `Yes. The United Kingdom is on CBP's list of countries whose citizens may apply. As for every partner country, there may be additional requirements set by the arrangement with that country, which CBP explains under its international arrangements, and the CBP application still costs ${h.m(G.fee)}. Once approved, UK members use the kiosks on arrival and get TSA PreCheck on flights departing US airports.` },
        { q: 'Do partner-country members get TSA PreCheck too?', a: 'Yes. CBP states that citizens of partner countries enrolled in Global Entry are eligible for TSA PreCheck, like US members. They enter their nine-digit PASS ID in the Known Traveler Number field of their US airline bookings. They cannot enroll in PreCheck directly through IDEMIA, Telos or CLEAR, which is reserved for US citizens, nationals and residents.' },
      ];
    },
    body: (h) => {
      const G = h.P.globalEntry;
      const rows = [
        ['US citizen or national', 'yes', 'yes', 'yes', 'yes'],
        ['US permanent resident', 'yes', 'yes', 'yes (3 years of residence)', 'yes'],
        ['Canadian citizen', 'through NEXUS', 'no (use NEXUS)', 'yes', 'yes'],
        ['Mexican national', 'through Global Entry', 'yes', 'Viajero Confiable members', 'yes'],
        ['Partner-country citizen', 'through Global Entry', 'yes, with extra vetting', 'no', 'yes'],
        ['Any other nationality', 'no', 'no', 'no', 'yes'],
      ];
      return `<h2>Who can join what</h2>
${h.table(['You are', 'TSA PreCheck', 'Global Entry', 'NEXUS', 'SENTRI'], rows, `CBP eligibility pages, TSA FAQ and CBSA eligibility page, read on ${h.read}.`, ['l', 'l', 'l', 'l', 'l'])}
<h2>The partner countries</h2>
<p>CBP's eligibility page lists ${G.countries.length} countries whose citizens may apply, Mexico included: ${G.countries.join(', ')}. The list changes as arrangements are signed, and CBP notes that additional requirements may apply depending on the country. For South Korea, for example, CBP's FAQ says applicants first enroll in their government's Smart Entry Service and then create their account in the CBP system. The CBP fee and the interview, at an enrollment center or on arrival, are the same as for a US applicant.</p>
<p>Some arrangements also work the other way: CBP mentions that Global Entry members may be eligible for the fast lanes of some partner countries, for example Germany's EasyPASS gates or Taiwan's e-Gate, under each country's own rules and fees. That is a separate enrollment and is not included in the US membership.</p>
<h2>How long it takes</h2>
<p>For every applicant, CBP says ${h.pc(G.approvedShare)} of applications are approved within ${G.approvedWeeks} weeks while some take ${G.maxMonths} months or longer. A partner-country check can add its own delay. The tool below gives the dates those figures imply from the day you applied; it cannot predict your own case.</p>
<!--tool:mini:ge-time-->
<h2>Children and families</h2>
<p>There is no minimum age for Global Entry in the CBP rules, though some partner arrangements set one. A child under 18 needs a parent or guardian's consent, a separate application and an interview with a parent present, and pays nothing when the parent is a member or applies at the same time.</p>
<h2>If you cannot join any program</h2>
<p>Travelers who cannot join any program use the regular arrival lanes for their passport type. Be wary of sites that offer a "Global Entry application service" for a fee: the only place to apply is ttp.dhs.gov, and the only fee is CBP's ${h.m(G.fee)}.</p>
<h2>The card question</h2>
<p>CBP issues Global Entry cards only to US citizens, lawful permanent residents and Mexican nationals. Members from partner countries use the airport kiosks with their passport, which is all they need for arrivals by air, but they get no card for the SENTRI or NEXUS land lanes. That matters only to those who also cross land borders often.</p>
<p>Check the CBP page for your own country before paying: each arrangement sets its own eligibility and steps.</p>`;
    },
  },
});
