import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'global-entry-cost', group: 'cost', order: 2,
  tool: { kind: 'cost', props: { program: 'globalEntry', adults: 2, kids: 2 } },
  mini: { kind: 'mini:family' },
  related: ['credit-cards-that-pay-for-global-entry', 'tsa-precheck-vs-global-entry', 'global-entry-renewal', 'trusted-traveler-cost-calculator', 'tsa-precheck-for-kids'],
  sources: ['cbp-ge-eligibility', 'cbp-fees', 'cbp-ge-faq', 'fr-nexus-fee', 'tsa-cards'],
  en: {
    slug: 'global-entry-cost', nav: 'Global Entry cost', card: 'The $120 fee for five years, what changed in October 2024, children at no fee, the card and its extras, and who pays nothing.',
    title: 'Global Entry Cost 2026: $120 for Five Years, Kids at $0',
    description: 'Global Entry costs $120 for five years since October 2024, with no fee for children under 18 whose parent applies. Renewal, card extras and credits added up.',
    h1: 'Global Entry cost: $120, and what else you might pay',
    intro: 'Set the number of adults and children and any card credit: the calculator gives five and ten years for the household.',
    resume: (h) => {
      const G = h.P.globalEntry;
      return `Global Entry costs ${h.m(G.fee)} per adult for a five-year membership, paid to CBP on ttp.dhs.gov when you submit the application and not refunded if it is denied. The fee rose from ${h.m(G.previousFee)} on October 1, 2024, under a rule published on April 2, 2024 that aligned Global Entry, NEXUS and SENTRI at the same amount. The same rule removed the fee for applicants under 18 when a parent or legal guardian is a member or applies at the same time, so a family of two adults and two children now pays ${h.m(G.fee * 2)} rather than four fees. Renewal costs the same ${h.m(G.fee)} every five years. Two extras may appear later: ${h.m(G.cardReplace)} to replace a lost or damaged card, and ${h.m(G.sentriVehicleLater)} to register a car for the SENTRI lanes if you did not ask for it in the first application. Global Entry includes TSA PreCheck, so the fee also replaces a PreCheck membership. Many travel cards refund up to ${h.m(120)} once every four years.`;
    },
    faqs: (h) => {
      const G = h.P.globalEntry;
      return [
        { q: 'Did the Global Entry fee go up in 2024?', a: `Yes. CBP raised it from ${h.m(G.previousFee)} to ${h.m(G.fee)} for applications received on or after October 1, 2024, the first change in more than fifteen years according to CBP. Applications paid before that date kept the old price, and CBP did not refund children's fees paid before the exemption for minors took effect.` },
        { q: 'Do children pay for Global Entry?', a: `Not when a parent or legal guardian is already a member or has an application in pending or conditionally approved status: the fee for the minor is waived. A child whose parents are not members can still enroll, with their consent, but pays the ${h.m(G.fee)} like an adult. Each child needs their own application and interview, with a parent present.` },
        { q: 'Is there a separate fee for the Global Entry interview?', a: `No. The ${h.m(G.fee)} covers the application, the background check and the interview, whether at an enrollment center, on arrival at an airport or by video for a renewal. Sites that charge for "interview booking" or "application assistance" are not CBP, which asks for nothing beyond its fee.` },
        { q: 'How much is a replacement Global Entry card?', a: `${h.m(G.cardReplace)}, requested in your TTP account under Manage Membership. The old card is deactivated as soon as you request the new one. You do not need the card to use the kiosks at airports, which use your passport; the card matters only for SENTRI and NEXUS land lanes and as a travel document at land and sea ports.` },
      ];
    },
    body: (h) => {
      const G = h.P.globalEntry, pre = h.cheapestEnroll(), ren = h.cheapestRenewal();
      const rows = [
        ['Application, adult', h.m(G.fee), 'every five years'],
        ['Application, under 18', '$0', 'parent or guardian a member or applying'],
        ['Application, under 18 without a member parent', h.m(G.fee), 'parent consent needed'],
        ['Renewal', h.m(G.fee), 'from one year before expiry'],
        ['Replacement card', h.m(G.cardReplace), 'old card deactivated'],
        ['Vehicle for SENTRI lanes', `$0 at application, ${h.m(G.sentriVehicleLater)} later`, 'inspection at a SENTRI center'],
      ];
      return `<h2>Every fee CBP can charge you</h2>
${h.table(['Item', 'Fee', 'When'], rows, `CBP eligibility page, Global Entry FAQ and fee release, read on ${h.read}.`, ['l', 'r', 'l'])}
<p>Nothing else is charged by CBP: no interview fee, no card fee for a first card, no fee for Enrollment on Arrival or the remote renewal interview. All payments go through ttp.dhs.gov.</p>
<h2>Ten years for a family</h2>
<p>For one adult, ten years of Global Entry cost ${h.m(G.fee * 2)}, against ${h.m(pre.enroll + ren.amount)} for the cheapest ten years of PreCheck alone. For a household, children change the picture in Global Entry's favor: under 18 they pay nothing when a parent is a member or applies at the same time, so the family total is set by the number of adults alone.</p>
<!--tool:mini:family-->
<p>The comparison with PreCheck for children runs differently: PreCheck children need no membership at all when they fly with you, but from 13 they need the indicator on their boarding pass and must be on your reservation, and they get nothing at customs. Global Entry children have their own membership, PreCheck included, and can use it when traveling apart from you.</p>
<h2>Card credits</h2>
<p>Most premium travel cards and several airline and hotel cards refund the Global Entry fee: up to ${h.m(120)} once every four years is the usual form, charged to the card. A credit capped at ${h.m(100)} leaves ${h.m(G.fee - 100)} to pay. Some issuers give one credit per account, others one per cardholder, which can cover a second adult. The ${h.a('credit-cards-that-pay-for-global-entry', 'card credits page')} lists the published terms of five issuers.</p>
<h2>Is the fee worth it?</h2>
<p>Over five years, ${h.m(G.fee)} is ${h.m(G.fee / 5)} a year. Against PreCheck alone, you pay ${h.m(G.fee - pre.enroll)} more at enrollment for the kiosks on every return from abroad. If you fly back into the United States once a year, that is under ten dollars per arrival; if a card refunds the fee, it is nothing. The case against it is not price but access: Global Entry needs a passport, a background check that can take months, and an interview. The ${h.a('tsa-precheck-vs-global-entry', 'PreCheck vs Global Entry page')} weighs both for your own trips.</p>
<h2>What happened to fees paid before the change</h2>
<p>CBP applied the new fee to applications received on or after October 1, 2024. An application paid before that date at ${h.m(h.P.globalEntry.previousFee)} kept that price for its five-year term, and the renewal is charged at the current ${h.m(h.P.globalEntry.fee)}. Fees already paid for children before the minor exemption took effect were not refunded. CBP's fee page, read on ${h.read}, shows the same ${h.m(h.P.globalEntry.fee)} for Global Entry, NEXUS and SENTRI.</p>
<p>Paying through any site other than ttp.dhs.gov adds a markup for nothing: CBP's fee is the only one required.</p>`;
    },
  },
});
