# Growth Engine: The 60-Minute Build

A working growth system for the NxtWave Growth Intern challenge: get **500 final-year engineering students** to register for the free workshop *"Build Your First AI Project in 60 Minutes"* with **₹2,000** in **7 days**.

It isn't a landing page. It's the whole loop:

```
ACQUIRE → LAND → REGISTER → GET CODE → SHARE → FRIEND LANDS (personalised) → REGISTER …
                       └──────── MEASURE → LEARN (A/B) → SCALE ────────┘
```

> **Real vs simulated.** REAL: the challenge constraints. SIMULATED: every registration, referral, leaderboard entry, funnel number and experiment result. They're labelled in the product with a permanent simulation bar and dashed "Simulated" stamps. People and campuses are fictional. This is a prototype, not an official NxtWave page.

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. Production build: `npm run build` (output in `dist/`).

**Deploy** (pick one; SPA rewrites are already configured):
- Vercel: `npx vercel` (uses `vercel.json`)
- Netlify: drag `dist/` into app.netlify.com/drop (uses `public/_redirects`)

## Screens

| Route | Screen | What to try |
|---|---|---|
| `/` | Landing page | The headline is the live A/B variant (`/?v=a` shows A). Scroll "The 60 minutes" and the clock follows you. |
| `/?ref=VIJAY20` | Referred landing page | Personal invite banner. Unknown codes fail gracefully. |
| `/register` | Registration | Submit empty: inline errors, focus moves to the first one. Duplicate email → recovery link. |
| `/welcome` | Success | Code, link, copy / WhatsApp share, reward progress, add to calendar (.ics). |
| `/me` | Referral dashboard | KPIs, reward unlocks, activity feed. Empty state if no referrals yet. |
| `/leaderboard` | Leaderboard | Students / campuses. Your row is highlighted, or pinned at the bottom if you're unranked. |
| `/console` | Growth analytics | Day scrubber (Day 1–7), pace vs 500, channels vs target, funnel, audience, live events. |
| `/console/experiment` | A/B experiment | Lift, p-value and CIs computed from the counts, guardrail metric, decision log. |
| `/console/model` | Growth model & plan | Assumption sliders → total vs 500. Budget split, 7-day plan, experiment backlog. |
| `/system` | Design system | Tokens, type, components, wireframes, states, rejected ideas. |
| `/deck` | 5-slide growth plan | ← → to navigate. `/deck?print` shows all slides. |

**Demo controls** (bottom-right button): load the demo student *Vijay M.* (4 referrals from 12 clicks), simulate link clicks and friends registering, switch the landing variant, switch between local users, reset.

### 60-second walkthrough
1. `/`: read the hero, click **Reserve my seat**, register.
2. On `/welcome`, click **Copy link**, then **Demo controls → Simulate friend joining** three times. Watch the count, then the Starter Kit unlock.
3. `/leaderboard`: you've climbed the board.
4. `/console`: scrub Day 1 → 7, then look at **Live from this browser** at the bottom.
5. `/console/experiment` → `/console/model`: drag CPC to ₹5 and read the fallback.

## How it works
- **React 18 + TypeScript + Vite.** Plain CSS with design tokens (`src/styles/tokens.css`). No Tailwind. Charts are hand-built SVG.
- **Store** (`src/lib/store.ts`): registrants, session, and an event log in `localStorage` (try/catch guarded), shared across tabs through `useSyncExternalStore`. Referral attribution, code generation (`FIRSTNAME`+2 digits, unique) and tracking all run here.
- **Events tracked:** `visit`, `cta_click`, `form_start`, `register`, `share_copy_link`, `share_copy_code`, `share_whatsapp`, `ref_visit`. Each one carries the variant shown.
- **Stats** (`src/lib/stats.ts`): two-proportion z-test, Wilson intervals, sample-size calculation.
- **Model** (`src/lib/model.ts`): the 500-registration model behind the sliders.
- **Data** (`src/data/campaign.ts`): the simulated campaign. It's internally consistent: daily rows sum to the funnel, and paid registrations × CPR = spend.

**Limitation (deliberate, for a 48-hour prototype):** data lives in one browser, so a referral only attributes when the friend registers in the same browser. The next step is a real backend (Supabase) plus a WhatsApp bot. See `docs/06`.

## Checks
- `node scripts/e2e.mjs`: end-to-end loop test (validation, focus, code generation, invite banner, attribution, duplicate email, dashboard, leaderboard, variant preview, live stats). **14/14 pass.**
- `node scripts/shoot.mjs <route> 320,375,768,1024,1280 <dir>`: full-page screenshots plus a horizontal-overflow check. All routes pass at 320–1440.
- Accessibility: semantic landmarks, skip link, labelled fields with described errors, visible focus, keyboard tabs and day scrubber, `prefers-reduced-motion` honoured, contrast measured (muted text 5.0:1, control borders 3.5:1).

## Deliverables

| | File |
|---|---|
| A. Working prototype | this repo (`npm run dev`) |
| B. Design system & wireframes | `/system`, `docs/02-reference-board.md`, `docs/03-design-system.md`, `docs/04-wireframes.md` |
| C. Growth plan, 5 slides | `deliverables/Growth-Plan.pdf`, `deliverables/Growth-Plan.pptx`, `/deck` |
| D. AI + learning notes | `docs/06-ai-learning-notes.md` |
| E. 3-minute video script | `docs/07-video-script.md` |
| F. README | this file |
| G. Design decisions | `docs/05-design-decisions.md` |
| H. Growth assumptions | `docs/01-strategy.md`, `docs/08-growth-assumptions.md` |
| I. What was rejected | `docs/05-design-decisions.md` (table), `/system` §08 |

Regenerate the deck after changes (dev server running): `node scripts/deck-shots.mjs && node scripts/deck-export.mjs`.

## Honesty notes
- No Figma MCP was available, so nothing was made in Figma. The wireframes were written first as text and are redrawn in `/system`.
- Mobbin's screen library returned 403 and Google Stitch needs a sign-in. Neither is credited with patterns I didn't actually see. See `docs/02-reference-board.md`.
- No testimonials, logos or "already registered" counters: they would have been invented.
