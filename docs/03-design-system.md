# 03 — Design system: "Field Notes"

The source of truth is `src/styles/tokens.css`. This file explains *why* each token exists.

## Colour (every value was contrast-checked, not eyeballed)

| Token | Hex | Job | Contrast |
|---|---|---|---|
| `--paper` | `#F2EFE7` | Page background. Warm off-white so the page reads as print, not glare | — |
| `--surface` | `#FAF8F3` | Raised sheet (forms, the share panel, charts) | — |
| `--sunk` | `#E8E4D9` | Inset wells: inputs, progress track, code chips | — |
| `--ink` | `#161512` | Primary text and **primary buttons** (ink buttons, not coloured ones) | 15.9 : 1 on paper |
| `--ink-2` | `#4A463E` | Secondary text, ledes | 8.2 : 1 |
| `--ink-3` | `#6B665C` | Muted text: captions, axis labels | 5.0 : 1 (AA) |
| `--rule` | `#D6D0C2` | Hairlines. Structure comes from rules, not shadows | decorative |
| `--signal` | `#D9431A` | **The only accent.** Vermilion "red pen": the playhead, progress fill, *you*, live data, focus ring | 3.8 : 1 (non-text OK) |
| `--signal-ink` | `#B3370F` | Signal used **as text** or under white text | 5.3 : 1 / white 6.1 : 1 |
| `--success` | `#2E6A3E` | Reward unlocked, form saved | 5.6 : 1 |
| `--warning` | `#8F5B00` | Pace behind target | 5.0 : 1 |
| `--error` | `#B42318` | Validation | 5.7 : 1 |

**Why no secondary brand colour.** A second colour would compete with the vermilion. Hierarchy comes from ink density (ink → ink-2 → ink-3) instead.

**Chart series** (run through the dataviz validator, all checks pass on `--surface`):
College communities `#3A6FB0` · Referrals `#D9431A` (same as signal, because the referral loop *is* the story) · Paid `#1F8A6E` · Organic `#B08A1E`. Labels always use text tokens, never the series colour.

## Typography

| Role | Face | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Display XL | Newsreader | clamp(52px → 112px) / 0.94 | 400 (italic for the one emphasised phrase) | −0.035em |
| Display L | Newsreader | clamp(36px → 64px) / 1.02 | 400 | −0.025em |
| Heading | Newsreader | clamp(28px → 40px) / 1.1 | 400 | −0.015em |
| Title (UI) | IBM Plex Sans | 20 / 1.3 | 600 | −0.01em |
| Body L | IBM Plex Sans | 19 / 1.5 | 400 | 0 |
| Body | IBM Plex Sans | 16 / 1.55 | 400 | 0 |
| Small | IBM Plex Sans | 14 / 1.45 | 400 / 500 | 0 |
| Eyebrow / caption | IBM Plex Mono | 12 / 1.3, uppercase | 500 | +0.08em |
| Data / code | IBM Plex Mono | 14–15 | 400 / 500 | 0 |
| Hero figure | IBM Plex Sans | clamp(56px → 96px) / 1 | 500 | −0.03em, proportional figures |
| Table numbers | IBM Plex Sans / Mono | 14–15 | 400 | `tabular-nums` |

Rules: Plex Sans uses only 400 / 500 / 600. Serif for the editorial voice (headlines), never for dashboard numbers. Mono for anything a machine produces: codes, links, timestamps, campaign days.

## Spacing (4-based, but only the steps actually used)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144` → `--s-1 … --s-10`

- Section rhythm: 144 desktop / 96 tablet / 64 mobile (`--section`)
- Inside a band: heading → lede 16, lede → content 48
- Inside components: 12 / 16 / 24

## Grid

| | Columns | Max width | Margin | Gutter |
|---|---|---|---|---|
| Desktop ≥1024 | 12 | 1280 | 48 | 24 |
| Tablet 640–1023 | 8 | — | 32 | 20 |
| Mobile <640 | 4 | — | 16 | 16 |

Content is left-aligned on the grid. Centring is reserved for the success moment.

## Shape and depth
- Radius: `--r-1: 2px` (chips, inputs), `--r-2: 6px` (sheets), `--r-pill: 999px` (only toasts and the progress track). Mostly square.
- Shadows: one, `--lift`, used only for floating layers (toast, modal, popover). Sheets sit flat on the page, separated by hairlines.

## Motion
- `--dur-1: 120ms` hover/press · `--dur-2: 200ms` state change · `--dur-3: 420ms` reveal/progress · `--dur-4: 900ms` count-up
- `--ease-out: cubic-bezier(.25,.46,.45,.94)` · `--ease-emph: cubic-bezier(.2,.8,.2,1)`
- Everything respects `prefers-reduced-motion`: transitions collapse to opacity, count-ups jump straight to the final value.

## Signature
**The ruler.** A horizontal scale with minor and major ticks and a vermilion playhead. It shows 00–60 minutes on the landing page, Day 1–7 on the console, and 0–5 referrals in the share panel. One device used three times, so the product and the deck read as one system.
