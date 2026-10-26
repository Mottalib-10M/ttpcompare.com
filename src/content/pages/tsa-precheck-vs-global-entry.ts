import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tsa-precheck-vs-global-entry', group: 'choose', order: 1,
  tool: { kind: 'chooser', props: { international: 2, domestic: 4 } },
  mini: { kind: 'mini:gap' },
  related: ['home', 'clear-vs-tsa-precheck', 'global-entry-cost', 'tsa-precheck-cost', 'global-entry-interview'],
  sources: ['tsa-precheck', 'tsa-faq', 'cbp-ge-eligibility', 'cbp-ge-apply', 'cbp-precheck', 'cbp-eoa'],
  en: {
    slug: 'tsa-precheck-vs-global-entry', nav: 'PreCheck vs Global Entry', card: 'What each one covers, the fee gap over five and ten years, who can apply and when Global Entry is the better buy.',
    title: 'TSA PreCheck vs Global Entry: Cost, Coverage, Which Wins',
    description: 'TSA PreCheck vs Global Entry: $79.75 to $85 against $120 for five years, what each covers at security and customs, the interview, and which one fits your trips.',
    h1: 'TSA PreCheck vs Global Entry: which one is worth it for you',
    intro: 'Enter your trips and your status: the chooser weighs both programs, with the cost per year and per round trip.',
    resume: (h) => {
      const pre = h.cheapestEnroll(), G = h.P.globalEntry;
      return `TSA PreCheck and Global Entry overlap on one point and differ on everything else. PreCheck speeds up the security checkpoint when you leave a US airport, for ${h.m(pre.enroll)} to ${h.m(h.provider('telos').enroll)} over five years depending on the enrollment provider. Global Entry speeds up customs and immigration when you come back from abroad, at a kiosk instead of the passport line, and it includes PreCheck: members type their PASS ID as Known Traveler Number. It costs ${h.m(G.fee)} for five years, so the gap with the cheapest PreCheck is ${h.m(G.fee - pre.enroll)}, about eight dollars a year. Global Entry asks more of you: a valid passport, a background check in which CBP approves ${h.pc(G.approvedShare)} of applications within ${G.approvedWeeks} weeks but some take a year or longer, and an interview with a CBP officer. If you leave the country even once a year and can attend that interview, Global Entry is the better buy.`;
    },
    faqs: (h) => {
      const pre = h.cheapestEnroll(), G = h.P.globalEntry;
      return [
        { q: 'Does Global Entry include TSA PreCheck automatically?', a: `Yes, but only if you use the number. Global Entry members are eligible for PreCheck and must enter their nine-digit PASS ID, printed on the back of the card and shown in the Trusted Traveler Programs account, in the Known Traveler Number field of each reservation or frequent flyer profile. Without it, the PreCheck indicator does not appear on the boarding pass.` },
        { q: 'Can I switch from TSA PreCheck to Global Entry later?', a: `There is no upgrade. You apply for Global Entry as a new applicant and pay the full ${h.m(G.fee)}, even if your PreCheck has years left. TSA notes that a PreCheck member gives the Known Traveler Number on the Global Entry application and must finish it before the PreCheck membership expires, or start again. TSA adds that PreCheck members may be eligible for expedited processing of that application.` },
        { q: 'Is TSA PreCheck enough if I never leave the country?', a: `Yes. For domestic flights only, PreCheck gives everything Global Entry would give at the airport, for less: from ${h.m(pre.enroll)} against ${h.m(G.fee)}, with no interview and no passport needed. Global Entry starts to pay off from the first trip abroad, or when a card credit refunds its fee, which makes the gap zero.` },
        { q: 'Which is faster to get, PreCheck or Global Entry?', a: `PreCheck, by a wide margin. TSA says most applicants receive their Known Traveler Number ${h.P.precheck.ktnDaysTypical.join(' to ')} days after the in-person visit, some up to ${h.P.precheck.ktnDaysMax} days. CBP approves ${h.pc(G.approvedShare)} of Global Entry applications within ${G.approvedWeeks} weeks, but some take ${G.maxMonths} months or longer, and the interview comes after that approval.` },
      ];
    },
    body: (h) => {
      const pre = h.cheapestEnroll(), ren = h.cheapestRenewal(), G = h.P.globalEntry, T = h.P.precheck;
      const rows = [
        ['Speeds up', 'US airport security, on departure', 'US customs and immigration on return, plus security'],
        ['Fee for five years', `${h.m(pre.enroll)} to ${h.m(h.provider('telos').enroll)}`, h.m(G.fee)],
        ['Renewal', `${h.m(ren.amount)} to ${h.m(h.provider('clear').renewInPerson)}`, h.m(G.fee)],
        ['Who can apply', T.eligible, 'the same, plus Mexican nationals and partner countries'],
        ['Document needed', 'passport, or REAL ID plus proof of citizenship', 'valid passport'],
        ['Step in person', `about ${T.inPersonMinutes} minutes, fingerprints and photo`, 'interview with a CBP officer'],
        ['Typical decision', `${T.ktnDaysTypical.join('-')} days (up to ${T.ktnDaysMax})`, `${h.pc(G.approvedShare)} within ${G.approvedWeeks} weeks (some ${G.maxMonths} months or more)`],
        ['Children', 'none needed to 17 when flying with you', 'no fee under 18 with a member parent'],
      ];
      return `<h2>Side by side</h2>
<p>Read the table by line rather than by column: on cost, the two are close; on what they cover and how you get them, they are far apart. The figures come from the TSA PreCheck page and the CBP Global Entry pages, read on ${h.read}.</p>
${h.table(['', 'TSA PreCheck', 'Global Entry'], rows, 'TSA and CBP pages; renewal prices by provider on tsa.gov/precheck/renew.', ['l', 'l', 'l'])}
<h2>When Global Entry is the better buy</h2>
<p>TSA's own advice is to consider Global Entry from four trips abroad a year. The arithmetic is kinder to Global Entry than that. Over five years the gap with the cheapest PreCheck is ${h.m(G.fee - pre.enroll)}; at renewal, with PreCheck renewed online at ${h.m(ren.amount)}, it is ${h.m(G.fee - ren.amount)}. Spread over one return trip a year, that is eight to twelve dollars per arrival for skipping the passport line, which on a busy evening at a large gateway can be the longest wait of the journey. A card with a fee credit of ${h.m(120)} makes the gap disappear.</p>
<!--tool:mini:gap-->
<p>Global Entry also helps on land: its card works in the SENTRI lanes from Mexico and the NEXUS lanes into the United States from Canada, after the vehicle is registered for SENTRI. And it travels with you: a Global Entry member can use the kiosks at Canadian preclearance airports and, through arrangements CBP lists, faster lanes in some partner countries, each with its own enrollment.</p>
<h2>When PreCheck alone is the right call</h2>
<p>PreCheck wins in three situations. You never or almost never fly abroad. You have no valid passport and do not plan to get one, since Global Entry interviews require it while PreCheck accepts a REAL ID driver's license with a birth certificate. Or you need the faster lane within weeks: PreCheck numbers usually arrive in days, while Global Entry can sit in review for months and then needs an interview slot, unless you can use ${h.a('enrollment-on-arrival', 'Enrollment on Arrival')} on your next return from abroad.</p>
<p>Holding both is rarely useful. If you already have PreCheck with years left and apply for Global Entry, use the Global Entry PASS ID in your reservations once you are approved and let PreCheck expire; there is no refund for the unused years.</p>
<h2>Eligibility decides first</h2>
<p>PreCheck is limited to ${T.eligible}. Global Entry takes the same people plus Mexican nationals and citizens of ${G.countries.length} partner countries, among them the United Kingdom, Germany, India, Japan and South Korea, each after vetting by their own government. A Canadian citizen can have neither directly and goes through NEXUS instead, which includes both. Any criminal conviction, customs or immigration violation can make an applicant ineligible for either; the ${h.a('global-entry-denied', 'denials page')} explains the routes when that happens.</p>`;
    },
  },
});
