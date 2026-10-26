import { definePage } from '../../lib/guide-types';
import { busiest, quietest, weekdayAverages, yearTotal, yearDays, VOLUMES_READ, FIRST_DAY, LAST_DAY } from '../../lib/engine/volumes';

export default definePage({
  id: 'tsa-wait-times', group: 'travel', order: 1,
  tool: { kind: 'mini:busy' },
  mini: { kind: 'mini:weekday' },
  related: ['tsa-precheck-vs-global-entry', 'clear-vs-tsa-precheck', 'known-traveler-number', 'tsa-precheck-for-kids', 'home'],
  sources: ['tsa-volumes', 'tsa-mobile', 'cbp-awt', 'tsa-precheck', 'tsa-touchless'],
  en: {
    slug: 'tsa-wait-times', nav: 'TSA wait times', card: 'What TSA and CBP actually publish on waits, how busy checkpoints were on any date, and the busiest days and weekdays.',
    title: 'TSA Wait Times: Official Sources and Busy Days in Numbers',
    description: 'TSA wait times: what MyTSA and CBP publish, the PreCheck figure, and how busy checkpoints were on any date from TSA’s daily numbers. No invented minutes.',
    h1: 'TSA wait times: what is published, and how busy your day is',
    intro: 'Pick a travel date: the tool shows how many people TSA screened that day, or on the same weekday a year earlier.',
    resume: (h) => {
      const T = h.P.precheck;
      return `No official source publishes live, checkpoint-by-checkpoint security wait times for every US airport, and this site does not invent them. What exists is narrower. TSA's MyTSA app shows delay information at airports and how busy an airport is likely to be at a given day and time, based on historical data. CBP's Airport Wait Times site covers the other end of the trip: past processing times for international arrivals, airport by airport. TSA states one figure for its expedited lanes: ${h.pc(T.waitShare)} of PreCheck passengers wait less than ${T.waitMinutes} minutes. And every day TSA publishes the number of people it screened nationwide the day before, which is the best public measure of how crowded checkpoints are. The tool above reads those numbers for your date, or, for a future date, for the same weekday one year earlier, and ranks the day against the rest of its year. The tables below give the busiest days and the average by weekday. Counts are people, not minutes.`;
    },
    faqs: (h) => {
      const T = h.P.precheck, top1 = busiest(Number(LAST_DAY.slice(0, 4)) - 1, 1)[0];
      return [
        { q: 'How long is the TSA PreCheck line?', a: `TSA says ${h.pc(T.waitShare)} of PreCheck passengers wait less than ${T.waitMinutes} minutes. That is a national figure; TSA does not publish it per airport or per hour. PreCheck lanes are not open at every checkpoint at all hours, and TSA’s site lists their schedules by airport. Members still need the indicator on the boarding pass to use the lane at all.` },
        { q: 'Where can I see the current wait at my airport?', a: 'The MyTSA app gives delay information and an estimate of how busy your airport usually is at your day and time, from historical data. Some airports also post their own checkpoint estimates on their websites. For customs on arrival, CBP’s Airport Wait Times site shows past processing times by airport and hour.' },
        { q: 'What is the busiest day of the year at TSA checkpoints?', a: `In ${top1.date.slice(0, 4)}, TSA’s daily numbers put ${h.date(top1.date)} first, with ${h.num(top1.n)} people screened nationwide. Sundays dominate the top of the list, around Thanksgiving and through the summer travel season. The table on this page lists the top days of the last full year. Daily volumes say how crowded the system is, not the wait at your checkpoint.` },
      ];
    },
    body: (h) => {
      const last = LAST_DAY, y = Number(last.slice(0, 4)) - 1;
      const top = busiest(y, 8).map((d) => [h.date(d.date), new Date(`${d.date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }), h.num(d.n)]);
      const low = quietest(y, 3).map((d) => [h.date(d.date), new Date(`${d.date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }), h.num(d.n)]);
      const wk = weekdayAverages(y).sort((a, b) => b.avg - a.avg);
      const n = yearDays(y).length, tot = yearTotal(y);
      return `<h2>The busiest days of ${y}</h2>
${h.table(['Date', 'Weekday', 'People screened'], top, `TSA checkpoint travel numbers, nationwide, ${n} days of ${y}, read on ${h.date(VOLUMES_READ)}.`, ['l', 'l', 'r'])}
<p>TSA screened ${h.num(tot)} people in ${y}, an average of ${h.num(Math.round(tot / n))} a day. The quietest days were these:</p>
${h.table(['Date', 'Weekday', 'People screened'], low, undefined, ['l', 'l', 'r'])}
<h2>Weekdays compared</h2>
<p>Over ${y}, ${wk[0].day} averaged the most people screened, ${h.num(wk[0].avg)}, and ${wk[6].day} the fewest, ${h.num(wk[6].avg)}. Pick a year below to compare.</p>
<!--tool:mini:weekday-->
<h2>What the numbers can and cannot tell you</h2>
<p>A national total says how crowded the system is that day; it does not say how long you will wait at your checkpoint, which depends on the airport, the hour, the lanes open and staffing. A day 20% busier than average at the national level can still be smooth at an airport with few early flights. Use the date tool for the general picture and MyTSA for your airport and hour.</p>
<p>The latest day in the data is ${h.date(last)}. TSA updates its numbers on weekdays; the site rereads them through a scheduled job and shows the reading date under each table.</p>
<h2>Shorter lines through programs</h2>
<p>PreCheck is the only program with an official wait figure. CLEAR+ sends members to the front of the ID check in its lanes at about ${h.P.clear.airports} airports, but publishes no wait time of its own. On return from abroad, Global Entry members use kiosks or touchless portals instead of the passport line; CBP's Airport Wait Times site shows how long that line has been in the past. The ${h.a('home', 'chooser on the home page')} picks the program that fits your trips.</p>
<h2>Reading the date tool</h2>
<p>For a past date, the tool shows TSA's own count for that day and where it ranks in its year: "busier than 90% of days" means only about one day in ten saw more people. For a future date, there is no count yet, so the tool takes the same weekday 52 weeks earlier, which keeps the weekly rhythm of travel, and says so. Holidays that move from year to year, such as Thanksgiving or Easter, can fall on a different week; check the reference date the tool prints. Data run from ${h.date(FIRST_DAY)} to ${h.date(last)}.</p>
<h2>Planning around the busy days</h2>
<p>The figures point to simple habits. Sundays and the days around major holidays are the heaviest at the national level, so allow more time on those dates even with PreCheck. Early morning banks of departures at hub airports concentrate travelers into a short window, which national totals cannot show but MyTSA's historical estimate for your airport and hour can. And lanes for PreCheck members are not open at every checkpoint all day: TSA publishes the PreCheck checkpoint schedule by airport, worth a look before an early flight. If the indicator is missing from your boarding pass, the expedited lane is closed to you whatever the volume, so check it before leaving home; the ${h.a('known-traveler-number', 'Known Traveler Number page')} explains the usual causes.</p>
<h2>Where these numbers come from</h2>
<p>TSA's passenger volumes page lists, for each day, the number of people screened at its checkpoints nationwide. TSA says the numbers are updated Monday through Friday by 9 a.m., and that updates during holiday weeks may be slightly delayed. This site keeps the current and previous year, read by a scheduled job, and changes nothing in them.</p>`;
    },
  },
});
