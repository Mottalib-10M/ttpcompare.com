/**
 * Enrollment and upkeep checklists, step by step, each step from the TSA or CBP page cited in
 * `src` (keys of params-2026.json). Figures come from params-2026.json, never typed here.
 */
import P from './params-2026.json';
const pre = P.precheck, ge = P.globalEntry;
const minEnroll = Math.min(...pre.providers.map((p) => p.enroll));
export interface Step { t: string; d?: string; src?: keyof typeof P.sources }
export interface Route { id: string; label: string; steps: Step[] }
export const ROUTES_CHECK: Route[] = [
  { id: 'precheck-new', label: 'TSA PreCheck, first enrollment', steps: [
    { t: 'Pick one of the three providers listed on tsa.gov', d: `IDEMIA, Telos or CLEAR, from $${minEnroll} for five years. Only addresses ending in .gov (tsaenrollmentby…tsa.dhs.gov) are official.`, src: 'tsa-precheck' },
    { t: 'Fill in the online pre-enrollment', d: `About ${pre.onlineMinutes} minutes; the name must be the one on your documents and your airline bookings.`, src: 'tsa-precheck' },
    { t: 'Book a slot or walk in at an enrollment center', d: `Over ${pre.totalLocations.toLocaleString('en-US')} locations across the three providers.`, src: 'tsa-precheck' },
    { t: 'Bring one List A document', d: 'Unexpired US passport or passport card, enhanced driver’s license, FAST card, green card, or re-entry permit.', src: 'tsa-faq' },
    { t: 'Or two List B documents', d: 'A REAL ID photo ID or a military ID, plus proof of citizenship such as a US birth certificate (not a short form) or a naturalization certificate.', src: 'tsa-faq' },
    { t: 'Bring a name change document if your name changed', d: 'Original or certified marriage certificate or divorce decree.' },
    { t: 'Fingerprints, photo and payment on site', d: `About ${pre.inPersonMinutes} minutes. No refund once the visit is done and paid.`, src: 'tsa-faq' },
    { t: 'Wait for your Known Traveler Number', d: `Most in ${pre.ktnDaysTypical.join('-')} days, some up to ${pre.ktnDaysMax} days.`, src: 'tsa-faq' },
    { t: 'Add the KTN to every reservation and frequent flyer profile', d: 'The indicator then appears on the boarding pass; children 12 and under follow you without it.', src: 'tsa-benefits' },
  ] },
  { id: 'precheck-renew', label: 'TSA PreCheck, renewal', steps: [
    { t: 'Find your expiration date and KTN', d: 'On the provider’s reminder or the TSA lookup tool.', src: 'tsa-renew' },
    { t: 'Renew online from six months before expiry', d: 'The new five years start when the current ones end: renewing early costs nothing.', src: 'tsa-faq' },
    { t: 'Use a .gov provider site only', d: 'Sites that charge a “processing” fee to renew for you are not official; TSA does not refund them.', src: 'tsa-faq' },
    { t: 'Go in person if your name changed', d: `Or update it with the provider; name changes can take up to ${pre.nameChangeDays} days.`, src: 'tsa-faq' },
    { t: 'Finish at least 60 days before expiry', d: `Some renewals take up to ${pre.ktnDaysMax} days. Your KTN stays the same.`, src: 'tsa-faq' },
  ] },
  { id: 'ge-center', label: 'Global Entry, interview at an enrollment center', steps: [
    { t: 'Create a login.gov account and apply on ttp.dhs.gov', d: `Pay the $${ge.fee} fee, not refunded if denied. Children under 18 pay nothing when a parent is a member or applies.`, src: 'cbp-ge-eligibility' },
    { t: 'Wait for conditional approval', d: `${Math.round(ge.approvedShare * 100)}% within ${ge.approvedWeeks} weeks; some take ${ge.maxMonths} months or longer.`, src: 'cbp-ge-apply' },
    { t: 'Schedule the interview in your TTP account', d: 'Each applicant schedules their own, children included; a parent attends with a minor.', src: 'cbp-ge-apply' },
    { t: 'Bring your valid passport', d: 'All current passports if you have several.', src: 'cbp-ge-apply' },
    { t: 'Bring a second ID or proof of address', d: 'Driver’s license, or a mortgage, rent or utility statement with your current address.', src: 'cbp-eoa' },
    { t: 'Bring your green card if you are a permanent resident', src: 'cbp-eoa' },
    { t: 'After approval: card in 2-4 weeks, activate within 30 days', d: 'The card is for land and sea lanes; airport kiosks use your passport.', src: 'cbp-ge-faq' },
    { t: 'Add your PASS ID as Known Traveler Number', d: 'Nine digits on the back of the card: it gives TSA PreCheck.', src: 'cbp-precheck' },
  ] },
  { id: 'ge-eoa', label: 'Global Entry, Enrollment on Arrival', steps: [
    { t: 'Be conditionally approved first', d: 'EoA is not available before the conditional approval in your TTP account.', src: 'cbp-ge-faq' },
    { t: 'Fly back into one of the airports CBP lists', d: 'Or through a CBP Preclearance airport on the list; follow the EoA signs to the officer.', src: 'cbp-eoa' },
    { t: 'Have your passport and proof of residence with you', d: 'Driver’s license with current address, mortgage, rent or utility statement; not needed for minors.', src: 'cbp-eoa' },
    { t: 'Bring your green card if you have one', src: 'cbp-eoa' },
    { t: 'Ask for a modification at once if you need one', d: 'If it is not available on the spot, the interview may be rescheduled.', src: 'cbp-eoa' },
  ] },
  { id: 'ge-remote', label: 'Global Entry renewal, remote interview', steps: [
    { t: 'Renew on ttp.dhs.gov from one year before expiry', d: `Benefits continue up to ${ge.graceMonths} months after expiry while the renewal is pending, if filed in time.`, src: 'cbp-ge-faq' },
    { t: 'Check the pilot criteria', d: `Conditionally approved renewal, ${ge.remoteMinAge} or older, CBP photo under ${ge.remotePhotoYears} years old taken after age 14, fingerprints on file.`, src: 'cbp-remote' },
    { t: 'Schedule through “Scheduling Your Remote Interview”', d: 'Verify your email address first so the invitation reaches you.', src: 'cbp-remote' },
    { t: 'Test a device with camera, microphone and Zoom', d: `The interview takes about ${ge.remoteMinutes} minutes; the waiting room opens 15 minutes before.`, src: 'cbp-remote' },
    { t: 'Have passport, proof of residence and green card at hand', src: 'cbp-remote' },
  ] },
  { id: 'nexus', label: 'NEXUS', steps: [
    { t: 'Apply on ttp.dhs.gov', d: `$${P.nexus.fee} per adult; children under 18 apply and pay nothing.`, src: 'cbp-nexus-apply' },
    { t: 'Permanent residents: three years of residence', d: 'At least 183 days a year in Canada or the US in each of the three years before applying.', src: 'cbsa-nexus-eligible' },
    { t: 'Wait for both risk assessments', d: 'CBP and the CBSA each review the file; then you are conditionally approved.', src: 'cbsa-nexus-eligible' },
    { t: 'Schedule the interview in time', d: `From ${P.nexus.interviewRuleFrom}, within ${P.nexus.interviewYearsAfter} years of conditional approval.`, src: 'cbsa-nexus' },
    { t: 'Interview with both agencies', d: 'At a NEXUS enrollment center; entering Canada with NEXUS needs the CBSA interview.', src: 'cbp-ge-faq' },
  ] },
];
