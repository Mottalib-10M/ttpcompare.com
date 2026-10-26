import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'military-tsa-precheck', group: 'travel', order: 3,
  tool: { kind: 'mini:military' },
  mini: { kind: 'mini:card' },
  related: ['tsa-precheck-cost', 'known-traveler-number', 'clear-vs-tsa-precheck', 'tsa-precheck-for-kids', 'home'],
  sources: ['tsa-military', 'tsa-faq', 'tsa-benefits', 'clear-plus', 'cbp-ge-eligibility'],
  en: {
    slug: 'military-tsa-precheck', nav: 'Military TSA PreCheck', card: 'Free with a DoD ID for service members, the spouse discount, survivor families, disabled veterans, and what retirees pay.',
    title: 'Military TSA PreCheck: Free With a DoD ID, Spouses, Veterans',
    description: 'Military TSA PreCheck: free for service members with a DoD ID number, $25 off for spouses, free for survivor families and some disabled veterans. Retirees pay.',
    h1: 'Military TSA PreCheck: who gets it free, who pays less',
    intro: 'Pick your situation: the tool gives what five years of PreCheck cost you and how to use the benefit.',
    resume: (h) => {
      const M = h.P.military;
      return `Members of the US armed forces get TSA PreCheck at no cost and without enrolling: TSA says they enter their DoD ID number in the Known Traveler Number field of each reservation. That covers active duty, the Coast Guard, the Reserve and the National Guard, and cadets and midshipmen of the service academies; DoD civilian employees qualify too, after opting in. The benefit is tied to the DoD affiliation and stops when it ends, so retirees and other veterans enroll like everyone else, unless a VA-certified disability qualifies them under the VETS Safe Travel Act, which makes enrollment and renewal free for eligible severely disabled veterans through CLEAR or IDEMIA. Military spouses get ${h.m(M.spouseDiscount)} off the enrollment or renewal fee. Survivor families enroll and renew free with a TAPS letter. Adult dependents who are not DoD-affiliated do not get PreCheck through the service member. TSA also offers front-of-line service for service members, veterans and their families at more than ${M.frontOfLineAirports} airports. The tool above sorts your case.`;
    },
    faqs: (h) => {
      const M = h.P.military;
      return [
        { q: 'Do military retirees get free TSA PreCheck?', a: 'No, not through the DoD ID. The free benefit is for current members and DoD civilians, and ends when you leave. Retirees and veterans enroll with a provider like any traveler, unless they qualify under the VETS Safe Travel Act through a VA-certified severe disability. Many retirees use a card fee credit, which usually covers the whole fee.' },
        { q: 'How does a military spouse get the TSA PreCheck discount?', a: `TSA lists a ${h.m(M.spouseDiscount)} discount on the enrollment or renewal fee for spouses of service members, applied through the enrollment provider. The spouse still enrolls, visits a center and gets a KTN of their own. Children 17 and under can follow either parent into the PreCheck lane under TSA’s family rules, without a membership.` },
        { q: 'Does my DoD ID number work for Global Entry?', a: 'No. The DoD ID gives TSA PreCheck at departure only. For customs on return from abroad, a service member applies for Global Entry like any US citizen and pays the CBP fee, though many travel cards refund it. A Global Entry PASS ID then gives PreCheck too, so you can use either number in reservations.' },
        { q: 'Is there a military rate for CLEAR+?', a: `Yes. CLEAR’s price page lists ${h.m(h.P.clear.militaryAnnual)} a year for military members, against ${h.m(h.P.clear.annual)} for everyone else. CLEAR+ is a private service, separate from TSA PreCheck: it speeds up the identity check at its lanes, not the screening itself. A service member who already has PreCheck free should weigh whether the ID step is worth that yearly price.` },
      ];
    },
    body: (h) => {
      const M = h.P.military, pre = h.cheapestEnroll();
      const rows = [
        ['Active duty, Reserve, National Guard, Coast Guard, academy cadets', '$0', 'DoD ID number as KTN'],
        ['DoD civilian employees', '$0', 'opt in, then DoD ID as KTN'],
        ['Military spouses', `from ${h.m(pre.enroll - M.spouseDiscount)}`, `${h.m(M.spouseDiscount)} off with a provider`],
        ['Survivor families', '$0', 'TAPS letter or TSA form'],
        ['Veterans with qualifying disabilities', '$0', 'VETS Safe Travel Act, CLEAR or IDEMIA'],
        ['Retirees and other veterans', `from ${h.m(pre.enroll)}`, 'regular enrollment'],
        ['Adult dependents, not DoD-affiliated', `from ${h.m(pre.enroll)}`, 'regular enrollment'],
      ];
      return `<h2>Every military case at a glance</h2>
${h.table(['Who', 'Five years of PreCheck', 'How'], rows, `TSA uniformed service members, spouse, survivor family and VETS Safe Travel Act pages, read on ${h.read}.`, ['l', 'r', 'l'])}
<h2>Using the DoD ID number</h2>
<p>Enter the DoD ID number, as printed on your common access card, in the Known Traveler Number field of each reservation, and add it to your frequent flyer profiles. The name and date of birth must match your DoD records. Each family member who is not a service member needs a separate route, shown in the table above. If the indicator does not appear, check the number and name first; the ${h.a('known-traveler-number', 'Known Traveler Number page')} lists the usual causes.</p>
<h2>Front-of-line service at airports</h2>
<p>Separately from PreCheck, TSA lists more than ${M.frontOfLineAirports} airports where service members, veterans and their immediate family traveling with them can go to the front of the line, from Albany to Will Rogers in Oklahoma City. Some airports limit it to active duty or to members in uniform. Through TSA Cares, injured service members, veterans and wounded warriors may request assistance at security screening.</p>
<h2>Paying less for the rest</h2>
<p>A spouse, an adult dependent or a retiree can often get the fee back through a card credit. The tool below shows what each of five cards leaves to pay.</p>
<!--tool:mini:card-->
<p>For a household that travels abroad, Global Entry may be the better buy for the members who pay: it includes PreCheck and speeds up customs, and children under 18 apply free with a member parent. The ${h.a('home', 'chooser on the home page')} weighs it for your trips.</p>
<h2>Survivor families and disabled veterans</h2>
<p>Families of fallen service members enroll and renew free with a verification letter from the Tragedy Assistance Program for Survivors, or a TSA acknowledgment form, through one of the providers; each provider runs its own process. Under the VETS Safe Travel Act, veterans enrolled in VA health care who have a VA-issued wheelchair or prosthetic, or permanent blindness, enroll and renew free through CLEAR or IDEMIA, with the fee waiver letter in their VA.gov account. Both groups receive an ordinary TSA PreCheck membership and KTN, valid five years.</p>
<h2>Leaving the service</h2>
<p>The DoD ID stops giving PreCheck when the affiliation ends. Plan the change before your last day: enroll with a provider a few weeks ahead, or apply for Global Entry if you travel abroad, so that a new KTN is ready when the DoD ID stops working. Update the Known Traveler Number field in every frequent flyer profile once you have it; an old DoD ID left in a profile will simply stop producing the indicator.</p>`;
    },
  },
});
