import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'global-entry-renewal', group: 'renew', order: 2,
  tool: { kind: 'renewal', props: { program: 'globalEntry' } },
  mini: { kind: 'mini:remote' },
  related: ['global-entry-interview', 'global-entry-cost', 'tsa-precheck-renewal', 'known-traveler-number', 'global-entry-processing-time'],
  sources: ['cbp-ge-faq', 'cbp-remote', 'cbp-ge-eligibility', 'cbp-ge-card', 'ttp'],
  en: {
    slug: 'global-entry-renewal', nav: 'Global Entry renewal', card: 'The one-year window, the 24 months of benefits while CBP reviews, the remote interview, the fee and a calendar file.',
    title: 'Global Entry Renewal: One Year Early, 24 Months of Benefits',
    description: 'Global Entry renewal opens one year before expiry for $120. File in time to keep benefits up to 24 months while CBP reviews. Dates, calendar file, video call.',
    h1: 'Global Entry renewal: the window, the grace period, the interview',
    intro: 'Enter the expiration date shown in your TTP account: the planner gives your window and a calendar file built in your browser.',
    resume: (h) => {
      const G = h.P.globalEntry;
      return `Global Entry can be renewed from ${G.renewMonthsBefore} months before the membership expires, on ttp.dhs.gov, for the same ${h.m(G.fee)} as a first application, paid online and not refundable. The rule that matters most is the deadline: if you submit the renewal before your membership expires, CBP lets you keep using the benefits for up to ${G.graceMonths} months after the expiration date while it reviews the file. Miss that date and you start again as a new applicant, with no benefits until approval. After you pay, CBP may not ask for an interview at all; its FAQ says an interview for renewal may not be necessary, and your TTP account shows what is needed. When one is required, some members can do it by video, in about ${G.remoteMinutes} minutes, under a pilot for adults with a recent CBP photo on file. Your PASS ID, and therefore your Known Traveler Number for PreCheck, stays the same. The planner above puts the opening date and the deadline in your calendar.`;
    },
    faqs: (h) => {
      const G = h.P.globalEntry;
      return [
        { q: 'What happens if my Global Entry expired before I renewed?', a: `You lose the ${G.graceMonths}-month extension, which only applies to renewals submitted before expiry. You then apply as a new applicant on ttp.dhs.gov, pay ${h.m(G.fee)} and go through the review and an interview again, without Global Entry or PreCheck through it until approval. If your card shows a date in the past, check the account: the membership date is the one that counts.` },
        { q: 'Do I need my Global Entry card while the renewal is pending?', a: `Not at airports. CBP says Global Entry kiosks require a passport or a green card and do not accept the card. The card matters only at land and sea ports, where its chip opens the SENTRI lanes and the NEXUS lanes into the United States; it is not valid for entering Canada through NEXUS lanes. A lost or damaged card is replaced in your TTP account for ${h.m(G.cardReplace)}.` },
        { q: 'Can I renew Global Entry if my passport changed?', a: 'Yes. CBP lets every member update passport details in the TTP account under Update Documents, which you should do before renewing, since the kiosks read your passport. If the update involves a change of name, CBP says you must visit a Global Entry enrollment center. The name in your membership must also match your airline reservations for PreCheck.' },
      ];
    },
    body: (h) => {
      const G = h.P.globalEntry;
      const rows = [
        ['Renewal opens', `${G.renewMonthsBefore} months before expiry`],
        ['Fee', `${h.m(G.fee)}, non-refundable`],
        ['If filed before expiry', `benefits continue up to ${G.graceMonths} months after it`],
        ['If filed after expiry', 'new application, no benefits until approval'],
        ['Interview', 'may not be needed; video possible for some'],
        ['PASS ID', 'unchanged'],
      ];
      return `<h2>The renewal rules on one screen</h2>
${h.table(['Rule', 'What CBP says'], rows, `CBP Global Entry FAQ and remote interview pilot page, read on ${h.read}.`, ['l', 'l'])}
<h2>Renewing step by step</h2>
<ol>
<li>Log in to ttp.dhs.gov with your login.gov account.</li>
<li>On the dashboard, select Renew in the program section, declare your citizenship and choose the program; you can switch to another program you qualify for, such as NEXUS.</li>
<li>Update your passport, address, employment and travel history, then certify the application.</li>
<li>Pay the fee with the card that carries a fee credit, if you have one.</li>
<li>Check the account for the next step: approval without interview, an interview, or a remote interview invitation.</li>
</ol>
<h2>Remote interview: are you eligible?</h2>
<p>CBP's remote interview pilot covers renewals that are conditionally approved, for members ${G.remoteMinAge} or older whose photo on file is under ${G.remotePhotoYears} years old and was taken after age 14, with fingerprints on file. The interview runs on Zoom; test the device beforehand and keep your passport, proof of address and green card at hand. Check the criteria below.</p>
<!--tool:mini:remote-->
<p>If the pilot does not apply, you can do the interview at an enrollment center or through ${h.a('enrollment-on-arrival', 'Enrollment on Arrival')} on a return from abroad, as for a first application.</p>
<h2>Costs over the next term</h2>
<p>The renewal fee is the same as the first one. Card fee credits, usually up to ${h.m(120)} once every four years, cover it in full when four years have passed since the last credit. Children under 18 renewing alongside a member parent pay nothing. The ${h.a('global-entry-cost', 'Global Entry cost page')} lists every fee CBP can charge, and the ${h.a('trusted-traveler-cost-calculator', 'calculator')} spreads them over ten years.</p>
<h2>Switching program at renewal</h2>
<p>The renewal screen lets you choose another program you qualify for. A member who now crosses into Canada often can renew into NEXUS, which costs the same ${h.m(h.P.nexus.fee)} and includes Global Entry benefits at airports, but needs an interview with both CBP and the Canada Border Services Agency. A member who drives across the Mexican border can look at SENTRI, also ${h.m(h.P.sentri.fee)}. CBP's FAQ warns that your benefits may change with the program you choose, so check what you lose before switching. The ${h.a('nexus-vs-global-entry', 'NEXUS vs Global Entry page')} compares the two in detail.</p>
<h2>What the 24 months mean in practice</h2>
<p>If you submit the renewal one day before expiry, your kiosks and your PreCheck indicator keep working while CBP reviews the file, for up to ${h.P.globalEntry.graceMonths} months after the expiration date. That window exists because some reviews are long: CBP says ${h.pc(h.P.globalEntry.approvedShare)} of applications are approved within ${h.P.globalEntry.approvedWeeks} weeks and some take ${h.P.globalEntry.maxMonths} months or longer. The extension does not apply if you file after expiry, so the date to put in your calendar is the expiration date itself, not the end of the 24 months.</p>
<h2>Children and family members</h2>
<p>Each member renews separately, children included. A minor renewing while a parent is a member, or has an application pending or conditionally approved, pays no fee: CBP's exemption covers applicants under 18. A child who has turned 18 during the membership renews as an adult and pays the full fee; if a remote interview is offered, the age and photo rules above apply to each person.</p>`;
    },
  },
});
