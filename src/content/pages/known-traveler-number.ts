import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'known-traveler-number', group: 'renew', order: 3,
  tool: { kind: 'ktn' },
  mini: { kind: 'mini:denied' },
  related: ['tsa-precheck-renewal', 'global-entry-renewal', 'tsa-precheck-processing-time', 'military-tsa-precheck', 'tsa-precheck-for-kids'],
  sources: ['tsa-benefits', 'tsa-faq', 'cbp-precheck', 'cbp-ge-faq', 'tsa-military'],
  en: {
    slug: 'known-traveler-number', nav: 'Known Traveler Number', card: 'What your KTN looks like by program, where to find it, how to enter it, and why the PreCheck indicator sometimes does not show.',
    title: 'Known Traveler Number: Formats, Where to Find It, Fixes',
    description: 'Known Traveler Number formats: TT, TE or AC for PreCheck, a nine-digit PASS ID for Global Entry, a DoD ID for the military. Where to find it, why PreCheck fails',
    h1: 'Known Traveler Number: read it, find it, make it work',
    intro: 'Type your number: the decoder tells you which program its format points to and how to use it. Nothing is sent.',
    resume: (h) => {
      const T = h.P.precheck;
      return `A Known Traveler Number, or KTN, is what turns a membership into the PreCheck indicator on a boarding pass. Its format depends on where it comes from. A TSA PreCheck membership gives a KTN of ${T.ktnLength.join(' or ')} characters starting with TT, TE or AC, the prefix of the provider you enrolled with: IDEMIA, Telos or CLEAR. Global Entry, NEXUS and SENTRI give a nine-digit PASS ID, which usually begins with ${T.passIdPrefixes.join(', ')}, printed in the upper left corner of the back of the card. Service members and DoD civilians use their DoD ID number. Holders of employment-based benefits get a number whose format varies by employer. In every case, the benefit is not automatic: TSA asks you to put the number in the KTN field of every airline reservation and to make sure the name, middle name included if you used one, and the date of birth match your enrollment. Showing a card or an approval email at the checkpoint does not open the lane. The decoder above reads the format of your number.`;
    },
    faqs: () => [
      { q: 'I forgot my Known Traveler Number. How do I find it?', a: 'For TSA PreCheck, log in to your account on the provider’s site, or use the KTN lookup tool on tsa.gov if you do not remember the provider. For Global Entry, NEXUS or SENTRI, log in to ttp.dhs.gov: your PASS ID is your KTN, also printed on the back of the card. Service members use the DoD ID number on their common access card.' },
      { q: 'Why is TSA PreCheck not on my boarding pass?', a: 'TSA lists the checks: the membership has not expired, the KTN is in the reservation and correct, the name and date of birth match your enrollment, and the airline takes part in PreCheck. If all is right and the indicator still does not appear, contact AskTSA or the TSA Contact Center. TSA adds that it uses unpredictable security measures, so no member is promised the lane every time.' },
      { q: 'Is a Global Entry PASS ID the same as a Known Traveler Number?', a: 'Yes, for TSA purposes. Global Entry, NEXUS and SENTRI members enter their nine-digit PASS ID in the Known Traveler Number field. Do not enter the number on the front of the card or the passport number. Canadian NEXUS members use the same PASS ID, since TSA lists NEXUS among the programs that include PreCheck.' },
    ],
    body: (h) => {
      const T = h.P.precheck;
      const rows = [
        ['TSA PreCheck (IDEMIA)', 'TT + digits', `${T.ktnLength.join(' or ')} characters`, 'provider account, KTN lookup tool'],
        ['TSA PreCheck (Telos)', 'TE + digits', `${T.ktnLength.join(' or ')} characters`, 'provider account, KTN lookup tool'],
        ['TSA PreCheck (CLEAR)', 'AC + digits', `${T.ktnLength.join(' or ')} characters`, 'provider account, KTN lookup tool'],
        ['Global Entry, NEXUS, SENTRI', `PASS ID, usually from ${T.passIdPrefixes[0]} to ${T.passIdPrefixes[T.passIdPrefixes.length - 1]}`, '9 digits', 'back of the card, ttp.dhs.gov'],
        ['Armed forces, DoD civilians', 'DoD ID number', 'as printed', 'common access card'],
        ['Employment-based (HME, TWIC and others)', 'varies', 'no set format', 'employer or issuing program'],
      ];
      return `<h2>Number formats by program</h2>
${h.table(['Source', 'Format', 'Length', 'Where to find it'], rows, `TSA "How to use TSA PreCheck benefits" page and CBP FAQ, read on ${h.read}.`, ['l', 'l', 'l', 'l'])}
<p>The PreCheck KTN keeps the same number across renewals and even if you renew with another provider. A PASS ID also stays the same when you renew Global Entry. If you hold both a PreCheck KTN and a Global Entry PASS ID, use the one whose membership expires later; they are not combined.</p>
<h2>Entering it correctly</h2>
<ul>
<li>Use the Known Traveler Number field, not the Redress number field, which is for DHS TRIP inquiries.</li>
<li>Add it to bookings already made, then to frequent flyer profiles and employer or travel agency profiles so future bookings carry it.</li>
<li>Match the name you enrolled with, including a middle name or initial if you used one, and check the date of birth.</li>
<li>For a teenager flying with you, leave their KTN field empty if they have no membership; the ${h.a('tsa-precheck-for-kids', 'kids page')} explains the rule.</li>
</ul>
<h2>When it still does not work</h2>
<p>Most failures are in the reservation: a missing middle name, a typo in the number, or an airline profile that did not copy the KTN to a booking. If everything matches, the issue may be on TSA's side, from a suspension during a records review to a screening problem that needs DHS TRIP. Pick your case below.</p>
<!--tool:mini:denied-->
<p>TSA's FAQ says it uses unpredictable security measures and that no one is assured of expedited screening, so a missing indicator once is not necessarily a fault. Repeated misses are worth a message to AskTSA.</p>
<h2>Military and family numbers</h2>
<p>Service members, including the Coast Guard, the Reserve and the National Guard, enter their DoD ID number; DoD civilians must opt in first. Spouses and adult dependents need their own membership. The ${h.a('military-tsa-precheck', 'military page')} covers each case.</p>
<h2>Holding two numbers</h2>
<p>If you have both a TSA PreCheck KTN and a Global Entry PASS ID, either works for PreCheck. Use the PASS ID if you travel abroad, so you have one number to keep current, and let the PreCheck membership expire without renewing. Write the expiration dates down: the ${h.a('tsa-precheck-renewal', 'PreCheck renewal')} and ${h.a('global-entry-renewal', 'Global Entry renewal')} pages make calendar files.</p>
<p>A number entered once in a frequent flyer profile is the simplest safeguard, since every new booking then carries it automatically.</p>`;
    },
  },
});
