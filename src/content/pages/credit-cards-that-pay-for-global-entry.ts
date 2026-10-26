import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'credit-cards-that-pay-for-global-entry', group: 'cost', order: 4,
  tool: { kind: 'mini:card' },
  mini: { kind: 'mini:gap' },
  related: ['global-entry-cost', 'tsa-precheck-cost', 'trusted-traveler-cost-calculator', 'clear-vs-tsa-precheck', 'home'],
  sources: ['tsa-cards', 'chase-csr', 'amex-platinum', 'c1-venture', 'citi-strata-elite', 'bofa-premium', 'cbp-ge-eligibility'],
  en: {
    slug: 'credit-cards-that-pay-for-global-entry', nav: 'Cards that pay for Global Entry', card: 'Statement credits for Global Entry, PreCheck and CLEAR+: the amounts five issuers publish, how often, and what is left to pay.',
    title: 'Credit Cards That Pay for Global Entry: Credits and Limits',
    description: 'Credit cards that pay for Global Entry or TSA PreCheck: up to $120 once every four years on most, $100 on some. What five issuers publish, what is left to pay.',
    h1: 'Credit cards that pay for Global Entry and PreCheck',
    intro: 'Pick a card and a program: the tool shows the credit the issuer publishes and what the fee leaves you to pay.',
    resume: (h) => {
      const P = h.P;
      return `Many travel credit cards refund the application fee of Global Entry or TSA PreCheck as a statement credit. TSA lists ${P.tsaCardListCount} such cards on its own page, from premium travel cards to airline, hotel and credit union cards, and notes that it endorses none of them. The usual form, published by the issuers we read, is a credit of up to ${h.m(120)} once every four years when the fee is charged to the card: enough for the ${h.m(P.globalEntry.fee)} Global Entry fee, and therefore for PreCheck, which costs less. Some cards cap the credit at ${h.m(100)}, which leaves ${h.m(P.globalEntry.fee - 100)} of a Global Entry fee to pay. One issuer gives either ${h.m(120)} for Global Entry or up to ${h.m(85)} for PreCheck. A few premium cards add a separate credit for CLEAR+, counted per calendar year. Since the fee credit covers Global Entry fully on most cards, a cardholder with a passport gains nothing by choosing PreCheck alone: Global Entry includes it.`;
    },
    faqs: (h) => {
      const P = h.P;
      return [
        { q: 'Does the card credit work with any TSA PreCheck provider?', a: 'On the cards TSA lists under credit card offers, yes: TSA says they give a statement credit toward the PreCheck application or renewal fee regardless of enrollment provider, IDEMIA, Telos or CLEAR. The fee must be charged to the eligible card. Some issuers exclude payments made through travel agencies or other intermediaries, so pay the provider or CBP directly.' },
        { q: 'Can I use my card credit to pay for someone else?', a: 'Often yes. The credit usually applies to the first eligible fee charged to the card, whoever the applicant is, so you can pay for a partner or a parent. That uses your credit for the period: if you then need your own renewal within four years, it will not be covered. Some issuers also give credits to authorized users, under their own terms.' },
        { q: 'When does the statement credit appear?', a: 'Issuers say the credit posts after the fee is charged, typically within one or two billing cycles; one issuer we read states two billing cycles. It appears whether or not your application is approved, because the fee was charged. If nothing appears after two statements, call the issuer with the date and amount of the charge.' },
        { q: 'Is it worth getting a card just for the Global Entry credit?', a: `Rarely on its own. The credit is worth at most ${h.m(P.globalEntry.fee)} every four years, about thirty dollars a year, while the cards that offer it carry annual fees from about ${h.m(95)} to several hundred dollars. The credit is a bonus on a card you would hold for other reasons, not a reason to open one.` },
      ];
    },
    body: (h) => {
      const P = h.P;
      const rows = P.cards.map((c) => [h.src(c.source as keyof typeof P.sources, c.name), `up to ${h.m(c.credit)}${c.precheckCredit ? ` (GE) or ${h.m(c.precheckCredit)} (PreCheck)` : ''}`, `every ${c.everyYears} years`, c.covers, c.annualFee ? h.m(c.annualFee) : 'see issuer', c.clearCredit ? `up to ${h.m(c.clearCredit)} a calendar year` : 'none stated']);
      return `<h2>What five issuers publish</h2>
${h.table(['Card', 'Fee credit', 'How often', 'Covers', 'Annual fee', 'CLEAR+ credit'], rows, `Issuers’ own pages, read on ${h.read}. Terms change; the issuer’s page and your card agreement prevail. No link on this site earns a commission.`, ['l', 'l', 'l', 'l', 'r', 'l'])}
<p>These five are examples, not a ranking. TSA's list counts ${P.tsaCardListCount} cards with a PreCheck credit, including cards of credit unions, airlines and hotel chains with lower annual fees. If you already hold a card, check its benefits page before applying: the credit is often there unnoticed.</p>
<h2>What the credit leaves you to pay</h2>
<p>A credit of ${h.m(120)} covers any program fee. A credit of ${h.m(100)} covers PreCheck at any provider and leaves ${h.m(P.globalEntry.fee - 100)} on Global Entry. A PreCheck-only credit of ${h.m(85)} covers the PreCheck fee of every provider, the highest being ${h.m(h.provider('telos').enroll)}. The tool below shows the gap for each card, and the one under the citable summary compares Global Entry with PreCheck when no card pays.</p>
<!--tool:mini:gap-->
<h2>Conditions that trip people up</h2>
<ul>
<li>The fee must be charged to the eligible card, directly to CBP or to the TSA provider; payments through third-party sites may not count, and those sites are not official anyway.</li>
<li>Once every four years means four years after the last credit, not per calendar period.</li>
<li>The credit posts even if the application is denied, but the fee itself is never refunded by CBP or TSA.</li>
<li>Paying for a relative uses your credit for the period.</li>
<li>A CLEAR+ credit is separate and is usually counted per calendar year, with auto-renewal.</li>
</ul>
<h2>Why we name issuers but link to no offer</h2>
<p>The amounts above are facts read on each issuer's public page and dated. This site earns nothing from any card, has no partner and shows no "apply" button. If an issuer changes its terms, the figure here is wrong until we read the page again; tell us through the contact page and we correct it with the new date.</p>
<h2>Cards and the CLEAR+ credit</h2>
<p>Some premium cards add a yearly credit toward CLEAR+, separate from the Global Entry or PreCheck credit. On the issuer pages we read, it is counted per calendar year and applies to the membership charged to the card. CLEAR+ is billed yearly, so the credit can apply each year you keep both the card and the membership, and stops when you close the card. The ${h.a('clear-vs-tsa-precheck', 'CLEAR vs PreCheck page')} weighs whether CLEAR+ is worth having at all.</p>`;
    },
  },
});
