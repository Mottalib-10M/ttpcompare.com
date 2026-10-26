import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'sentri-vs-global-entry', group: 'choose', order: 4,
  tool: { kind: 'chooser', props: { mexicoLand: 12, international: 1, domestic: 2 } },
  mini: { kind: 'mini:family' },
  related: ['nexus-vs-global-entry', 'tsa-precheck-vs-global-entry', 'global-entry-cost', 'global-entry-for-non-us-citizens', 'home'],
  sources: ['cbp-sentri', 'cbp-ge-faq', 'cbp-ge-card', 'cbp-fees', 'cbp-precheck', 'cbp-ge-eligibility'],
  en: {
    slug: 'sentri-vs-global-entry', nav: 'SENTRI vs Global Entry', card: 'Crossing from Mexico by car: SENTRI or Global Entry, the $120 fee of each, the vehicle registration, and who can join which.',
    title: 'SENTRI vs Global Entry: Land Lanes from Mexico, $120 Each',
    description: 'SENTRI vs Global Entry for crossings from Mexico: both $120 for five years with PreCheck. The Global Entry card works in SENTRI lanes once the car is listed.',
    h1: 'SENTRI vs Global Entry: which one for the southern border',
    intro: 'Enter your crossings from Mexico and your flights: the chooser picks SENTRI or Global Entry and gives the yearly cost.',
    resume: (h) => {
      const S = h.P.sentri, G = h.P.globalEntry;
      return `SENTRI and Global Entry are two CBP programs with the same price since October 1, 2024: ${h.m(S.fee)} for five years per adult, and nothing for applicants under 18 whose parent or guardian is a member or applies at the same time. SENTRI was built for the southern land border: members use dedicated primary lanes into the United States at ports of entry from Mexico, and they get TSA PreCheck with their PASS ID. Global Entry was built for international air arrivals, with kiosks at US airports, and its card is also accepted in the SENTRI lanes, as long as the member follows SENTRI rules and registers the vehicle. That registration is free when requested in the initial Global Entry application and costs ${h.m(G.sentriVehicleLater)} afterwards. The deciding point is eligibility: SENTRI has no citizenship or age requirement, while Global Entry is open only to US citizens and residents, Mexican nationals and the partner countries CBP lists.`;
    },
    faqs: (h) => {
      const G = h.P.globalEntry, S = h.P.sentri;
      return [
        { q: 'Can I drive through the SENTRI lane with a Global Entry card?', a: `Yes, after one step. CBP accepts the Global Entry card in SENTRI lanes, but the vehicle must be registered with CBP and inspected at a SENTRI enrollment center. If you ask for it in your first Global Entry application, the registration has no fee; added later, it costs ${h.m(G.sentriVehicleLater)}.` },
        { q: 'How much did SENTRI cost before the 2024 change?', a: `It was charged in pieces: an application fee of ${h.m(S.oldApplication)} (capped per family), a fingerprint fee of ${h.m(S.oldFingerprint)} and a system cost fee of ${h.m(S.oldDcl)}, also capped per family. Since October 1, 2024, CBP charges a single ${h.m(S.fee)} per adult and nothing for minors under 18, in line with Global Entry and NEXUS.` },
        { q: 'Can someone who is not a US citizen join SENTRI?', a: 'Yes. CBP states that there are no citizenship or age requirements for SENTRI membership, although a minor needs a parent or guardian\'s consent. Applicants still go through the same background checks as for the other programs and an in-person interview, and anyone who is inadmissible to the United States or has a criminal record can be refused.' },
      ];
    },
    body: (h) => {
      const G = h.P.globalEntry, S = h.P.sentri;
      const rows = [
        ['Fee, five years', h.m(S.fee), h.m(G.fee)],
        ['Minors under 18', 'free (parent member or applying)', 'free (parent member or applying)'],
        ['Who can apply', 'no citizenship requirement', 'US citizens and residents, Mexican nationals, partner countries'],
        ['Land lanes from Mexico', 'yes', 'yes, card plus registered vehicle'],
        ['Kiosks at US airports', 'yes for US citizens and residents, once fingerprints and documents are on file; Mexican nationals apply for Global Entry', 'yes'],
        ['TSA PreCheck', 'yes (US citizens, residents, partner citizens)', 'yes'],
        ['Vehicle registration', 'part of SENTRI', `free at application, ${h.m(G.sentriVehicleLater)} later`],
      ];
      return `<h2>Side by side</h2>
${h.table(['', 'SENTRI', 'Global Entry'], rows, `CBP SENTRI, Global Entry FAQ and card pages, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>CBP lists the TSA PreCheck benefit for US citizens, permanent residents and citizens of partner countries enrolled in SENTRI. A SENTRI member of another nationality gets the land lanes but not necessarily PreCheck.</p>
<h2>For a US citizen, the two end up very close</h2>
<p>CBP's FAQ settles a point many travelers miss: US citizens and permanent residents who are SENTRI members can use Global Entry at the airport once CBP has their fingerprints and document information, at no extra cost. In the other direction, a Global Entry member can drive through the SENTRI lanes once the vehicle is registered. For a US citizen the choice therefore comes down to the route, not the benefits. SENTRI includes the vehicle inspection from the start and is done at a SENTRI enrollment center near the southern border. Global Entry can be finished on a return flight through Enrollment on Arrival, and the car is added for free if you ask in the first application, or for ${h.m(G.sentriVehicleLater)} later.</p>
<p>The calculator below adds a family over five years. With two adults and two children, Global Entry and SENTRI each cost ${h.m(G.fee * 2)}, because the children pay nothing when a parent is a member or applies at the same time.</p>
<!--tool:mini:family-->
<h2>For a Mexican national or another nationality</h2>
<p>Mexican nationals can apply for Global Entry, and CBP issues them a Global Entry card. For citizens of other countries, Global Entry is limited to the partner countries CBP lists, each with its own vetting; everyone else can still apply for SENTRI, which has no citizenship requirement. Admissibility to the United States, a clean record with customs and immigration and the interview apply in every case.</p>
<h2>Applying and keeping the lane</h2>
<p>Both programs are applied for on ttp.dhs.gov, never through a paid intermediary. The ${h.m(S.fee)} is charged when you apply and not refunded if CBP denies the application. A violation of program rules, such as carrying an undeclared item through a SENTRI lane, can end the membership; CBP says any violation of the terms leads to enforcement action and termination of privileges. Renewal opens a year before expiry and, if filed on time, keeps the benefits up to 24 months while it is processed; the ${h.a('global-entry-renewal', 'renewal page')} gives the dates for your card.</p>
<p>Whichever you pick, the PASS ID you receive is your Known Traveler Number for TSA PreCheck at US airports, so the choice never costs you the PreCheck lane.</p>`;
    },
  },
});
