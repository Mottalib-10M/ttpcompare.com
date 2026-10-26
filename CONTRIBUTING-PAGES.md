# Adding or editing a page

One page = one file `src/content/pages/<id>.ts` exporting `definePage({...})` (types in `src/lib/guide-types.ts`).
The file name must equal `id`, and the id must be listed in `PLANNED` (`src/lib/helpers.ts`). The page is built at
`/en/<en.slug>/`; menus, footer, home lists, llms.txt and sitemap follow. English only (en-US spelling).

## Fields

- `group`: `choose`, `cost`, `apply`, `renew` or `travel`; `order`: position in its group.
- `tool`: the main tool, right under the H1 (first screen, RECETTE §5):
  - `{ kind: 'chooser', props?: { domestic, international, canadaLand, mexicoLand, status, military, card } }`
  - `{ kind: 'cost', props?: { program: 'precheck'|'globalEntry'|'nexus'|'sentri'|'clear'|'clearPrecheck', credit, adults, kids } }`
  - `{ kind: 'renewal', props?: { program } }` (calendar file made in the browser), `{ kind: 'checklist', props?: { route } }`
    (routes in `src/data/checklists.ts`), `{ kind: 'ktn' }`
  - `{ kind: 'mini:<spec>' }`, specs in `src/lib/mini-specs.ts`, always computed by `src/lib/engine/ttp.ts` or `volumes.ts`.
- `mini`: a second tool under the citable block. In a body, `<!--tool:mini:gap-->` or
  `<!--tool:checklist|{"route":"ge-eoa"}-->` places one.
- `related`: 3–5 page ids (or `home`). `sources`: keys of `src/data/params-2026.json` → `sources`.

## Text rules (checked by `npx vitest run tests/pages.test.ts`, then `npm run check`)

- `title` 50–60 characters, key term first ("Global Entry Cost …", "TSA PreCheck vs Global Entry …"), never a question
  word, a country or "Calculator" first. `description` 150–160 characters.
- `resume(h)`: ONE paragraph of at least 120 words answering the page's query with figures.
- `faqs(h)`: 3–5 questions unique across the site, answers 42–88 words, plain text.
- `body(h)`: HTML with at least three `<h2>`; resume + body at least 650 words. No `<h1>`, no em dash.
- Card issuers are named as facts with the date read, never with an offer link or an "apply" button.
- Never present the site as TSA, CBP, CBSA, DHS or CLEAR, never imitate an application form, never invent a wait time
  or a processing time that no official source publishes: say that no figure exists.

## Figures

Never type a fee, a duration or a count: read it through `h` (`src/lib/helpers.ts`): `h.P` (params), `h.provider(id)`,
`h.cheapestEnroll()`, `h.cheapestRenewal()`, `h.EOA` (Enrollment on Arrival airports), `h.m`, `h.num`, `h.pc`, `h.date`,
`h.read` (reading date), `h.table`, `h.a(id, text)` for internal links, `h.src(key, text)` for a source link.

## Data

- `src/data/params-2026.json`: every fee, duration and rule, with `sources` (official pages) and `retrieved_at`.
- `src/data/eoa-airports.json`: the CBP Enrollment on Arrival list, with the date read and the page's own date.
- `src/data/tsa-volumes.json`: TSA daily checkpoint numbers (current and previous year), rewritten by
  `scripts/update-data.py`.
- `src/data/checks.json`: one verbatim sentence per figure; `scripts/update-data.py` re-reads every page monthly
  (workflow `.github/workflows/update-data.yml`, exit code 2 on a change). Copies of official pages go to
  `data/textes-sources/` (git-ignored), never into `public/`.
