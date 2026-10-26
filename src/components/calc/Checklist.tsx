/**
 * Enrollment and upkeep checklist: pick the route, tick the steps, see what is left and the next step.
 * Steps from src/data/checklists.ts (each with its TSA or CBP page). Ticks stay in this page only.
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ROUTES_CHECK } from '../../data/checklists';
import P from '../../data/params-2026.json';

interface Props { idPrefix?: string; primary?: boolean; route?: string }
type SK = keyof typeof P.sources;

export default function Checklist({ idPrefix = 'chk', primary = false, route: r0 = 'ge-center' }: Props) {
  const [rid, setRid] = useState(r0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const route = ROUTES_CHECK.find((r) => r.id === rid) ?? ROUTES_CHECK[0];
  const key = (i: number) => `${route.id}-${i}`;
  const n = useMemo(() => route.steps.filter((_, i) => done[key(i)]).length, [route, done]);
  const next = route.steps.find((_, i) => !done[key(i)]);
  const p = (s: string) => `${idPrefix}-${s}`;
  return (
    <div data-chrome className={`not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">Enrollment and interview checklist</p>
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <form className="grid min-w-0 grid-cols-1 content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={p('route')} label="What you are doing" value={rid} onChange={setRid} options={ROUTES_CHECK.map((r) => ({ value: r.id, label: r.label }))} />
          <ol className="space-y-2">
            {route.steps.map((s, i) => (
              <li key={key(i)} className="flex gap-3 rounded-lg border border-navy-200 p-3">
                <input id={p(`s${i}`)} type="checkbox" checked={!!done[key(i)]} onChange={(e) => setDone((o) => ({ ...o, [key(i)]: e.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-accent-600" />
                <label htmlFor={p(`s${i}`)} className="text-sm text-navy-800"><span className="font-medium text-navy-900">{s.t}</span>{s.d && <span className="block text-navy-600">{s.d}</span>}{s.src && <a href={P.sources[s.src as SK].url} target="_blank" rel="nofollow noopener noreferrer" className="mt-0.5 block text-xs text-accent-700 underline">{new URL(P.sources[s.src as SK].url).hostname.replace('www.', '')}</a>}</label>
              </li>
            ))}
          </ol>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="self-start rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">{route.label}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{n} of {route.steps.length} done</p>
          <p className="mt-3 text-sm text-navy-800">{next ? <>Next: <strong>{next.t}</strong>{next.d ? `. ${next.d}` : ''}</> : 'Every step is ticked. Keep your Known Traveler Number in your airline profiles.'}</p>
          <p className="mt-3 text-xs text-navy-600">You apply, pay and book interviews only on tsa.gov provider sites and ttp.dhs.gov. This site takes no application and keeps none of your ticks once you leave the page.</p>
        </div>
      </div>
    </div>
  );
}
