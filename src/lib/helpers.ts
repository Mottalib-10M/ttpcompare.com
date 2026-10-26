/** Writing helpers handed to every page: links, figures read from data/params-2026.json, tables. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { formatNumberL, money, pct, dateL } from './format-l';
import { PROVIDERS, provider, cheapestEnroll, cheapestRenewal } from './engine/ttp';
import P from '../data/params-2026.json';
import EOA from '../data/eoa-airports.json';

export type SourceKey = keyof typeof P.sources;
const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption: string | undefined, align: Array<'l' | 'r'>) {
  const a = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${a(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${a(i)}">${typeof c === 'number' ? esc(formatNumberL(c)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
/** Every page id of the plan: a link to a planned page that is not written yet renders as text. */
export const PLANNED = [
  'tsa-precheck-vs-global-entry', 'clear-vs-tsa-precheck', 'nexus-vs-global-entry', 'sentri-vs-global-entry',
  'tsa-precheck-cost', 'global-entry-cost', 'trusted-traveler-cost-calculator', 'credit-cards-that-pay-for-global-entry',
  'tsa-precheck-renewal', 'global-entry-renewal', 'global-entry-interview', 'enrollment-on-arrival', 'enrollment-checklist',
  'global-entry-processing-time', 'tsa-precheck-processing-time', 'known-traveler-number',
  'tsa-precheck-for-kids', 'military-tsa-precheck', 'global-entry-denied', 'tsa-wait-times', 'global-entry-for-non-us-citizens',
];
export function helpers(lang: Locale = 'en', strict = false) {
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict && !PLANNED.includes(id)) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, lang)}">${text}</a>`;
  };
  const ext = (url: string, text: string) => `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a>`;
  const src = (k: SourceKey, text: string) => ext(P.sources[k].url, text);
  const m = (n: number) => money(n);
  const num = (n: number, d = 0) => formatNumberL(n, 'en', d);
  const pc = (x: number, d = 0) => pct(x, 'en', d);
  return {
    lang, a, ext, src, m, num, pc, P, EOA, PROVIDERS, provider, cheapestEnroll, cheapestRenewal,
    /** "October 26, 2026" */
    date: (iso: string) => dateL(iso),
    read: dateL(P.retrieved_at),
    table: (h: string[], r: Array<Array<string | number>>, c?: string, al2: Array<'l' | 'r'> = []) => table(h, r, c, al2),
  };
}
export type Helpers = ReturnType<typeof helpers>;
