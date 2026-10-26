import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tsa-precheck-renewal', group: 'renew', order: 1,
  tool: { kind: 'renewal', props: { program: 'precheck' } },
  mini: { kind: 'mini:scam' },
  related: ['tsa-precheck-cost', 'known-traveler-number', 'global-entry-renewal', 'tsa-precheck-processing-time', 'credit-cards-that-pay-for-global-entry'],
  sources: ['tsa-renew', 'tsa-faq', 'tsa-precheck', 'ftc-fraud', 'tsa-cards'],
  en: {
    slug: 'tsa-precheck-renewal', nav: 'TSA PreCheck renewal', card: 'When the online renewal opens, the price by provider and channel, the reminder file for your calendar, and the fake renewal sites.',
    title: 'TSA PreCheck Renewal: Dates, Price by Provider, Fake Sites',
    description: 'TSA PreCheck renewal opens online six months before expiry, from $58.75 by provider. Your dates in a calendar file, the same KTN, and how to avoid fake sites.',
    h1: 'TSA PreCheck renewal: when, how much, and where safely',
    intro: 'Enter your expiration date: the planner gives the renewal dates and a calendar file made in your browser.',
    resume: (h) => {
      const T = h.P.precheck, ren = h.cheapestRenewal(), max = Math.max(...h.PROVIDERS.flatMap((p) => [p.renewOnline, p.renewInPerson]));
      return `TSA PreCheck renews online from ${T.renewOnlineMonthsBefore} months before the expiration date, and the new five years start when the current ones end, so renewing early costs nothing. TSA recommends finishing at least ${T.renewAdviseDaysBefore} days before expiry, because some renewals take up to ${T.ktnDaysMax} days, and you must renew before expiry to keep the indicator on your boarding pass. The price depends on the provider and the channel, from ${h.m(ren.amount)} to ${h.m(max)}: IDEMIA is cheapest online, Telos in person. You can renew with any of the three providers, whichever one you enrolled with, and your Known Traveler Number stays the same. Providers send reminders ${T.reminders.join(', ')} before expiry to the email or phone number on file. In person is needed mainly after a name change, unless you update the name with the provider first, which can take up to ${T.nameChangeDays} days. Only sites ending in .gov are official; TSA does not refund fees paid to fake renewal sites.`;
    },
    faqs: (h) => {
      const T = h.P.precheck;
      return [
        { q: 'Does renewing TSA PreCheck early waste the remaining time?', a: `No. TSA’s FAQ says the new membership period begins as the current one ends, so there is no disadvantage to renewing early. The online renewal opens ${T.renewOnlineMonthsBefore} months before expiry. Renewing then also leaves room for the rare file that takes up to ${T.ktnDaysMax} days, which is why TSA recommends at least ${T.renewAdviseDaysBefore} days of margin.` },
        { q: 'I paid a renewal site that did not end in .gov. What now?', a: 'TSA says it will not reimburse fees paid to a fraudulent website. Report it to your local police and at ReportFraud.ftc.gov, and call your card issuer to dispute the charge. Then check your status with the KTN lookup tool on tsa.gov: if your membership was not renewed, renew through one of the three official provider sites.' },
        { q: 'Can I renew TSA PreCheck with a card credit?', a: `Yes. The cards on TSA’s list give a statement credit toward the application or renewal fee with any provider, usually up to ${h.m(120)} once every four years, which covers every renewal price. The fee must be charged to the card. If you used the credit at enrollment less than four years ago, check the issuer’s terms before counting on it.` },
        { q: 'Will my Known Traveler Number change when I renew?', a: 'No. TSA’s FAQ says members keep the same KTN during renewal, and that the number stays the same even if you switch to another enrollment provider. You do not need to update your airline profiles. Check them anyway after renewing: the name and date of birth there must still match your membership.' },
      ];
    },
    body: (h) => {
      const rows = h.PROVIDERS.map((p) => [p.name, h.m(p.renewOnline), h.m(p.renewInPerson), p.site]);
      return `<h2>Renewal prices by provider</h2>
${h.table(['Provider', 'Online', 'In person', 'Official site'], rows, `TSA PreCheck renewal page, read on ${h.read}.`, ['l', 'r', 'r', 'l'])}
<p>The three prices differ by up to fourteen dollars for the same five years. TSA's page also notes an offer from CLEAR: after an online renewal through CLEAR, a one-time code lowers the first year of CLEAR+ to ${h.m(h.P.precheck.clearPlusCodeRenew)}. That only matters if you want CLEAR+ anyway; the ${h.a('clear-vs-tsa-precheck', 'CLEAR vs PreCheck page')} weighs it.</p>
<h2>Fake renewal sites</h2>
<p>Search results and ads regularly show sites that look official and charge a renewal "service fee" on top of, or instead of, the real price. TSA's rule is simple: a site to register for PreCheck that does not end in .gov is not an official site. The three official addresses are in the table above. The tool below checks an address and a price against them.</p>
<!--tool:mini:scam-->
<h2>Renewing step by step</h2>
<ol>
<li>Find your expiration date and KTN: in the provider's reminder email, in your account on its site, or with TSA's KTN lookup tool.</li>
<li>Pick the provider and channel. Online takes minutes; in person needs a visit to a center.</li>
<li>If your name changed, update it with the provider first, or renew in person with the document that proves the change.</li>
<li>Pay with the card that carries a fee credit, if you have one.</li>
<li>Wait for the confirmation, then check that the indicator still appears on your next boarding pass.</li>
</ol>
<h2>Calendar reminders</h2>
<p>The planner at the top builds a calendar file with three dates: the day online renewal opens, the date ${h.P.precheck.renewAdviseDaysBefore} days before expiry that TSA recommends as a deadline, and the expiration date itself, each with an alert a week before. The file is generated in your browser; nothing is sent. If you hold Global Entry rather than PreCheck, the rules are different: see the ${h.a('global-entry-renewal', 'Global Entry renewal page')}.</p>
<h2>Renew PreCheck, or move to Global Entry?</h2>
<p>Renewal time is the natural moment to ask whether PreCheck alone still fits. If you now fly abroad once a year or more and hold a passport, Global Entry costs ${h.m(h.P.globalEntry.fee)} for five years against ${h.m(h.cheapestRenewal().amount)} for the cheapest PreCheck renewal, and it includes PreCheck. TSA sets one condition worth knowing: a PreCheck member who applies for Global Entry gives the PreCheck KTN on the application and must complete the Global Entry process before the PreCheck membership expires, or loses PreCheck screening until Global Entry is approved. Since CBP approves ${h.pc(h.P.globalEntry.approvedShare)} of applications within ${h.P.globalEntry.approvedWeeks} weeks but some take a year or longer, start early, or renew PreCheck anyway for the security of the lane. The ${h.a('tsa-precheck-vs-global-entry', 'PreCheck vs Global Entry page')} works out the difference for your own trips.</p>
<h2>Each adult renews separately</h2>
<p>A membership belongs to one person, so a couple renews twice, each with their own expiration date, which may be months apart if you enrolled on different days. Children 17 and under still need no membership to follow you through the lane. If both adults have a card with a fee credit, each charge goes on the card of the person renewing; a single credit usually covers only one fee in four years. The planner above handles one date at a time: run it for each adult and keep both calendar files.</p>
<h2>What does not change at renewal</h2>
<p>Your Known Traveler Number stays the same, whichever provider you choose, so airline profiles keep working. The background check runs again: TSA reviews records as it does for a first application, and the same violations of security rules that disqualify a new applicant can stop a renewal. If you were disqualified for a period, wait for it to end before paying, since the fee is not refunded once the process is complete.</p>`;
    },
  },
});
