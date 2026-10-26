import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tsa-precheck-for-kids', group: 'travel', order: 2,
  tool: { kind: 'mini:kids' },
  mini: { kind: 'mini:family' },
  related: ['global-entry-cost', 'known-traveler-number', 'clear-vs-tsa-precheck', 'tsa-precheck-cost', 'enrollment-checklist'],
  sources: ['tsa-families', 'tsa-faq', 'cbp-ge-eligibility', 'cbp-ge-faq', 'clear-plus'],
  en: {
    slug: 'tsa-precheck-for-kids', nav: 'PreCheck for kids and families', card: 'The three age rules for children in the PreCheck lane, the booking trick for teenagers, and what Global Entry and CLEAR+ charge for kids.',
    title: 'TSA PreCheck for Kids: Age Rules, Teens and Family Costs',
    description: 'TSA PreCheck for kids: 12 and under go with you, 13 to 17 need the indicator through the same booking, 18 and over need their own. Plus Global Entry and CLEAR+.',
    h1: 'TSA PreCheck for kids: who needs a membership, who does not',
    intro: 'Enter your child’s age and how you booked: the tool applies TSA’s family rule.',
    resume: (h) => {
      const K = h.P.kids;
      return `Children rarely need a PreCheck membership of their own. TSA's family page sets three age bands. Children ${K.noIndicatorMaxAge} and under go through the PreCheck lane with a parent or guardian whose boarding pass shows the indicator; their own boarding pass needs nothing. Children ${K.indicatorMinAge} to ${K.indicatorMaxAge} may use the lane only when the indicator also appears on their boarding pass, which happens when they are on the same airline reservation as the PreCheck adult and their Known Traveler Number field is left blank; on a separate reservation without a KTN, they do not get it. From ${K.ownKtnAge}, a traveler needs a membership of their own. TSA adds that a child who routinely flies alone should enroll. For customs on the way back from abroad, the picture changes: Global Entry has no fee for applicants under 18 when a parent is a member or applies at the same time, but each child must apply and be interviewed with a parent present. CLEAR+ lets children ${h.P.clear.kidsMaxAge} and under through with a member at no charge.`;
    },
    faqs: (h) => {
      const K = h.P.kids;
      return [
        { q: 'Why did my teenager not get TSA PreCheck on the boarding pass?', a: `For ages ${K.indicatorMinAge} to ${K.indicatorMaxAge}, TSA requires the child to be on the same airline reservation as the adult whose pass shows the indicator, with the child’s KTN field left blank. A separate booking, a typo in the adult’s KTN, or an airline that does not carry the indicator over will leave the teenager out. Book together next time, or enroll the teen.` },
        { q: 'Should my child get Global Entry?', a: `If your family travels abroad and the parents have or are getting Global Entry, yes: the application costs nothing for a child under 18 when a parent is a member or has an application pending or conditionally approved. The child gets their own PASS ID, which also gives PreCheck when flying alone. Each child needs a passport, a parent’s consent and an interview with the parent present.` },
        { q: 'Do unaccompanied minors get TSA PreCheck?', a: 'Only with their own membership and indicator. TSA says children who travel alone routinely should enroll in PreCheck or another trusted traveler program, and that unaccompanied minors in the PreCheck lane must show an acceptable ID; airlines set their own ID rules for travelers under 18. A gate pass for an escorting adult does not carry PreCheck.' },
      ];
    },
    body: (h) => {
      const K = h.P.kids, G = h.P.globalEntry, C = h.P.clear;
      const rows = [
        [`${K.noIndicatorMaxAge} and under`, 'with a PreCheck parent or guardian', 'no', 'no'],
        [`${K.indicatorMinAge} to ${K.indicatorMaxAge}`, 'only if the indicator shows on their pass', 'yes, via the same reservation', 'no, leave the KTN blank'],
        [`${K.ownKtnAge} and over`, 'only with their own membership', 'yes', 'yes'],
      ];
      return `<h2>The three age rules</h2>
${h.table(['Age', 'PreCheck lane', 'Indicator on the child’s pass needed', 'Own KTN needed'], rows, `TSA PreCheck for Families page, read on ${h.read}.`, ['l', 'l', 'l', 'l'])}
<p>The rule turns on the age at the time of travel. A child who turns ${K.indicatorMinAge} between two trips moves to the second band, and booking on the same reservation starts to matter.</p>
<h2>What a family pays, program by program</h2>
<ul>
<li>TSA PreCheck: the adults pay, children ${K.indicatorMaxAge} and under ride along under the rules above.</li>
<li>Global Entry: ${h.m(G.fee)} per adult; ${h.m(0)} for each child under 18 with a member parent, but every child applies and is interviewed.</li>
<li>CLEAR+: ${h.m(C.annual)} a year for the first adult, ${h.m(C.familyAdd)} for each added adult up to ${C.familyMaxAdults}; children ${C.kidsMaxAge} and under free with a member.</li>
</ul>
<p>Set your household below to see five years for each program.</p>
<!--tool:mini:family-->
<h2>Booking tips that keep the family together</h2>
<p>Book everyone on one reservation. Enter each adult's KTN in their own profile and leave blank the field of any child who has no membership: TSA asks you not to enter one for a child without their own KTN. Check the boarding passes before leaving home; if a teenager's pass lacks the indicator, the whole family can still go through the standard lane together. If one parent has PreCheck and the other does not, children may follow the one who does.</p>
<h2>When a child should enroll</h2>
<p>Enrolling makes sense for a teenager who flies alone, for example to visit a parent or for school, and for any child in a family that travels abroad, where Global Entry is free for minors with a member parent and includes PreCheck. For a child who always flies with you on domestic trips, a membership adds nothing. The ${h.a('global-entry-cost', 'Global Entry cost page')} gives the detail of the minor exemption.</p>
<h2>Two common family situations</h2>
<p>A family of four with children aged 9 and 15, both parents with PreCheck, books one reservation. The nine-year-old follows a parent through the lane whatever the boarding pass says. The fifteen-year-old needs the indicator on their own pass; on the same reservation, with the KTN field left blank, the airline can add it. If the teenager's pass shows no indicator at the airport, that child goes through standard screening, and the family may prefer to stay together in that lane.</p>
<p>A divorced parent sends a fourteen-year-old to fly alone to the other parent each school holiday. Here no family rule applies: the child is on a separate reservation and travels without an adult, so PreCheck needs a membership of their own. TSA's advice for children who travel alone routinely is to enroll in PreCheck or another trusted traveler program; Global Entry is free for a minor whose parent is a member, which makes it the cheaper route when a parent already holds it.</p>`;
    },
  },
});
