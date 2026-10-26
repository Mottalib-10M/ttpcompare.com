import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'clear-vs-tsa-precheck', group: 'choose', order: 2,
  tool: { kind: 'cost', props: { program: 'clearPrecheck' } },
  mini: { kind: 'mini:clear-cost' },
  related: ['tsa-precheck-vs-global-entry', 'tsa-precheck-cost', 'credit-cards-that-pay-for-global-entry', 'tsa-wait-times', 'home'],
  sources: ['clear-plus', 'tsa-precheck', 'tsa-faq', 'tsa-touchless', 'amex-platinum'],
  en: {
    slug: 'clear-vs-tsa-precheck', nav: 'CLEAR vs PreCheck', card: 'CLEAR+ skips the ID check, PreCheck lightens the screening: what each does, the cost per flight, and when both together make sense.',
    title: 'CLEAR vs TSA PreCheck: Two Different Lines, Cost per Flight',
    description: 'CLEAR+ at $219 a year skips the ID check; TSA PreCheck from $79.75 for five years lightens screening. What each does, the cost per flight and when to hold both.',
    h1: 'CLEAR vs TSA PreCheck: they do not skip the same line',
    intro: 'Compare five and ten years of CLEAR+ with PreCheck taken through CLEAR, or switch the program to see each one alone.',
    resume: (h) => {
      const C = h.P.clear, pre = h.cheapestEnroll();
      return `CLEAR and TSA PreCheck are often compared as if they were rivals, but they act on two different steps of the security checkpoint. CLEAR+ is a private membership that verifies your identity with your face or fingerprints at a pod or an eGate, so you skip the line where an officer checks your ID and boarding pass; it costs ${h.m(C.annual)} a year, renews automatically, and CLEAR says it runs more than ${C.lanes} lanes at ${C.airports} airports. TSA PreCheck is a government program that changes the screening itself: shoes, belt, light jacket, laptop and liquids stay on or in the bag, for ${h.m(pre.enroll)} to ${h.m(h.provider('telos').enroll)} for five years. CLEAR without PreCheck takes you quickly to the standard screening lane; PreCheck without CLEAR keeps the ID check at the start of the PreCheck lane. Over five years one person pays ${h.m(C.annual * 5)} for CLEAR+ and ${h.m(pre.enroll)} for PreCheck.`;
    },
    faqs: (h) => {
      const C = h.P.clear, T = h.P.precheck;
      return [
        { q: 'If I have CLEAR, do I still take my shoes off?', a: 'Yes, unless you also have TSA PreCheck or your boarding pass shows the PreCheck indicator. CLEAR only replaces the identity check at the start of the line. After the CLEAR pod or eGate, an ambassador walks you to the screening lane your boarding pass allows, and the standard lane still asks for shoes, belts, laptops and liquids to come out.' },
        { q: 'Can my family use my CLEAR membership?', a: `Children ${C.kidsMaxAge} and under go through the CLEAR lane with a member at no charge. Adults need their own membership: CLEAR lets a member add up to ${C.familyMaxAdults} adults at ${h.m(C.familyAdd)} each per year, and they can then use it with or without you. For a couple who both fly often, that brings the yearly total to ${h.m(C.annual + C.familyAdd)}.` },
        { q: 'Is CLEAR worth it without TSA PreCheck?', a: `Rarely. Without PreCheck you skip the ID line and then wait in the standard screening line, which is usually the slower of the two. TSA states that about ${h.pc(T.waitShare)} of PreCheck passengers wait under ${T.waitMinutes} minutes, so most frequent flyers gain more from PreCheck. CLEAR on its own makes sense mainly when a card credit pays for it in full.` },
        { q: 'What is the CLEAR one-time code on the TSA PreCheck page?', a: `When you enroll in PreCheck or renew it online with CLEAR, CLEAR issues a code that lowers your first CLEAR+ year to ${h.m(T.clearPlusCodeNew)} for a new enrollment or ${h.m(T.clearPlusCodeRenew)} for an online renewal, which TSA describes as the price of CLEAR+ minus the PreCheck fee. Later years are billed at the full price.` },
      ];
    },
    body: (h) => {
      const C = h.P.clear, T = h.P.precheck, clr = h.provider('clear'), pre = h.cheapestEnroll();
      const rows = [
        ['Run by', 'a private company (Secure Identity, LLC)', 'TSA, with three enrollment providers'],
        ['Skips', 'the ID and boarding pass check', 'the standard screening rules'],
        ['Price', `${h.m(C.annual)} a year, auto-renewed`, `${h.m(pre.enroll)} to ${h.m(h.provider('telos').enroll)} for five years`],
        ['Family', `adults ${h.m(C.familyAdd)} each, children to ${C.kidsMaxAge} free`, 'children to 17 follow a member (age rules)'],
        ['Where', `${C.airports} airports (CLEAR figure)`, 'US airport checkpoints, with nearly 100 airlines on TSA’s list'],
        ['Card credits', 'some cards pay it each calendar year', 'about forty cards pay it every four years'],
      ];
      return `<h2>What each one changes at the checkpoint</h2>
<p>A security checkpoint has two stations. At the first, an officer compares your ID with your face and your boarding pass. At the second, you and your bags are screened. CLEAR+ replaces the first: you look into a camera or touch a reader, an eGate or a CLEAR employee lets you through, and you join the screening lane. PreCheck changes the second: a dedicated lane where you keep your shoes on and leave electronics and the 3-1-1 liquids bag in your carry-on. TSA's own Touchless ID now also replaces the ID check with a quick photo, at ${h.P.touchless.airports} airports, for PreCheck members with a valid passport who opt in through a participating airline or a phone wallet.</p>
${h.table(['', 'CLEAR+', 'TSA PreCheck'], rows, `CLEAR price page and TSA PreCheck pages, read on ${h.read}.`, ['l', 'l', 'l'])}
<h2>Price per flight, not per year</h2>
<p>The fair way to compare is the cost per departure. CLEAR+ at ${h.m(C.annual)} a year is about ${h.m(Math.round(C.annual / 12 * 100) / 100)} per departure if you fly out of a CLEAR airport twelve times a year, and ${h.m(Math.round(C.annual / 50 * 100) / 100)} at fifty. PreCheck at ${h.m(pre.enroll)} for five years is ${h.m(Math.round(pre.enroll / 60 * 100) / 100)} per departure at twelve a year. The tool below does the division for your own count, with the extra adults and any yearly CLEAR credit from a card.</p>
<!--tool:mini:clear-cost-->
<h2>Taking PreCheck through CLEAR</h2>
<p>CLEAR is also one of TSA's three PreCheck enrollment providers, at ${h.m(clr.enroll)} for enrollment and ${h.m(clr.renewOnline)} online or ${h.m(clr.renewInPerson)} in person for renewal. The PreCheck membership is the same as with IDEMIA or Telos; only the price and the Known Traveler Number prefix (AC) differ. What you gain is the one-time code that discounts the first CLEAR+ year to ${h.m(T.clearPlusCodeNew)}. If you want both anyway, the combination costs ${h.m(clr.enroll + T.clearPlusCodeNew)} the first year, the same as CLEAR+ alone at full price. If you do not want CLEAR+, IDEMIA's ${h.m(h.provider('idemia').enroll)} is cheaper.</p>
<h2>Who should hold both</h2>
<p>Both together make sense for a traveler who flies often from a large airport where the ID line before the PreCheck lane gets long at peak hours, and whose card pays the CLEAR+ fee. One card on TSA's list, for example, gives up to ${h.m(219)} back each calendar year on CLEAR+, which covers it entirely. Without such a credit, most travelers get more from PreCheck alone, or from ${h.a('tsa-precheck-vs-global-entry', 'Global Entry')}, which includes PreCheck. Check that CLEAR operates at the airports you use before paying: its lanes are limited to some terminals and checkpoints. CLEAR is cited here as a company; this site has no link with it.</p>`;
    },
  },
});
