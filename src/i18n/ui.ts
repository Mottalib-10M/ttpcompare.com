import type { Locale } from './routes';
const en = {
  updatedOn: 'Fees and rules checked on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Fees and rules read on tsa.gov and cbp.gov by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions travelers ask', relatedCalculators: 'Check next', sourcesTitle: 'Official pages behind this page', writtenBy: 'Written by',
  asOf: 'Trusted traveler fees', lastUpdated: 'read on the TSA, CBP and CBSA pages, last checked on',
  footerValidated: 'Every fee and every delay links to the TSA, CBP, CBSA or company page it was read on, with the date',
  footerBrowser: 'Tools run in your browser · nothing you type is sent or stored · free, no account, no application taken',
  footerDisclaimer: 'TTP Compare is an independent site published by Radif Partners. It is not TSA, U.S. Customs and Border Protection, the Department of Homeland Security, the Canada Border Services Agency, CLEAR or a card issuer, and it takes no application or payment. Apply and renew only on tsa.gov provider sites ending in .gov and on ttp.dhs.gov: sites that charge to “process” a renewal are not official. Figures are read on official pages and dated; this guide does not replace those pages, which prevail.',
  footerPopular: 'Tools',
  notFound: 'There is no page at this address. The chooser is on the home page.',
  readMore: 'Read more', back: 'Home',
  independent: 'Independent site, not a government service. Apply and pay only on tsa.gov provider sites (.gov) or ttp.dhs.gov.',
};
export function t(_lang: Locale = 'en') { return en; }
