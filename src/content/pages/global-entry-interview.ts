import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'global-entry-interview', group: 'apply', order: 2,
  tool: { kind: 'checklist', props: { route: 'ge-center' } },
  mini: { kind: 'mini:remote' },
  related: ['enrollment-on-arrival', 'global-entry-processing-time', 'enrollment-checklist', 'global-entry-renewal', 'global-entry-denied'],
  sources: ['cbp-ge-apply', 'cbp-ge-faq', 'cbp-eoa', 'cbp-remote', 'cbp-denials', 'cbp-precheck'],
  en: {
    slug: 'global-entry-interview', nav: 'Global Entry interview', card: 'When you can book it, the three ways to do it, the documents to bring, what the officer checks and what follows.',
    title: 'Global Entry Interview: Documents, Booking, What to Expect',
    description: 'Global Entry interview after conditional approval: at a center, on arrival or by video for some renewals. Documents to bring, what CBP checks, what follows.',
    h1: 'Global Entry interview: booking it, bringing the right papers',
    intro: 'Tick the steps as you prepare. Switch the route to Enrollment on Arrival or the remote renewal interview if that is your case.',
    resume: (h) => {
      const G = h.P.globalEntry;
      return `The Global Entry interview comes after conditional approval, never before: once CBP has run the background check on your online application, your TTP account shows "conditionally approved" and invites you to schedule. You then have three ways to do it. At an enrollment center, on an appointment booked in the account. On arrival from an international trip at one of the airports CBP lists for Enrollment on Arrival, with no appointment. Or, for some renewals only, by video in about ${G.remoteMinutes} minutes, under a CBP pilot open to adults whose photo on file is less than ${G.remotePhotoYears} years old. In every case you bring a valid passport, every passport you travel on, a document showing your current address such as a driver's license or a utility bill, and your green card if you have one. The officer verifies your identity and your answers, and CBP's background check includes biometric fingerprint checks. A parent or guardian attends with a minor.`;
    },
    faqs: (h) => {
      const G = h.P.globalEntry;
      return [
        { q: 'What questions are asked at the Global Entry interview?', a: 'CBP does not publish a list. Its pages describe a personal interview with a CBP officer that confirms the information in your application, along with the document checks. Expect questions about your identity, your address, your employment and your travel, which match what you wrote online. Answer plainly; a false or incomplete answer is itself a ground for denial under the CBP FAQ.' },
        { q: 'Can I do the Global Entry interview without an appointment?', a: 'Yes, through Enrollment on Arrival when you land from abroad at a listed airport, or by walking in at enrollment centers that accept conditionally approved applicants without one. CBP says a scheduled appointment elsewhere is cancelled automatically once you complete Enrollment on Arrival. Miami and Detroit also offer Enrollment on Departure for travelers flying the same day.' },
        { q: 'Do I need another interview to renew Global Entry?', a: `Not always. CBP says an interview for renewal may not be necessary. If one is required, some renewing members can do it by video: the pilot is open to conditionally approved renewals, applicants ${G.remoteMinAge} or older, with a CBP photo on file less than ${G.remotePhotoYears} years old taken after age 14. The tool below checks those criteria.` },
        { q: 'How soon after the interview is Global Entry approved?', a: `CBP gives no figure: it says the final decision notification timeline can vary, and that you get an email when your membership status changes, so watch your TTP account. The card follows in ${G.cardWeeks.join(' to ')} weeks and must be activated within ${G.cardActivateDays} days; you can use the airport kiosks with your passport as soon as the membership is active.` },
      ];
    },
    body: (h) => {
      const G = h.P.globalEntry;
      const rows = [
        ['Enrollment center', 'appointment in your TTP account; some centers take walk-ins', 'none beyond the trip to the center'],
        ['Enrollment on Arrival', 'on landing from abroad at a listed airport, no appointment', `${h.EOA.us.length + h.EOA.abroad.length} airports on CBP’s list`],
        ['Enrollment on Departure', 'Miami and Detroit, same-day travelers', 'set hours on weekdays'],
        ['Remote video', 'renewals in the pilot only', `about ${G.remoteMinutes} minutes on Zoom`],
      ];
      return `<h2>Three ways to do the interview</h2>
${h.table(['Route', 'How', 'Limits'], rows, `CBP Global Entry how to apply, Enrollment on Arrival, Enrollment on Departure and remote interview pages, read on ${h.read}.`, ['l', 'l', 'l'])}
<p>The route does not change the outcome or the fee, which was paid with the application. Pick the one that costs you the least time: if you have a trip abroad coming up, ${h.a('enrollment-on-arrival', 'Enrollment on Arrival')} is usually the quickest, since it needs no slot at all.</p>
<h2>Documents, by case</h2>
<ul>
<li>Everyone: a valid passport, and all other passports you travel on so they can be added to your file.</li>
<li>Adults: evidence of residency, such as a driver's license with your current address, a mortgage or rental statement or a utility bill. CBP does not ask it from minors.</li>
<li>Lawful permanent residents: the permanent resident card.</li>
<li>Minors: a parent or legal guardian present, who gave permission on the application.</li>
<li>If you need a modification for a disability, ask the center before the date; at Enrollment on Arrival, tell the officer at once.</li>
</ul>
<h2>Remote interview for renewals</h2>
<p>CBP runs a pilot that lets some renewing members do the interview on Zoom. The criteria are strict: the renewal must be conditionally approved, you must be ${G.remoteMinAge} or older, and the photo CBP holds must be less than ${G.remotePhotoYears} years old and taken after age 14, with fingerprints already on file. Check yours below; when you qualify, the invitation appears in your account.</p>
<!--tool:mini:remote-->
<h2>After the interview</h2>
<p>When the status turns to approved, your PASS ID becomes your Known Traveler Number for TSA PreCheck: add it to each reservation. The card arrives by mail in ${G.cardWeeks.join(' to ')} weeks; it is needed for land and sea crossings, not for the airport kiosks. If the answer is a denial, CBP explains the reason in writing and you can ask for reconsideration; the ${h.a('global-entry-denied', 'denials page')} explains how. If the decision is slow to come, the ${h.a('global-entry-processing-time', 'processing time page')} gives CBP's own figures.</p>
<h2>Interviewing a family</h2>
<p>Each person has their own interview, children included, and each must be conditionally approved first. CBP requires a parent or legal guardian to give permission for a minor and to be present at the interview. Families often find Enrollment on Arrival the easiest route, since everyone conditionally approved on the same trip can be interviewed one after the other on landing. If one family member is still waiting for conditional approval, that person cannot be interviewed yet, even if the others are.</p>
<p>If you cannot make a booked slot, cancel it in your TTP account so it frees up, then book again or use Enrollment on Arrival on your next trip abroad.</p>`;
    },
  },
});
