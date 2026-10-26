/**
 * Known Traveler Number check: the format TSA describes for each provider (TT, TE, AC), the CBP PASS ID
 * prefixes and the DoD ID length. It reads the shape of the number only and never looks anything up:
 * nothing typed leaves the browser.
 */
import { useMemo, useState } from 'react';
import { decodeKtn } from '../../lib/engine/ttp';

interface Props { idPrefix?: string; primary?: boolean }
export default function KtnDecoder({ idPrefix = 'ktn', primary = false }: Props) {
  const [v, setV] = useState('TT1234567');
  const out = useMemo(() => decodeKtn(v), [v]);
  const id = `${idPrefix}-n`;
  return (
    <div data-chrome className={`not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">What kind of Known Traveler Number is this?</p>
      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <form className="grid min-w-0 grid-cols-1 content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">Number as printed or emailed</label>
            <input id={id} type="text" inputMode="text" autoComplete="off" spellCheck={false} value={v} maxLength={20} onChange={(e) => setV(e.target.value.slice(0, 20))}
              className="h-12 w-full min-w-0 rounded-lg border border-navy-300 bg-white px-3 font-mono uppercase tracking-wider text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <p className="mt-1 text-xs text-navy-500">The example is made up. Your number stays on this page.</p>
          </div>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">Format</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{out.title}</p>
          <p className="mt-2 text-sm text-navy-800">{out.detail}</p>
        </div>
      </div>
    </div>
  );
}
