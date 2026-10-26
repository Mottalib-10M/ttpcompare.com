import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'global-entry-processing-time', group: 'apply', order: 4,
  tool: { kind: 'mini:ge-time' },
  mini: { kind: 'mini:eoa' },
  related: ['enrollment-on-arrival', 'global-entry-interview', 'tsa-precheck-processing-time', 'global-entry-renewal', 'global-entry-denied'],
  sources: ['cbp-ge-apply', 'cbp-ge-faq', 'cbp-eoa', 'cbp-ge-card', 'ttp'],
  en: {
    slug: 'global-entry-processing-time', nav: 'Global Entry processing time', card: 'What CBP publishes on review times, the dates it gives for your own application, and what you can and cannot do to speed it up.',
    title: 'Global Entry Processing Time: CBP Figures and Your Own Dates',
    description: 'Global Entry processing time from CBP: most applications approved within two weeks, some take twelve months or more. Your dates, the interview and the card.',
    h1: 'Global Entry processing time: what CBP says, and your dates',
    intro: 'Enter the date you submitted the application: the tool turns CBP’s published figures into dates for you.',
    resume: (h) => {
      const G = h.P.globalEntry;
      return `CBP publishes one figure on Global Entry review times, and it has two halves. About ${h.pc(G.approvedShare)} of applications are conditionally approved within ${G.approvedWeeks} weeks of submission; the rest can take ${G.maxMonths} months or longer. CBP gives no average and no breakdown by airport or by profile, and no official source says which applications fall in the slow group, so this site does not guess. Conditional approval is not the end: it opens the interview, which you schedule at an enrollment center or complete through Enrollment on Arrival when you return from abroad, and the final decision follows on a timeline CBP says can vary. Once approved, the card arrives by mail in ${G.cardWeeks.join(' to ')} weeks and must be activated within ${G.cardActivateDays} days, but you can use the airport kiosks with your passport before it comes. The tool above turns those figures into calendar dates from the day you applied. Nothing on this site, and no paid service, can make CBP review a file faster.`;
    },
    faqs: (h) => {
      const G = h.P.globalEntry;
      return [
        { q: 'Why is my Global Entry application still pending after months?', a: `CBP does not explain individual delays. Its own figure says ${h.pc(G.approvedShare)} of applications are approved within ${G.approvedWeeks} weeks and that some take ${G.maxMonths} months or longer. A record that needs checking with another agency or country can slow a file. Keep your passport details current in the TTP account and watch your email; there is no official way to expedite.` },
        { q: 'Can I pay to speed up Global Entry?', a: 'No. CBP has no expedited service, and its fee covers the whole process. Websites that sell faster processing or a reserved interview slot are private businesses with no access to the CBP review. The only real time saver is in your hands after conditional approval: Enrollment on Arrival lets you skip the wait for a center appointment.' },
        { q: 'Does my membership start when the card arrives?', a: `No. It starts when CBP approves you after the interview, and your PASS ID then works as Known Traveler Number for PreCheck straight away. The card, which comes in ${G.cardWeeks.join(' to ')} weeks, is needed for land and sea crossings, not for the airport kiosks. Activate it in your TTP account within ${G.cardActivateDays} days of receiving it.` },
      ];
    },
    body: (h) => {
      const G = h.P.globalEntry;
      const rows = [
        ['Background review', `${h.pc(G.approvedShare)} within ${G.approvedWeeks} weeks`, `some ${G.maxMonths} months or longer`],
        ['Interview', 'as soon as you find a slot or land at an EoA airport', 'depends on you and on slots'],
        ['Final decision', 'CBP gives no figure', 'email and TTP account'],
        ['Card by mail', `${G.cardWeeks.join(' to ')} weeks`, `activate within ${G.cardActivateDays} days`],
      ];
      return `<h2>The four stages and what CBP publishes on each</h2>
${h.table(['Stage', 'CBP figure', 'Notes'], rows, `CBP Global Entry how to apply page, FAQ and card page, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>Only the first and last stages have an official figure. Anything you read elsewhere about average weeks per airport or per month comes from travelers' own reports, which this site does not reproduce: such samples lean toward the applications that took long, because those are the ones people write about.</p>
<h2>The interview is the stage you control</h2>
<p>Once conditionally approved, your wait depends on how soon you can be interviewed. Appointment slots at busy centers may be weeks away, but ${h.a('enrollment-on-arrival', 'Enrollment on Arrival')} needs none: any return from abroad through a listed airport will do. Pick your arrival state or country below to see the airports CBP names there.</p>
<!--tool:mini:eoa-->
<p>Some centers also accept walk-ins from conditionally approved applicants. CBP suggests checking whether the domestic airport you pass through has an enrollment center that can take you immediately.</p>
<h2>If you need the lane sooner</h2>
<p>If a trip is coming and the review drags, TSA PreCheck alone can be faster: TSA says most numbers come within days of the visit. That costs a second fee and does not speed up customs on return. The ${h.a('tsa-precheck-processing-time', 'PreCheck processing time page')} gives TSA's figures. If you hold a renewal application, the clock matters less: when filed before expiry, CBP keeps your benefits for up to ${G.graceMonths} months while it is pending, as the ${h.a('global-entry-renewal', 'renewal page')} explains.</p>
<h2>When the answer is no</h2>
<p>A denial comes in writing with the reason. You can ask the CBP Ombudsman for reconsideration through your TTP account, with documents that clarify the record; the ${h.a('global-entry-denied', 'denials page')} sets out the route. The fee is not refunded, whatever the outcome.</p>
<h2>Keeping the file moving</h2>
<p>Three things are in your hands while CBP reviews. Answer every question on the application fully: CBP lists false or incomplete information among the grounds for denial. Keep your passport details current in the TTP account, under Update Documents, since a renewed passport mid-review must be on file. And read your email: CBP announces each change of status there, including the conditional approval that opens the interview. Beyond that, CBP gives no channel to ask for a faster review.</p>
<p>Applicants from partner countries face an extra step: their own government vets them before or alongside CBP, under each arrangement's rules, so the published CBP figure may not describe their wait. The ${h.a('global-entry-for-non-us-citizens', 'page for non-US citizens')} lists the partner countries.</p>
<p>If your address changes during the review, update it in the TTP account: CBP mails the card to the address on file.</p>`;
    },
  },
});
