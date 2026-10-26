import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'global-entry-denied', group: 'apply', order: 6,
  tool: { kind: 'mini:denied' },
  mini: { kind: 'mini:ge-time' },
  related: ['global-entry-processing-time', 'global-entry-interview', 'known-traveler-number', 'tsa-precheck-processing-time', 'home'],
  sources: ['cbp-denials', 'cbp-ge-faq', 'dhs-trip', 'tsa-redress', 'tsa-faq'],
  en: {
    slug: 'global-entry-denied', nav: 'Denied or revoked', card: 'Why CBP or TSA says no, how to ask for reconsideration, what DHS TRIP is for and what the Redress number does.',
    title: 'Global Entry Denied: Reconsideration, DHS TRIP and Redress',
    description: 'Global Entry denied or revoked: the grounds CBP lists, how to ask the Ombudsman to reconsider, when DHS TRIP and a Redress Control Number help, PreCheck too.',
    h1: 'Denied or revoked: the official routes, and which one is yours',
    intro: 'Pick what happened to you: the tool gives the free official route and what to send.',
    resume: () => `A denial is not the end of the road, but each case has its own route, and none of them is paid. When CBP denies or revokes Global Entry, NEXUS or SENTRI, it sends the reason in writing. If you believe the decision rests on inaccurate or incomplete information, you request reconsideration through your Trusted Traveler Programs account; the request goes to the CBP Ombudsman, in English, with the date and reasons of the denial, a summary that clarifies the record, and court documents in PDF for any arrest or conviction, even expunged. A TSA PreCheck denial follows TSA's letter, which explains the reason and how to correct a record. DHS TRIP is something else: the single point of contact for travelers who are denied or delayed at boarding, repeatedly sent to secondary screening, or delayed at the border. It gives a seven-digit Redress Control Number to add to future bookings. It does not reverse a program denial. The tool above sends you to the right one.`,
    faqs: () => [
      { q: 'What are the common reasons for a Global Entry denial?', a: 'CBP lists them in its FAQ: false or incomplete information on the application, any criminal conviction or pending charge, a violation of customs, immigration or agriculture rules in any country, an ongoing investigation, a denied firearm purchase, a criminal pardon, inadmissibility under immigration rules, or failing to satisfy CBP of low risk. A customs penalty, for instance for an undeclared item, counts as such a violation.' },
      { q: 'Can I reapply for Global Entry after a denial?', a: 'Nothing in CBP’s pages forbids a new application, but it is a new fee and the same review. If the ground for denial has not changed, the answer will likely be the same. Ask for reconsideration first when you think the record is wrong; reapply when the situation itself has changed, for example once a pending charge has been dismissed.' },
      { q: 'Will DHS TRIP get my Global Entry approved?', a: 'No. DHS TRIP handles travel screening problems: denied or delayed boarding, repeated secondary screening, delays entering or leaving the country. Its Redress Control Number goes into future airline reservations. A Global Entry denial goes to the CBP Ombudsman through your TTP account instead. The two can run in parallel if both apply.' },
      { q: 'Does a revoked Global Entry also remove TSA PreCheck?', a: 'Yes, in practice. Global Entry members get PreCheck through their PASS ID; once the membership is revoked, that number no longer carries the indicator. To keep the PreCheck lane, you would need a separate TSA PreCheck membership, which TSA reviews under its own rules. A CBP revocation can be contested by the same reconsideration route as a denial.' },
    ],
    body: (h) => {
      const T = h.P.precheck;
      const rows = [
        ['Global Entry, NEXUS or SENTRI denied or revoked', 'reconsideration request in your TTP account', 'CBP Ombudsman'],
        ['TSA PreCheck denied', 'follow the letter from TSA', 'TSA'],
        ['Disqualified from PreCheck after a security violation', 'reconsideration or redress, per TSA’s letter', 'TSA'],
        ['PreCheck suspended during a records review', `wait, usually under ${T.suspensionDaysTypical} days, up to ${T.suspensionDaysMax}`, 'TSA'],
        ['Boarding delayed, repeated extra screening, border delays', 'DHS TRIP inquiry, Redress Control Number', 'DHS TRIP'],
        ['KTN in the booking, no indicator', 'check membership, then name, birth date, airline', 'airline, then TSA'],
      ];
      return `<h2>Which route for which problem</h2>
${h.table(['Situation', 'Route', 'Who decides'], rows, `CBP Trusted Traveler Program Denials page, CBP Global Entry FAQ, DHS TRIP and TSA PreCheck FAQ, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>All these routes are free. No company can file them faster or with better odds; a lawyer can help with a complex record, but no one can buy access to the Ombudsman's decision.</p>
<h2>Writing a reconsideration request</h2>
<p>CBP sets the content. The request, and every attachment, is in English. It gives the date and reasons of the denial from the letter, a short summary that explains the incident or arrest, court disposition documents in PDF for every arrest or conviction, even when expunged, and any other document that may weigh on the decision. CBP accepts PDF, DOCX, DOC, PNG, JPEG and GIF files.</p>
<ul>
<li>Address the reason given, not the program in general.</li>
<li>Attach the final court disposition, not only the charge.</li>
<li>Explain a customs penalty factually: what was declared, what was not, what was paid.</li>
</ul>
<h2>DHS TRIP and the Redress Control Number</h2>
<p>DHS TRIP is the Department of Homeland Security's single point of contact for difficulties during travel screening: you cannot print a boarding pass, you are denied or delayed boarding, you are delayed entering or leaving the country, or you are sent to extra screening again and again. You apply online through the DHS TRIP portal with a login.gov account. The system assigns a seven-digit Redress Control Number, used to track the inquiry and, once it is closed, to add to airline reservations in the Redress field.</p>
<p>The Redress number and the Known Traveler Number are different fields with different purposes. One refers to a closed redress inquiry; the other to a trusted traveler membership. You may need both.</p>
<h2>While you wait</h2>
<p>A reconsideration takes time and CBP publishes no duration. In the meantime you travel through the standard lanes. If you hold a renewal application filed before expiry, the tool below shows what CBP's review figures mean in dates.</p>
<!--tool:mini:ge-time-->
<h2>When the problem is PreCheck only</h2>
<p>TSA distinguishes two procedures for PreCheck. Reconsideration applies to members disqualified after a violation of security rules who ask TSA to review the length of the disqualification. Redress applies to members disqualified by mistake, for example after being confused with another person. TSA's letter says which one applies to you.</p>
<p>Keep a copy of every letter and of your request: if you apply again later, the same record will be reviewed.</p>`;
    },
  },
});
