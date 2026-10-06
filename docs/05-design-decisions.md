# 05 — Design decisions (short)

## The direction: "Field Notes"
An engineer's notebook, marked up in red pen. Warm paper (`#F2EFE7`), ink (`#161512`), and one vermilion accent (`#D9431A`) that only ever means *time, progress or you*. The audience is engineering students and the product is about building something, so a print-and-ink feel fits better than a glossy SaaS look.

## Decisions that carry the design
1. **One signature device: the ruler.** Ticks plus a vermilion playhead show 00–60 minutes on the landing page, Day 1–7 in the console, and 0–5 friends in the share panel. The workshop is defined by an hour and the campaign by a week, so the brand device comes straight from the brief.
2. **Type does the hierarchy.** Newsreader (serif) carries the editorial voice in headlines, with one italic phrase per headline. IBM Plex Sans handles UI and every number. Plex Mono is for anything machine-made: codes, links, timestamps, campaign days. Only three weights.
3. **Hairlines, not cards.** Sections open with a 1px ink rule and a numbered mono eyebrow (`02 / The 60 minutes`). Lists and tables do the work. Shadows appear only on things that float (toasts, dialogs).
4. **Ink buttons, not coloured ones.** The primary CTA is black on paper (15.9:1). Vermilion is kept scarce so that when it appears (the playhead, "you" on the leaderboard, the winning variant) it means something.
5. **Every chart answers a named question**, written as its title ("Which channel is carrying us?"), with the answer in a sentence underneath. One hero figure per view. Chart colours went through the dataviz validator, every chart has a Table toggle, and labels use text colours, never series colours.
6. **The A/B test is real in the product.** The landing headline *is* the experiment surface. `?v=a` or Demo controls switch it, and tracked events carry the variant.
7. **Mobile is re-composed, not shrunk.** The minute clock drops away and the steps go full-width. The hero meta becomes a list. KPI strips reflow to 2 columns with rebuilt borders. Leaderboard bars drop out but the numbers stay.
8. **Honesty is designed in, not bolted on.** There's a permanent simulation bar, and "Simulated data" tags look like dashed rubber stamps. A "Live from this browser" strip keeps real events separate from the simulated numbers.

## Motion
120ms hover, 200ms state change, 420ms progress and reveal, 900ms count-up (only when a value changes). Timings were taken from Linear's measured 100–160ms transitions. Everything collapses under `prefers-reduced-motion`. The only scroll-linked element is the minute clock, which helps you follow the steps.

## Accessibility
Semantic landmarks, a skip link, labelled fields with `aria-describedby` errors, and focus moves to the first invalid field. A visible 2px vermilion focus ring, keyboard-operable tabs and day scrubber (arrow keys), and a native `<dialog>` for Demo controls. Contrast was measured, not guessed: muted text is 5.0:1 and input borders are 3.5:1.

## Deliberately rejected
| Rejected | Why |
|---|---|
| Purple/blue gradient hero, glassmorphism | The fastest tell of an AI-generated page, and it says nothing about this workshop. Google Stitch's own landing page is exactly this look |
| Bento grid of 8 stat cards | Every number would look equally important. Replaced with one hero figure and question-led charts |
| Testimonials, "500+ already joined", partner logos | They would be invented. Nothing here is fabricated, and simulated numbers say so |
| "Only 12 seats left" scarcity | An online workshop has no seat limit. The countdown is to a real date instead |
| Serif hero numbers on the dashboard | Tried it. The dataviz guidance is right that display serifs on figures read as decoration. Numbers are in the sans |
| Scroll-jacked hero zoom (seen on Scrolltide) | Spectacular, but it slows reading. Motion is limited to things that changed state |
| A chart library's default look | Hand-built SVG to control mark specs (24px bars, 2px gaps, hatched projections) |
| A separate dark-mode dashboard | Tempting ("control room"), but it would split the identity in two. One paper system for the product and the deck |
