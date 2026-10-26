import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tsa-precheck-cost', group: 'cost', order: 1,
  tool: { kind: 'cost', props: { program: 'precheck' } },
  mini: { kind: 'mini:card' },
  related: ['tsa-precheck-renewal', 'credit-cards-that-pay-for-global-entry', 'global-entry-cost', 'clear-vs-tsa-precheck', 'military-tsa-precheck'],
  sources: ['tsa-precheck', 'tsa-renew', 'tsa-faq', 'tsa-cards', 'tsa-military'],
  en: {
    slug: 'tsa-precheck-cost', nav: 'TSA PreCheck cost', card: 'Enrollment and renewal price of IDEMIA, Telos and CLEAR, the cheapest route over ten years, card credits and the cases where it is free.',
    title: 'TSA PreCheck Cost 2026: $79.75 to $85 by Provider, Renewal',
    description: 'TSA PreCheck cost in 2026: IDEMIA $79.75, CLEAR $84.95, Telos $85 for five years; renewal from $58.75. Ten-year totals, card credits and who gets it for free.',
    h1: 'TSA PreCheck cost in 2026, provider by provider',
    intro: 'Pick a provider and a renewal channel: the calculator adds five and ten years, for one adult or several, after any card credit.',
    resume: (h) => {
      const i = h.provider('idemia'), t = h.provider('telos'), c = h.provider('clear'), ren = h.cheapestRenewal();
      return `TSA PreCheck no longer has one price. TSA authorizes three companies to enroll travelers, and each sets its own fee for the same five-year membership: ${h.m(i.enroll)} with IDEMIA, ${h.m(c.enroll)} with CLEAR and ${h.m(t.enroll)} with Telos, which is why TSA's headline speaks of "five years of benefits for $85 or less". Renewal is cheaper and also varies by channel: IDEMIA charges ${h.m(i.renewOnline)} online and ${h.m(i.renewInPerson)} in person, Telos ${h.m(t.renewOnline)} online and ${h.m(t.renewInPerson)} in person, CLEAR ${h.m(c.renewOnline)} online and ${h.m(c.renewInPerson)} in person. The cheapest ten years for one adult is therefore ${h.m(i.enroll + ren.amount)}: enroll with IDEMIA, renew online with IDEMIA or in person with Telos. Children 17 and under need no membership when they fly with you. About forty credit cards refund the fee, service members pay nothing with their DoD ID, and military spouses get ${h.m(h.P.military.spouseDiscount)} off.`;
    },
    faqs: (h) => {
      const i = h.provider('idemia'), T = h.P.precheck;
      return [
        { q: 'Why does TSA PreCheck cost different amounts?', a: `Because TSA no longer sells it alone. Three authorized enrollment providers, IDEMIA, Telos and CLEAR, collect the fee and set their own prices for enrollment and renewal, online and in person. The membership they deliver is identical: the same five years, the same lanes, a Known Traveler Number that differs only by its prefix. The lowest enrollment price on tsa.gov is ${h.m(i.enroll)}.` },
        { q: 'Is the TSA PreCheck fee refundable if I am not approved?', a: `No. TSA's FAQ says that once the in-person step is complete and payment is taken, for a new application or a renewal, there are no refunds. If you never finish the in-person visit, your incomplete file is purged from the provider's system after ${T.purgeIncompleteDays} days. A card credit still applies to a fee that was charged, whatever the outcome.` },
        { q: 'Can I change provider when I renew TSA PreCheck?', a: 'Yes. You can renew with any of the three providers, whichever one you enrolled with, and pick the cheapest channel. TSA’s FAQ confirms that the Known Traveler Number remains the same whichever provider you pick, so nothing changes in your airline profiles. Providers differ only in locations, prices and promotions.' },
        { q: 'Who gets TSA PreCheck for free?', a: 'Service members of the armed forces, the Coast Guard, the Reserve and the National Guard, cadets of the service academies, and some civilians of the Department of Defense, through their DoD ID number. Military survivor families with a TAPS letter, and veterans with qualifying disabilities under the VETS Safe Travel Act, enroll at no cost. Everyone else can look for a card that refunds the fee.' },
      ];
    },
    body: (h) => {
      const P = h.P, T = P.precheck;
      const rows = h.PROVIDERS.map((p) => [p.name, h.m(p.enroll), h.m(p.renewOnline), h.m(p.renewInPerson), h.m(p.enroll + Math.min(p.renewOnline, p.renewInPerson)), h.num(p.locations)]);
      return `<h2>The three prices, side by side</h2>
${h.table(['Provider', 'Enrollment', 'Renew online', 'Renew in person', 'Ten years, cheapest channel', 'Locations'], rows, `TSA PreCheck and renewal pages, read on ${h.read}. Same provider at enrollment and renewal; you may switch.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Two oddities stand out. Telos is the most expensive to join but, in person, ties for the cheapest renewal. CLEAR charges the same ${h.m(h.provider('clear').enroll)} for an in-person renewal as for a first enrollment. Since you may renew with any provider, the cheapest ten years mixes them: join with IDEMIA, then renew with IDEMIA online or Telos in person.</p>
<h2>What the fee pays for</h2>
<p>TSA says the fee keeps your eligibility for five years and covers the operational costs of the background check. It includes the fingerprints, the identity check of the in-person visit and the recurrent vetting that follows: members are checked again against criminal records during the five years, and TSA may suspend the benefit while it reviews new information, usually for less than ${T.suspensionDaysTypical} days and up to ${T.suspensionDaysMax}. It does not include CLEAR+, Global Entry or any lane outside US airport security.</p>
<h2>Card credits and other ways to pay less</h2>
<p>TSA lists ${P.tsaCardListCount} credit cards that give a statement credit toward the PreCheck fee with any provider, and several loyalty programs that let you pay with points through IDEMIA. The credit is usually up to ${h.m(120)} once every four years, which covers any PreCheck fee in full; one large issuer caps it at ${h.m(85)} for PreCheck, still enough. The fee must be charged to the card, and the credit is per account or per cardholder depending on the issuer.</p>
<!--tool:mini:card-->
<p>Those credits also cover Global Entry at ${h.m(P.globalEntry.fee)}. If your card pays either one, take Global Entry when you have a passport: it includes PreCheck and costs you the same nothing. The ${h.a('credit-cards-that-pay-for-global-entry', 'card credits page')} lists the amounts and conditions published by five issuers.</p>
<h2>Free and discounted PreCheck</h2>
<p>Members of the armed forces, the Coast Guard, the Reserve and the National Guard already have PreCheck: they enter their DoD ID number as Known Traveler Number. Military spouses get ${h.m(P.military.spouseDiscount)} off with a provider, survivor families enroll free with a TAPS letter, and veterans with qualifying service-connected disabilities enroll free under the VETS Safe Travel Act through CLEAR or IDEMIA. The ${h.a('military-tsa-precheck', 'military page')} gives each route.</p>
<h2>What PreCheck does not cost: your children</h2>
<p>Children 17 and under may go through the PreCheck lane with a parent or guardian who has the indicator, without a membership of their own; from 13 they need the indicator on their own boarding pass, which comes from booking on the same reservation. A family of four with two children under 13 pays for two memberships, not four. Pay only on a provider site whose address ends in .gov: TSA warns that other sites are not official.</p>
<p>Over ten years, the gap between the cheapest and the most expensive route for one adult is ${h.m(Math.max(...h.PROVIDERS.map((p) => p.enroll)) + Math.max(...h.PROVIDERS.flatMap((p) => [p.renewOnline, p.renewInPerson])) - h.cheapestEnroll().enroll - h.cheapestRenewal().amount)}: join with the dearest provider and renew in its dearest channel, or pick the cheapest of each. For a couple, the gap doubles.</p>`;
    },
  },
});
