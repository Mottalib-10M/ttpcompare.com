#!/usr/bin/env python3
"""Re-reading of the official pages and refresh of the TSA checkpoint numbers (RECETTE §12.1, §17.4).

1. TSA daily checkpoint throughput: reads https://www.tsa.gov/travel/passenger-volumes (current year)
   and /travel/passenger-volumes/<previous year>, and rewrites src/data/tsa-volumes.json. These are
   public numbers of the US government; only the date and the count are kept.
2. Fees and rules: for every sentence of src/data/checks.json, opens the page again and reports the
   sentences that are no longer on it. It never edits params-2026.json: a person reads the change on
   the official page, then edits the figure and `retrieved_at`.

    python3 scripts/update-data.py            # report, and refresh tsa-volumes.json
    python3 scripts/update-data.py --write    # also writes data/official-latest.json (dated trace)

Exit code 2 when a readable page no longer contains its sentence. Pages that refuse automated reading
are listed as "unreadable", not as changed. Until the site has its repository, this script is run by
hand; the monthly workflow (.github/workflows/update-data.yml) takes over once it is pushed.
"""
import datetime, html, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'


def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.read().decode('utf-8', 'replace')
    except Exception:  # noqa: BLE001
        return None


def norm(s):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s))
    s = s.replace(' ', ' ').replace('’', "'").replace('“', '"').replace('”', '"').replace('–', '-').replace('—', '-')
    return re.sub(r'\s+', ' ', s).strip().lower()


def volumes():
    today = datetime.date.today()
    days = {}
    for url in ('https://www.tsa.gov/travel/passenger-volumes', f'https://www.tsa.gov/travel/passenger-volumes/{today.year - 1}'):
        page = fetch(url)
        if not page:
            print(f'  UNREADABLE {url}')
            return False
        for m, d, y, n in re.findall(r'<td[^>]*>\s*(\d{1,2})/(\d{1,2})/(\d{4})\s*</td>\s*<td[^>]*>\s*([\d,]+)\s*</td>', page):
            days[f'{y}-{int(m):02d}-{int(d):02d}'] = int(n.replace(',', ''))
    if len(days) < 300:
        print(f'  TSA volumes: only {len(days)} days read, file left as it is')
        return False
    out = {'_source': 'https://www.tsa.gov/travel/passenger-volumes', 'retrieved_at': today.isoformat(),
           'days': dict(sorted(days.items()))}
    json.dump(out, open(os.path.join(ROOT, 'src/data/tsa-volumes.json'), 'w'), indent=0)
    print(f'  TSA volumes: {len(days)} days, last {max(days)}')
    return True


def main():
    volumes()
    checks = json.load(open(os.path.join(ROOT, 'src/data/checks.json')))
    pages, changed, unreadable, ok = {}, [], [], 0
    for c in checks['checks']:
        if c['url'] not in pages:
            pages[c['url']] = fetch(c['url'])
        txt = pages[c['url']]
        if txt is None:
            unreadable.append(c)
        elif norm(c['quote']) in norm(txt):
            ok += 1
        else:
            changed.append(c)
    print(f'{ok} sentence(s) still on their page · {len(changed)} changed or moved · {len(unreadable)} on unreadable pages')
    for c in changed:
        print(f"  CHANGED  {c['id']}: {c['url']}\n           expected: {c['quote'][:140]}")
    for c in unreadable:
        print(f"  UNREADABLE {c['id']}: {c['url']}")
    if '--write' in sys.argv:
        os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
        json.dump({'run': datetime.date.today().isoformat(), 'ok': ok, 'changed': [c['id'] for c in changed],
                   'unreadable': [c['id'] for c in unreadable]}, open(os.path.join(ROOT, 'data/official-latest.json'), 'w'), indent=1)
    sys.exit(2 if changed else 0)


if __name__ == '__main__':
    main()
