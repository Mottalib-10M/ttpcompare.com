/**
 * "Which one should I get?": the way you fly → TSA PreCheck, Global Entry, NEXUS, SENTRI and/or
 * CLEAR+, with the cost per year and per round trip after card credits. Logic in lib/engine/ttp.ts
 * (`choose`). Nothing typed leaves the browser; first render = build defaults (§17.5).
 */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { choose, type CardKind, type Status } from '../../lib/engine/ttp';
import { money } from '../../lib/format-l';

interface Props { idPrefix?: string; primary?: boolean; domestic?: number; international?: number; canadaLand?: number; mexicoLand?: number; status?: Status; military?: boolean; card?: CardKind }

const STATUS = [
  { value: 'us', label: 'US citizen or US national' },
  { value: 'lpr', label: 'US permanent resident (green card)' },
  { value: 'canadian', label: 'Canadian citizen' },
  { value: 'mexican', label: 'Mexican national' },
  { value: 'partner', label: 'Citizen of a Global Entry partner country' },
  { value: 'other', label: 'Other nationality' },
];
const CARDS = [
  { value: 'none', label: 'No fee credit' },
  { value: 'ttp120', label: 'Credit up to $120 (Global Entry or PreCheck)' },
  { value: 'ttp100', label: 'Credit up to $100' },
  { value: 'ttpClear', label: '$120 credit and a CLEAR+ credit' },
];

export default function Chooser({ idPrefix = 'ch', primary = false, domestic: d0 = 4, international: i0 = 1, canadaLand: c0 = 0, mexicoLand: m0 = 0, status: s0 = 'us', military: mil0 = false, card: k0 = 'none' }: Props) {
  const [status, setStatus] = useState<Status>(s0);
  const [domestic, setDomestic] = useState(d0);
  const [international, setInternational] = useState(i0);
  const [canadaLand, setCanada] = useState(c0);
  const [mexicoLand, setMexico] = useState(m0);
  const [military, setMilitary] = useState(mil0 ? '1' : '0');
  const [card, setCard] = useState<CardKind>(k0);
  const [clearAirport, setClear] = useState<'yes' | 'no' | 'unsure'>('unsure');
  const [passport, setPassport] = useState('1');
  const out = useMemo(() => choose({ status, domestic, international, canadaLand, mexicoLand, military: military === '1', card, clearAirport, passport: passport === '1' }), [status, domestic, international, canadaLand, mexicoLand, military, card, clearAirport, passport]);
  const p = (s: string) => `${idPrefix}-${s}`;
  const usPerson = status === 'us' || status === 'lpr';
  return (
    <div data-chrome className={`not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">Which one should I get?</p>
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <form className="grid min-w-0 grid-cols-1 content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={p('st')} label="You are" value={status} onChange={(x) => setStatus(x as Status)} options={STATUS} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField id={p('dom')} label="Round trips in the US, per year" value={domestic} onChange={(x) => setDomestic(Math.min(300, Math.round(x)))} max={300} tag="en-US" />
            <NumberField id={p('int')} label="Trips abroad by air, per year" value={international} onChange={(x) => setInternational(Math.min(300, Math.round(x)))} max={300} tag="en-US" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField id={p('ca')} label="Land or sea crossings from Canada" value={canadaLand} onChange={(x) => setCanada(Math.min(500, Math.round(x)))} max={500} tag="en-US" help="per year" />
            <NumberField id={p('mx')} label="Land crossings from Mexico" value={mexicoLand} onChange={(x) => setMexico(Math.min(500, Math.round(x)))} max={500} tag="en-US" help="per year" />
          </div>
          <SelectField id={p('card')} label="Fee credit on one of your cards" value={card} onChange={(x) => setCard(x as CardKind)} options={CARDS} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {usPerson ? <Toggle id={p('mil')} label="DoD ID holder?" value={military} onChange={setMilitary} options={[{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]} /> : <span />}
            <Toggle id={p('pp')} label="Valid passport?" value={passport} onChange={setPassport} options={[{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]} />
            <SelectField id={p('clr')} label="CLEAR lanes at home?" value={clearAirport} onChange={(x) => setClear(x as 'yes' | 'no' | 'unsure')} options={[{ value: 'unsure', label: 'Not sure' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
          </div>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">Best fit for the way you fly</p>
          <p className={`mt-1 font-bold text-navy-900 ${out.pick.length > 22 ? 'text-2xl' : 'text-3xl'}`}>{out.pick}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            <tr><td className="py-1.5 pr-3 text-navy-600">Cost per year, after card credits</td><td className="tabular-nums py-1.5 text-right font-semibold text-navy-900">{money(out.perYear)}</td></tr>
            {out.perTrip !== null && <tr><td className="py-1.5 pr-3 text-navy-600">Per round trip</td><td className="tabular-nums py-1.5 text-right text-navy-900">{money(out.perTrip)}</td></tr>}
          </tbody></table>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy-800">{out.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          <table className="mt-4 w-full text-xs"><thead><tr className="text-left text-navy-600"><th className="py-1 pr-2 font-medium">Program</th><th className="py-1 pr-2 font-medium">5 years, you pay</th><th className="py-1 font-medium">Gives</th></tr></thead><tbody className="divide-y divide-navy-200">
            {out.table.map((r) => <tr key={r.program} className={r.eligible ? '' : 'text-navy-400'}><td className="py-1 pr-2">{r.program}</td><td className="tabular-nums py-1 pr-2">{r.eligible ? money(r.fiveYears) : 'not eligible'}</td><td className="py-1">{r.gives}</td></tr>)}
          </tbody></table>
          <p className="mt-2 text-xs text-navy-600">Fees read on tsa.gov, cbp.gov and CLEAR’s price page. You apply only on the official sites: this page is not TSA, CBP or CLEAR.</p>
        </div>
      </div>
    </div>
  );
}
