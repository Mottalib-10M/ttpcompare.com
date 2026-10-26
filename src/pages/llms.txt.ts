/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/guides';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS_ORDER, groupLabel } from '../i18n/nav';
import params from '../data/params-2026.json';

const words = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Free tools to choose and keep a US trusted traveler program: a chooser that turns your trips, status and card into a recommendation between TSA PreCheck, Global Entry, NEXUS, SENTRI and CLEAR+ with the cost per year and per trip; a five and ten year cost calculator with each TSA enrollment provider's fee, renewals and card credits; renewal dates with a calendar file built in the browser; checklists of documents and interview routes including Enrollment on Arrival airports listed by CBP; Known Traveler Number formats; checkpoint traffic from TSA's daily numbers. Every fee read on tsa.gov, cbp.gov, the CBSA site, CLEAR's price page and card issuers' pages, with its date. Independent site, not TSA, CBP or CLEAR; it takes no application. Published by Radif Partners. Last updated ${words(LAST_UPDATED)}.`,
    '',
    '## Data',
    `- TSA, CBP and DHS pages (US government works), Federal Register, Canada Border Services Agency, CLEAR and card issuer pages read ${words(params.retrieved_at)}. TSA checkpoint travel numbers, daily.`,
    '',
    `- [Which one should I get?](${SITE_URL}${route('home', 'en')}): TSA PreCheck, Global Entry, NEXUS or CLEAR chooser with cost per year`,
    '',
    ...GROUPS_ORDER.flatMap((g) => [`## ${groupLabel(g)}`, ...PAGES.filter((p) => p.group === g).map((p) => `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`), '']),
    '## About',
    `- [Method and sources](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
