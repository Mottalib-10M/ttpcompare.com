/**
 * Renewal dates: expiration date → window, deadline TSA or CBP gives, end of the 24-month extension,
 * and a calendar file (.ics) built in the browser with a Blob. Nothing is sent; dates of the first
 * render come from the build day (§17.5).
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { DateField, isIso } from './fields';
import { renewal, ics, type RenewProgram } from '../../lib/engine/ttp';
import { addYears } from '../../lib/engine/dates';
import { dateL } from '../../lib/format-l';

interface Props { idPrefix?: string; primary?: boolean; program?: RenewProgram }
const OPTS: Array<{ value: RenewProgram; label: string }> = [
  { value: 'precheck', label: 'TSA PreCheck' },
  { value: 'globalEntry', label: 'Global Entry' },
  { value: 'nexus', label: 'NEXUS' },
  { value: 'sentri', label: 'SENTRI' },
  { value: 'clear', label: 'CLEAR+ (yearly)' },
];

export default function RenewalPlanner({ idPrefix = 'ren', primary = false, program: p0 = 'precheck' }: Props) {
  const today = __BUILD_DAY__;
  const [program, setProgram] = useState<RenewProgram>(p0);
  const [expiry, setExpiry] = useState(addYears(today, 1));
  const [file, setFile] = useState<string | null>(null);
  const out = useMemo(() => (isIso(expiry) ? renewal(program, expiry, today) : null), [program, expiry, today]);
  const p = (s: string) => `${idPrefix}-${s}`;
  const download = () => {
    if (!out) return;
    const blob = new Blob([ics(out.events, today, `${program}-${expiry}`)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${program}-renewal-${expiry}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFile(a.download);
  };
  const label = program === 'clear' ? 'Date your CLEAR+ year renews' : 'Expiration date of your membership';
  return (
    <div data-chrome className={`not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">Renewal dates and a reminder for your calendar</p>
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <form className="grid min-w-0 grid-cols-1 content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={p('prog')} label="Program" value={program} onChange={(x) => setProgram(x as RenewProgram)} options={OPTS} />
          <DateField id={p('exp')} label={label} value={expiry} onChange={setExpiry} help={program === 'precheck' ? 'On the provider’s renewal email or the TSA lookup page' : program === 'clear' ? 'In your CLEAR account' : 'On your Trusted Traveler Programs dashboard'} />
          <p className="text-xs text-navy-600">The calendar file is made in this browser: no address, name or date is sent anywhere.</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          {out ? (<>
            <p className="text-sm font-medium text-navy-600">{out.events[0].title}</p>
            <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{dateL(out.events[0].date)}</p>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
              {out.events.slice(1).map((e) => <tr key={e.title + e.date}><td className="py-1.5 pr-3 text-navy-600">{e.title}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{dateL(e.date)}</td></tr>)}
            </tbody></table>
            <p className="mt-2 text-sm text-navy-800">{out.status}</p>
            <button type="button" onClick={download} className="mt-3 h-12 rounded-lg bg-accent-600 px-4 text-sm font-semibold text-white hover:bg-accent-700">Download the reminders (.ics)</button>
            {file && <p className="mt-2 text-xs text-navy-600" role="status">Saved as {file}: open it to add the dates, each with an alert a week before.</p>}
            <p className="mt-2 text-xs text-navy-600">{out.events[0].detail}</p>
          </>) : <p className="text-sm text-navy-700">Enter a full date.</p>}
        </div>
      </div>
    </div>
  );
}
