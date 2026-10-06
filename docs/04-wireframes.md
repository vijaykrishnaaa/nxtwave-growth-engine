# 04 — Wireframes (low-fi, before code)

Figma MCP isn't available in this environment, so the wireframes are text. The built versions can be compared against them on `/system`.

Legend: `[■ Primary]` ink button · `[□ Secondary]` text/outline · `▲` signal playhead · `┄` hairline

---

## 1. Landing `/`  (and `/?ref=CODE`)

```
SIMULATION · Growth challenge prototype · data simulated            Growth console →
────────────────────────────────────────────────────────────────────────────────────
AI Workshop · Free · Live                                 Schedule  Leaderboard  [□ My invites]
┌ (if ?ref) ─ "Vijay from HYD-07 saved you a seat." ─────────────────────────────┐
FREE LIVE WORKSHOP · SUN 18 OCT · 6:00 PM IST
                                                                      ┊  60 MIN · ONLINE
Build an AI project                                                   ┊  For final-year
for your resume. In 60 minutes.        ← H1 = A/B variant             ┊  engineering students
                                                                      ┊  No setup needed
Lede: you leave with a deployed app + GitHub link
[■ Reserve my seat]  [□ See what you'll build ↓]                      ┊  Starts in 12d 04h
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
00 ─┬─┬─┬─┬─ 10 ─┬─┬─┬─ 25 ─┬─┬─┬─ 45 ─┬─┬─ 55 ─ 60          (ruler, ▲ sweeps once)

01 WHAT YOU'LL BUILD     one project, three starting points (pick one in the room)
   ┌ Placement-prep bot ┐ ┌ Resume roaster ┐ ┌ Notes-to-quiz ┐   ← list rows, not cards
02 THE 60 MINUTES         00:00 Set up → 10:00 Pick → 25:00 Wire the model → 45:00 Ship → 55:00 Resume line
03 WHY NOW (final year)   3 short statements, left heading / right text
04 BRING FRIENDS          Register → code → 3 friends → Starter Kit (ruler 0–5)
CLOSE                     Big serif line + [■ Reserve my seat]
```
States: **default** (variant from experiment) · **referred** (invite banner; invalid code → quiet note, still registerable) · **already registered** (CTA becomes "Go to my invites").

## 2. Registration `/register`
```
← Back                                                     SEAT RESERVATION · 1 OF 1
Reserve your seat.                     ┊  What you get
Name ________   Email __________       ┊  · Live 60-min build
WhatsApp (optional, for the link)      ┊  · Starter templates
College _____________________          ┊  · Your project on GitHub
Branch [CSE ▾]   Graduating [2027 ▾]   ┊  Invited by VIJAY20 ✓ (if ref)
[■ Reserve my seat]   takes ~40 seconds; no payment
```
States: **empty** → **inline errors** on blur/submit (field-level, polite live region) → **loading** (button text "Reserving…", inputs disabled) → **duplicate email** error with "Go to my invites" link → **success** (route to /welcome).

## 3. Success `/welcome`
```
              ✓  Seat reserved, Vijay.            (only centred composition in the product)
     Sunday 18 Oct · 6:00 PM IST · link sent to email/WhatsApp
┌──────────── your invite code ─────────────────────────────┐
│  VIJAY20                         [Copy code]              │
│  nxtwave.app/?ref=VIJAY20        [Copy link] [WhatsApp]   │
│  0 ─ 1 ─ 2 ─ ③ Starter Kit ─ 4 ─ ⑤ Project review        │
└───────────────────────────────────────────────────────────┘
[■ Open my invite dashboard]   [□ Add to calendar]
```

## 4. Referral dashboard `/me`
```
Welcome back, Vijay.  You're helping build the next cohort.
┄ 4 successful │ 12 link clicks │ 33% conversion │ #3 at HYD-07 ┄   (KPI strip, hairlines)
Progress: 4 / 5 ─────────────────▲── one more for the project review
Share panel (code, link, WhatsApp)        Activity: "Rahul S. registered · 2h"
```
States: **empty** (0 referrals: "Your link hasn't been opened yet", plus a pre-written WhatsApp message) · **loading** (skeleton rows) · **reward unlocked** (success line + download) · **no session** (prompt to register or view demo student).

## 5. Leaderboard `/leaderboard`
```
SIMULATED DATA · names are fictional
[Students] [Campuses]                                   updated Day 5
01  Ananya R.    HYD-07     12  ███████████
02  Rahul K.     VJA-03     10  █████████
03  Vijay M.  ← you         8   ███████        (row highlighted, moves with FLIP)
```
States: **you not ranked** (sticky "you" row at bottom) · **empty** (before Day 4 launch).

## 6. Analytics `/console`
```
GROWTH CONSOLE · SIMULATED       Day ruler: 1 ─ 2 ─ 3 ─ 4 ─ ▲5 ─ 6 ─ 7
342 / 500 registrations   68.4%   pace: need 79/day   [projection → 524]
┄ CR 14.8% │ CPR ₹25 paid / ₹2.92 blended │ referrals 21.6% │ final-year 81% ┄
Q: Are we on pace?           daily bars + cumulative vs target line
Q: Which channel carries us? channel rows: actual vs target, bar behind label
Q: Where do we lose people?  funnel: visits → started form → registered → shared → referred
```
States: day scrub updates every number (count-up); **future days** shown as projection (hatched/dashed, labelled).

## 7. Experiment `/console/experiment`
```
EXPERIMENT 01 · CONCLUDED DAY 5 · SIMULATED
Hypothesis (serif quote)
A  Learn AI in 60 minutes.                  712   79   11.1%
B  Build an AI project for your resume.     706  117   16.6%   +49% ✓ p=0.003
CI bars · guardrail: share rate · decision: Ship B (done Day 5) · what changed
Live in this browser: your own variant + events
```
Plus **Growth model `/console/model`**: assumption sliders → per-channel output → total vs 500, budget split, 7-day plan.
