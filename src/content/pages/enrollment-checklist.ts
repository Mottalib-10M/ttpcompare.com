import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'enrollment-checklist', group: 'apply', order: 1,
  tool: { kind: 'checklist', props: { route: 'precheck-new' } },
  mini: { kind: 'mini:scam' },
  related: ['global-entry-interview', 'enrollment-on-arrival', 'tsa-precheck-processing-time', 'known-traveler-number', 'home'],
  sources: ['tsa-precheck', 'tsa-faq', 'tsa-benefits', 'cbp-ge-apply', 'cbp-ge-eligibility', 'cbp-eoa', 'cbp-nexus-apply', 'ttp'],
  en: {
    slug: 'enrollment-checklist', nav: 'Enrollment checklist', card: 'Step by step for PreCheck, Global Entry and NEXUS: documents to bring, where to apply, and what to do once approved.',
    title: 'Trusted Traveler Enrollment Checklist: Documents and Steps',
    description: 'Trusted traveler enrollment checklist for TSA PreCheck, Global Entry and NEXUS: the official sites, the documents to bring and each step in order, ticked.',
    h1: 'Enrollment checklist: PreCheck, Global Entry and NEXUS, step by step',
    intro: 'Pick your program and route: tick each step as you go. The ticks stay on your device and are never sent.',
    resume: (h) => {
      const T = h.P.precheck, G = h.P.globalEntry;
      return `Enrolling takes two stages for every program: an application online, then a visit in person. For TSA PreCheck, the online part takes about ${T.onlineMinutes} minutes on the site of one of the three providers, then a visit of about ${T.inPersonMinutes} minutes at one of more than ${h.num(T.totalLocations)} enrollment locations, where fingerprints and a photo are taken and the fee is paid. You bring either one document from TSA's List A, such as a US passport, or two from List B, such as a REAL ID license and a birth certificate. For Global Entry and NEXUS, you apply and pay first on ttp.dhs.gov with a login.gov account; after a background check, CBP grants conditional approval, and only then do you book the interview or use Enrollment on Arrival, with a valid passport and proof of address. CBP approves ${h.pc(G.approvedShare)} of Global Entry applications within ${G.approvedWeeks} weeks. The checklist above turns each route into ticked steps, with the source of each.`;
    },
    faqs: (h) => {
      const T = h.P.precheck;
      return [
        { q: 'What documents do I need for TSA PreCheck enrollment?', a: 'One unexpired document from List A, such as a US passport or passport card, an enhanced driver’s license, a green card or a re-entry permit. Without one, bring two from List B: a REAL ID photo ID or a military ID, plus proof of citizenship such as a full US birth certificate or a naturalization certificate. Bring a marriage certificate or court order if your name changed.' },
        { q: 'Do I need an appointment for the PreCheck visit?', a: 'Not always. TSA lets you book a slot or walk in at many enrollment locations, but walk-ins depend on the center and can mean a wait. Booking during the online pre-enrollment is the safer choice, especially at airport centers. Look at the hours of the location first, as some are open only on certain days.' },
        { q: 'What happens after the in-person visit?', a: `For PreCheck, you wait for your Known Traveler Number, usually ${T.ktnDaysTypical.join(' to ')} days, then add it to every airline reservation. For Global Entry, the decision follows the interview and a card arrives by mail. In both cases, the benefit only shows when the KTN or PASS ID is in the booking, under the exact name you enrolled with.` },
        { q: 'Can I apply for Global Entry and PreCheck at the same time?', a: 'There is no need: Global Entry includes PreCheck. If you have a passport and travel abroad, apply only for Global Entry. If you need the PreCheck lane within weeks and expect a long Global Entry review, some travelers take PreCheck first, but the two fees are then both paid and the PreCheck years left are not refunded.' },
      ];
    },
    body: (h) => {
      const T = h.P.precheck, G = h.P.globalEntry;
      const rows = [
        ['TSA PreCheck', 'provider site ending in tsa.dhs.gov', `about ${T.onlineMinutes} min online, ${T.inPersonMinutes} min in person`, 'List A, or two from List B'],
        ['Global Entry', 'ttp.dhs.gov with login.gov', 'application, then interview after conditional approval', 'valid passport, proof of address, green card if any'],
        ['NEXUS', 'ttp.dhs.gov with login.gov', 'application, two agency reviews, joint interview', 'passport or proof of citizenship, proof of residence'],
        ['SENTRI', 'ttp.dhs.gov with login.gov', 'application, interview, vehicle inspection if needed', 'passport or proof of citizenship, vehicle papers'],
      ];
      return `<h2>The four routes at a glance</h2>
${h.table(['Program', 'Where you apply', 'Steps', 'Documents'], rows, `TSA PreCheck FAQ, CBP Global Entry, NEXUS and SENTRI pages, read on ${h.read}.`, ['l', 'l', 'l', 'l'])}
<p>Only two kinds of address are official: the three provider sites under tsa.dhs.gov for PreCheck, and ttp.dhs.gov for the CBP programs. Any site that charges more than the government fee to "help" you fill in the form is a private business, and some are outright scams. The tool below checks a renewal or application site from its address and price.</p>
<!--tool:mini:scam-->
<h2>Before you start</h2>
<ul>
<li>Use the name exactly as it appears on your documents. If your airline profiles use another form of your name, fix them now: the PreCheck indicator needs the name, date of birth and number to match.</li>
<li>For Global Entry, check that your passport stays valid through the interview; bring every passport you travel on.</li>
<li>For a child, a parent or legal guardian must give permission for the CBP programs and attend the interview. For PreCheck, children 17 and under usually need no membership; see the ${h.a('tsa-precheck-for-kids', 'kids page')}.</li>
<li>Decide how you will pay: a card with a fee credit makes the program free for you. The ${h.a('credit-cards-that-pay-for-global-entry', 'card credits page')} shows what each issuer covers.</li>
</ul>
<h2>Global Entry: the interview step</h2>
<p>After conditional approval, CBP invites you to schedule an interview in your TTP account at an enrollment center, or to complete it on your return from abroad through ${h.a('enrollment-on-arrival', 'Enrollment on Arrival')}, without an appointment. Two airports, Miami and Detroit, also offer Enrollment on Departure for same-day travelers. The ${h.a('global-entry-interview', 'interview page')} has its own checklist, with the questions to expect.</p>
<h2>After approval</h2>
<p>PreCheck gives you a Known Traveler Number starting with TT, TE or AC; Global Entry, NEXUS and SENTRI give a nine-digit PASS ID that works as KTN. Add it to each reservation and to your frequent flyer profiles, then check that the indicator appears on your next boarding pass. Note the expiration date: a renewal reminder file is on the ${h.a('tsa-precheck-renewal', 'PreCheck renewal')} and ${h.a('global-entry-renewal', 'Global Entry renewal')} pages. If a step goes wrong, the ${h.a('known-traveler-number', 'Known Traveler Number page')} decodes the number and lists the usual causes.</p>
<h2>If you only have a REAL ID license</h2>
<p>For PreCheck, a REAL ID license alone is not enough: it is a List B document and needs a second one proving citizenship or status, such as a full US birth certificate. Global Entry needs a valid passport in every case. If you have neither a passport nor a birth certificate at hand, order the missing document before booking the visit.</p>`;
    },
  },
});
