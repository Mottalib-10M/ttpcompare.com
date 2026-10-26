/**
 * Real cost over five and ten years: fees of each program, renewal, card credits, family members.
 * Arithmetic in lib/engine/ttp.ts (`cost`); fees from data/params-2026.json. Nothing typed leaves the browser.
 */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { cost, PROVIDERS, type Channel, type Program, type ProviderId } from '../../lib/engine/ttp';
import { money } from '../../lib/format-l';

interface Props { idPrefix?: string; primary?: boolean; program?: Program; credit?: number; adults?: number; kids?: number }
const PROGRAMS: Array<{ value: Program; label: string }> = [
  { value: 'precheck', label: 'TSA PreCheck' },
  { value: 'globalEntry', label: 'Global Entry (includes PreCheck)' },
  { value: 'nexus', label: 'NEXUS (includes PreCheck)' },
  { value: 'sentri', label: 'SENTRI (includes PreCheck)' },
  { value: 'clear', label: 'CLEAR+ alone' },
  { value: 'clearPrecheck', label: 'CLEAR+ with PreCheck through CLEAR' },
];

export default function CostCalc({ idPrefix = 'cost', primary = false, program: p0 = 'globalEntry', credit: c0 = 0, adults: a0 = 1, kids: k0 = 0 }: Props) {
  const [program, setProgram] = useState<Program>(p0);
  const [prov, setProv] = useState<ProviderId>('idemia');
  const [channel, setChannel] = useState<Channel>('online');
  const [adults, setAdults] = useState(a0);
  const [kids, setKids] = useState(k0);
  const [credit, setCredit] = useState(c0);
  const [every, setEvery] = useState(4);
  const [clearCredit, setClearCredit] = useState(0);
  const args = { program, provider: prov, channel, adults, kids, cardCredit: credit, cardEvery: every, clearCredit };
  const five = useMemo(() => cost({ ...args, years: 5 }), [program, prov, channel, adults, kids, credit, every, clearCredit]);
  const ten = useMemo(() => cost({ ...args, years: 10 }), [program, prov, channel, adults, kids, credit, every, clearCredit]);
  const p = (s: string) => `${idPrefix}-${s}`;
  const isClear = program === 'clear' || program === 'clearPrecheck';
  return (
    <div data-chrome className={`not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">Real cost over five and ten years</p>
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <form className="grid min-w-0 grid-cols-1 content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={p('prog')} label="Program" value={program} onChange={(x) => setProgram(x as Program)} options={PROGRAMS} />
          {program === 'precheck' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectField id={p('prov')} label="Enrollment provider" value={prov} onChange={(x) => setProv(x as ProviderId)} options={PROVIDERS.map((x) => ({ value: x.id, label: `${x.name}, ${money(x.enroll)}` }))} />
              <Toggle id={p('ch')} label="Renewal" value={channel} onChange={(x) => setChannel(x as Channel)} options={[{ value: 'online', label: 'Online' }, { value: 'inPerson', label: 'In person' }]} />
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField id={p('ad')} label="Adults (18 and over)" value={adults} onChange={(x) => setAdults(Math.max(1, Math.min(9, Math.round(x))))} max={9} tag="en-US" />
            <NumberField id={p('kd')} label="Children under 18" value={kids} onChange={(x) => setKids(Math.min(9, Math.round(x)))} max={9} tag="en-US" />
          </div>
          {program !== 'clear' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumberField id={p('cr')} label="Card fee credit per cardholder" value={credit} onChange={(x) => setCredit(Math.min(500, x))} unit="$" max={500} decimals={2} tag="en-US" help="0 if none; often $100 or $120" />
              <NumberField id={p('ev')} label="Credit once every" value={every} onChange={(x) => setEvery(Math.max(1, Math.min(10, Math.round(x))))} unit="years" max={10} tag="en-US" />
            </div>
          )}
          {isClear && <NumberField id={p('cc')} label="CLEAR+ credit on your card, per year" value={clearCredit} onChange={(x) => setClearCredit(Math.min(1000, x))} unit="$" max={1000} tag="en-US" />}
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">You pay over five years</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{money(five.net)}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            <tr><td className="py-1.5 pr-3 text-navy-600">Over ten years</td><td className="tabular-nums py-1.5 text-right font-semibold text-navy-900">{money(ten.net)}</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Per year</td><td className="tabular-nums py-1.5 text-right text-navy-900">{money(ten.perYear)}</td></tr>
            {ten.lines.map((l, i) => <tr key={l.label + i}><td className="py-1.5 pr-3 text-navy-600">{l.label}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{money(l.amount)}</td></tr>)}
          </tbody></table>
          <p className="mt-2 text-xs text-navy-600">{ten.note} Ten years = enrollment plus one renewal at year five; a card credit counts when its period has passed since the last one.</p>
        </div>
      </div>
    </div>
  );
}
