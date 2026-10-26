import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tsa-precheck-processing-time', group: 'apply', order: 5,
  tool: { kind: 'mini:precheck-time' },
  mini: { kind: 'mini:denied' },
  related: ['enrollment-checklist', 'known-traveler-number', 'global-entry-processing-time', 'tsa-precheck-renewal', 'tsa-precheck-cost'],
  sources: ['tsa-faq', 'tsa-precheck', 'tsa-renew', 'tsa-benefits'],
  en: {
    slug: 'tsa-precheck-processing-time', nav: 'PreCheck approval time', card: 'How long TSA says the Known Traveler Number takes after the visit, what slows it, renewals and name changes.',
    title: 'TSA PreCheck Processing Time: KTN in Days, Up to 60 Days',
    description: 'TSA PreCheck processing time: most applicants get their Known Traveler Number three to five days after the visit, some up to 60 days. Renewals and name changes.',
    h1: 'TSA PreCheck processing time: when your number arrives',
    intro: 'Enter the date of your in-person visit: the tool gives the window TSA’s figures point to.',
    resume: (h) => {
      const T = h.P.precheck;
      return `TSA's FAQ gives a clear range for PreCheck. Most applicants receive their Known Traveler Number ${T.ktnDaysTypical.join(' to ')} days after the in-person visit, where fingerprints and a photo are taken and the fee is paid; some take up to ${T.ktnDaysMax} days. The clock starts at that visit, not at the online pre-enrollment, so the real wait also includes the time to find a slot at one of the more than ${h.num(T.totalLocations)} enrollment locations. Renewals follow similar delays, which is why TSA advises renewing at least ${T.renewAdviseDaysBefore} days before expiry; online renewal opens ${T.renewOnlineMonthsBefore} months before. A change of name is slower: TSA says the update can take up to ${T.nameChangeDays} days. Once the number arrives, nothing happens until you add it to your airline reservations: the indicator only shows on boarding passes issued after the KTN is in the booking. The tool above gives your own dates from the day of your visit.`;
    },
    faqs: (h) => {
      const T = h.P.precheck;
      return [
        { q: 'How do I know when my TSA PreCheck is approved?', a: 'The enrollment provider notifies you by email or text, using the contact details you gave, and the KTN appears in your account on its site. You can also use the KTN lookup tool on tsa.gov to check status and find the provider. Use only addresses ending in .gov: other sites asking for your details are not official.' },
        { q: 'Can I fly with PreCheck before my KTN arrives?', a: 'No. The PreCheck lane depends on the indicator printed on the boarding pass, and the airline can only add it once your KTN exists and sits in the reservation. Fly through the standard lane in the meantime. If your flight is soon, add the number as soon as it comes, then reprint or re-download the boarding pass.' },
        { q: 'Why is my TSA PreCheck taking longer than 60 days?', a: `TSA puts the upper end at ${T.ktnDaysMax} days. Beyond that, contact your enrollment provider, which can see whether your file needs a document, and TSA's contact center for status questions. A record that requires correction delays the decision; TSA then explains the reason and the steps in a letter. The fee is not refunded once the visit is done.` },
      ];
    },
    body: (h) => {
      const T = h.P.precheck;
      const rows = [
        ['First enrollment', `${T.ktnDaysTypical.join(' to ')} days after the visit`, `up to ${T.ktnDaysMax} days`],
        ['Renewal', `renew at least ${T.renewAdviseDaysBefore} days before expiry`, `some take up to ${T.ktnDaysMax} days`],
        ['Name change', 'update with your provider', `up to ${T.nameChangeDays} days`],
        ['Suspension under review', `usually under ${T.suspensionDaysTypical} days`, `up to ${T.suspensionDaysMax} days`],
      ];
      return `<h2>TSA's figures, case by case</h2>
${h.table(['Case', 'Usual', 'Longest TSA mentions'], rows, `TSA PreCheck FAQ and renewal page, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>The PreCheck figures are among the fastest of any federal program, because the in-person step happens first: by the time you leave the center, your identity is checked and your fingerprints are in. What is left is a records check, mostly automated.</p>
<h2>What slows a file down</h2>
<ul>
<li>A criminal record, even old or minor, that needs review. Some offenses disqualify for a period, others permanently; TSA explains its decision in writing.</li>
<li>A mismatch between your documents and your application: a middle name present on one and missing on the other, or a name changed by marriage without proof brought to the visit.</li>
<li>An incomplete visit. If you never complete the in-person step, the provider purges your file after ${T.purgeIncompleteDays} days and you start again.</li>
</ul>
<p>If something goes wrong after approval, such as no indicator on the boarding pass, the issue is usually in the reservation, not in TSA's review. The tool below points to the right route for each situation.</p>
<!--tool:mini:denied-->
<h2>Using the number as soon as it comes</h2>
<p>Add the KTN to every reservation already booked, then to your frequent flyer profiles so new bookings carry it. The name on the reservation must match the name you enrolled with, middle name included if you used one, and the date of birth must be right. The ${h.a('known-traveler-number', 'Known Traveler Number page')} decodes the number and lists where to find it again if you lose it.</p>
<h2>PreCheck or Global Entry if time is short</h2>
<p>If you have only weeks before a trip, PreCheck is the safer bet: Global Entry adds a background review in which CBP approves ${h.pc(h.P.globalEntry.approvedShare)} of files within ${h.P.globalEntry.approvedWeeks} weeks but some take a year, and an interview after that. The ${h.a('global-entry-processing-time', 'Global Entry processing time page')} compares.</p>
<h2>Getting status updates</h2>
<p>TSA says applicants can follow their application by email, phone, text or online through the enrollment provider they applied with. If you do not remember which provider you used, TSA's KTN lookup tool finds it. Keep the email address and phone number you gave current with the provider: the same contacts receive the renewal reminders, sent ${h.P.precheck.reminders.join(', ')} before expiry.</p>
<h2>Planning around a trip</h2>
<p>Count backward from your departure. Find a visit slot, add the ${h.P.precheck.ktnDaysTypical.join(' to ')} days TSA gives for most applicants, then the time for your airline to show the indicator, which applies to boarding passes issued after the KTN is in the booking. If your trip is two weeks away, enrolling is still worth it for later trips, but do not count on PreCheck for that one. If it is two months away, you are almost certainly fine, since TSA's upper bound is ${h.P.precheck.ktnDaysMax} days. In both cases, travel through the standard lane until the number arrives; showing an approval email at the checkpoint does not open the PreCheck lane, as TSA's FAQ states.</p>`;
    },
  },
});
