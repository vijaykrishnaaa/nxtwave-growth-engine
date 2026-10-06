# 02 — Private reference board

Every site below was opened in a browser during this session (6 Oct 2026). Typography values were read from computed styles, not recalled.

**Access notes, stated plainly**
- **Mobbin:** the homepage loaded. The screen library (`/explore/web/screens`) returned **403 Forbidden** (bot protection). I did **not** browse Mobbin flows, so none of the patterns below are credited to Mobbin.
- **Google Stitch:** only the landing page. Generating designs needs a Google sign-in, which I didn't do. Stitch is used here as an *anti*-reference.
- **Figma MCP:** not connected in this environment. Wireframes and the design system live in `docs/04-wireframes.md` and the in-app `/system` page instead. Nothing was done in Figma.

---

## Typography (3)

| # | Reference | Observed | What makes it good | What I take |
|---|---|---|---|---|
| T1 | **Apple HIG: Typography** (developer.apple.com/design/human-interface-guidelines/typography) | Rules: minimise typefaces; build hierarchy with weight, size and colour; avoid Ultralight/Thin/Light at small sizes | Hierarchy comes from *contrast between a few styles*, not from many fonts | Max 3 roles (display / text / data), 3 weights in the text face, no light weights |
| T2 | **21st.dev hero** | Sans "General Sans" 500 at 63px with one word set in italic serif ("*living*", Averia Serif 500, 69px), tracking −1.4px | One italic serif word inside a grotesk line gives a voice without decoration | One emphasised word per headline, but **I reverse it**: serif display is the base and the emphasis is italic in the same serif |
| T3 | **Linear** | Inter Variable at weight **510** (not 500/600), 56/61.6px, tracking −0.022em; H2 is two-tone: bright first clause, grey continuation | Two-tone headings carry title and subtitle in one line. A non-default weight looks deliberate | Two-tone section heads (ink + ink-3); tight negative tracking on display sizes only |

## Layout (3)

| # | Reference | Observed | What makes it good | What I take |
|---|---|---|---|---|
| L1 | **Scrolltide** | Each band opens with a mono uppercase count eyebrow ("111 TEMPLATES IN THE LIBRARY", "THE WORKFLOW 01 / 03"), then H2, then a one-sentence lede | The eyebrow tells you *how much* before *what*. Very fast to scan | Mono eyebrows with a number in them: timestamps (`00:00 — 10:00`) on the landing page, campaign day on the console |
| L2 | **Apple Developer: Design** | Global nav, then a local sub-nav bar (section name left, page tabs right), then a single centred statement | Two nav levels that don't compete: global is tiny, local is where you work | Simulation bar (global, tiny) above the product nav (local) |
| L3 | **Linear homepage** | Left-aligned content column, big gap between sections, grey lede next to the heading | Asymmetry gives the page a reading line instead of centring everything | Left-aligned 12-column compositions; the hero sits on columns 1–8 and the meta on 9–12 |

## Interaction / motion (3)

| # | Reference | Observed | What makes it good | What I take |
|---|---|---|---|---|
| M1 | **Linear** | Hover transitions are **100–160ms**, `cubic-bezier(0.25, 0.46, 0.45, 0.94)` on colour, background, border and transform | Feedback lands before you notice the wait | `--dur-1: 120ms`, `--dur-2: 200ms`, `--ease-out: cubic-bezier(.25,.46,.45,.94)` |
| M2 | **21st.dev: "Number Flow"** (Maxwell Barvian) | Digits roll individually when a value changes | Shows *that* the number changed and in which direction | Count-up on referral and registration numbers only when the value changes. Never on first paint |
| M3 | **Scrolltide** | Scroll-driven zoom from hero into the library grid | Spectacular, but it hijacks reading and was mid-transition when captured | **Cautionary.** No scroll-jacking. Scroll-linked motion only on the 60-minute timeline playhead, where it helps you follow the steps |

## Components (3)

| # | Reference | Observed | What makes it good | What I take |
|---|---|---|---|---|
| C1 | **21st.dev: Sonner toast** (shadcn) | Small dark pill at the bottom, one line, optional action, stacks | Confirms without interrupting, and the action sits next to the message | Ink toast, bottom-left, 1 line, auto-dismiss 2.4s ("Link copied") |
| C2 | **21st.dev: Invoice History table** | Dense rows, right-aligned numbers, small status chips, hairline separators | Rows and alignment do the work. No cards | Leaderboard and experiment tables are real `<table>`s with tabular numerals |
| C3 | **Google Stitch: prompt composer** | One large input as the hero, with mode chips below | The page *is* the action | Registration as a single focused sheet. Rejected Stitch's purple glow background as the very AI aesthetic to avoid |

## Dashboards (2)

| # | Reference | Observed | What makes it good | What I take |
|---|---|---|---|---|
| D1 | **Plausible live demo** (plausible.io/plausible.io) | A KPI strip in one row, separated by hairlines, where **each KPI is also the tab that switches the chart**. Source lists put a proportional bar *behind* the label ("Direct / None 49%") | No card soup, and the list doubles as the bar chart | KPI strip with hairlines. Channel list with the bar behind the label |
| D2 | **21st.dev: dashboard category** (Stats Bento, Stats cards, SaaS template) | Rounded cards with a big number, a delta and a sparkline, repeated 4–8 times | **Cautionary.** It's the generic dashboard everyone builds. Every tile looks equally important | One hero figure per view (registrations vs 500). Everything else sits below it, and every chart answers a named question |

---

## What I synthesised (not copied)

1. **A notebook, not a SaaS app.** Warm paper, ink and one vermilion "marker" colour, like an engineer's notebook marked up in red pen. This came from rejecting D2 and C3's backdrop rather than from any one site.
2. **Time as the main visual device.** The workshop is defined by 60 minutes and the campaign by 7 days. Both get a ruler with tick marks and a vermilion playhead. It's the product's own signature.
3. **Hierarchy through type, not boxes.** Serif display (Newsreader) for the editorial voice, IBM Plex Sans for UI and figures, IBM Plex Mono for data, codes and timestamps. Hairline rules instead of cards.
4. **Motion only where something changed:** a number changed, progress moved, a rank shifted. Timings follow M1.
