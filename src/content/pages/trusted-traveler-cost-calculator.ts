import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'trusted-traveler-cost-calculator', group: 'cost', order: 3,
  tool: { kind: 'cost', props: { program: 'globalEntry', credit: 120 } },
  mini: { kind: 'mini:clear-cost' },
  related: ['home', 'global-entry-cost', 'tsa-precheck-cost', 'credit-cards-that-pay-for-global-entry', 'clear-vs-tsa-precheck'],
  sources: ['tsa-precheck', 'tsa-renew', 'cbp-ge-eligibility', 'cbp-nexus-apply', 'cbp-fees', 'clear-plus', 'tsa-cards'],
  en: {
    slug: 'trusted-traveler-cost-calculator', nav: 'Cost over 5 and 10 years', card: 'One tool for every program: enrollment, renewal, family members and card credits added up over five and ten years.',
    title: 'Trusted Traveler Cost Calculator: 5 and 10 Years, Credits',
    description: 'Trusted traveler cost over five and ten years for PreCheck, Global Entry, NEXUS, SENTRI and CLEAR+, with renewal, children, extra adults and card credits.',
    h1: 'Trusted traveler cost calculator: five and ten years, after credits',
    intro: 'Choose a program, the household and your card credit: the totals update as you type, and nothing leaves this page.',
    resume: (h) => {
      const P = h.P, pre = h.cheapestEnroll(), ren = h.cheapestRenewal();
      return `The price printed on each program's page is the price of five years for one adult. Over a longer horizon, three things change the bill. The renewal: PreCheck renews for ${h.m(ren.amount)} to ${h.m(h.provider('clear').renewInPerson)} depending on the provider and the channel, while Global Entry, NEXUS and SENTRI renew at the same ${h.m(P.globalEntry.fee)}. The household: children under 18 pay nothing for the CBP programs with a member parent and need no PreCheck of their own when they fly with you, while CLEAR+ charges ${h.m(P.clear.familyAdd)} a year for each added adult. And the card credit, typically up to ${h.m(120)} once every four years, which over ten years covers both the enrollment and the renewal if you keep the card. One adult pays ${h.m(pre.enroll + ren.amount)} for ten years of PreCheck at the cheapest providers, ${h.m(P.globalEntry.fee * 2)} for Global Entry and ${h.m(P.clear.annual * 10)} for CLEAR+, before any credit. The calculator above does the same sums for your own case.`;
    },
    faqs: (h) => {
      const P = h.P;
      return [
        { q: 'Why does the calculator count a renewal at year five?', a: 'Because every program lasts five years and the ten-year total needs a second term. PreCheck can be renewed online from six months before expiry and CBP programs from one year before; in both cases the new term starts when the old one ends, so the renewal date does not change the total. CLEAR+ is billed every year instead.' },
        { q: 'How does a card credit every four years cover two payments?', a: 'The credit resets four years after the last one. You pay the enrollment at year zero and get the credit; the renewal falls around year five, more than four years later, so the credit is available again. If a family member used the same card credit in between, the timing shifts and one payment may not be covered.' },
        { q: 'Does the calculator include the CLEAR code with PreCheck?', a: `Yes, under "CLEAR+ with PreCheck through CLEAR". When you enroll in PreCheck with CLEAR, TSA's page says CLEAR issues a one-time code lowering the first CLEAR+ year to ${h.m(P.precheck.clearPlusCodeNew)}, and to ${h.m(P.precheck.clearPlusCodeRenew)} after an online renewal. The calculator applies it in year one and year six and the full price in the other years.` },
      ];
    },
    body: (h) => {
      const P = h.P, pre = h.cheapestEnroll(), ren = h.cheapestRenewal(), clr = h.provider('clear');
      const ten = (x: number) => h.m(x);
      const rows = [
        ['TSA PreCheck (IDEMIA, renew online)', h.m(pre.enroll), ten(pre.enroll + ren.amount), '$0'],
        ['Global Entry', h.m(P.globalEntry.fee), ten(P.globalEntry.fee * 2), '$0'],
        ['NEXUS', h.m(P.nexus.fee), ten(P.nexus.fee * 2), '$0'],
        ['SENTRI', h.m(P.sentri.fee), ten(P.sentri.fee * 2), '$0'],
        ['CLEAR+', h.m(P.clear.annual * 5), ten(P.clear.annual * 10), 'credit per year only'],
        ['CLEAR+ with PreCheck through CLEAR', h.m(clr.enroll + P.precheck.clearPlusCodeNew + 4 * P.clear.annual), ten(clr.enroll + P.precheck.clearPlusCodeNew + 4 * P.clear.annual + clr.renewOnline + P.precheck.clearPlusCodeRenew + 4 * P.clear.annual), 'PreCheck part only'],
      ];
      return `<h2>One adult, no credit, then with a $120 credit</h2>
${h.table(['Program', 'Five years', 'Ten years', 'Ten years with a $120 credit every 4 years'], rows, `Fees read on tsa.gov, cbp.gov and CLEAR’s price page on ${h.read}.`, ['l', 'r', 'r', 'r'])}
<p>The last column shows why card credits matter more than the choice of provider: with a credit of ${h.m(120)} every four years, every government program costs nothing out of pocket, and the only decision left is which one gives you more lanes. CLEAR+ is the exception, because a fee credit for Global Entry or PreCheck does not apply to it; only a separate CLEAR credit does.</p>
<h2>How the calculator counts</h2>
<p>Each term is five years. For ten years the calculator adds one renewal at year five, at the price of the provider and channel you chose for PreCheck, or the CBP fee. A card credit is applied to a payment when the period you set has passed since the last covered payment; the credit is capped at the fee, never more. With several adults, the calculator assumes each holds an eligible card; uncheck that by setting the credit to zero if only one adult has the card, and count the credit by hand.</p>
<p>For CLEAR+, the yearly price is ${h.m(P.clear.annual)} for the first member and ${h.m(P.clear.familyAdd)} for each added adult, at most ${P.clear.familyMaxAdults}; children ${P.clear.kidsMaxAge} and under are free. A yearly CLEAR credit is subtracted each year up to the price. The mini-tool below turns that yearly figure into a price per departure.</p>
<!--tool:mini:clear-cost-->
<h2>What the totals leave out</h2>
<p>They leave out costs that are not fees: a passport, needed for Global Entry, the trip to an enrollment center, and the time spent there. They also leave out the extras of the CBP programs, ${h.m(P.globalEntry.cardReplace)} for a replacement card and ${h.m(P.globalEntry.sentriVehicleLater)} for a vehicle added to SENTRI lanes later. Military members, survivor families and some disabled veterans pay nothing for PreCheck; the ${h.a('military-tsa-precheck', 'military page')} covers them.</p>
<h2>Using the result</h2>
<p>If the ten-year difference between two programs is small, decide on what they cover rather than on price: customs on return, the Canadian border, the Mexican land border or the ID line. The ${h.a('home', 'chooser on the home page')} starts from how you fly instead of from the program, and gives the cost per trip.</p>
<h2>Three households, worked through</h2>
<p>A single traveler flying abroad once a year, with no card credit: Global Entry costs ${h.m(h.P.globalEntry.fee * 2)} over ten years, or ${h.m(h.P.globalEntry.fee / 5)} a year. A couple with two children who travel abroad on vacation: ${h.m(h.P.globalEntry.fee * 4)} over ten years for both adults, the children free with a member parent. A frequent domestic flyer who adds CLEAR+ to PreCheck: about ${h.m(h.P.clear.annual * 10)} for ten years of CLEAR+ alone, which is why a yearly CLEAR credit on a card changes that answer more than any other input.</p>`;
    },
  },
});
