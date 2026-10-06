# 06 — AI + Learning notes

## Quick view: 3 examples (Prompt → AI output → What I changed/rejected → Final output)

| # | Prompt | AI output | What I changed / rejected | Final output |
|---|---|---|---|---|
| 1 | "Build a small growth system, not just a landing page — registration, referral tracking, a referral dashboard, leaderboard, analytics, an A/B test view." | Proposed personal referral codes, one-tap WhatsApp sharing, a reward at 3 friends, and a campus leaderboard, inside a 9-screen product with a growth console. | Rejected building a real backend for a 48-hour prototype (overkill); kept referral tracking local to one browser, and documented that gap as the #1 next step instead of hiding it. | Working referral loop + console, with its one real limitation stated up front, not glossed over. |
| 2 | "Design this without looking AI-generated — no gradients, glassmorphism, bento grids, fake testimonials or fake stats. Research the reference sites first, then build an original system." | Proposed "Field Notes": paper and ink with one accent colour, serif headlines, hairlines instead of cards, one signature ruler device reused across the product. | Rejected the purple-glow look Google Stitch's own landing page uses — the exact aesthetic I'd asked to avoid — and kept it only as a visual "don't do this" reference, not a template. | A single, original design system used consistently across the product and the 5-slide deck. |
| 3 | "Review the Experiment screen for consistency against the actual simulated numbers on it." | First draft stated a planned sample size (~928 visitors/arm) that didn't match the simulated results shown on the same screen (~710/arm) — a real inconsistency. | Rejected the mismatched number. Recalculated the planned sample size honestly, for the lift size actually detectable in a 7-day test window (~615/arm), and had the screen say so explicitly. | An experiment screen that doesn't overstate its own statistical power. |

---

> **A note on how this was actually built, so these notes are defensible in an interview:** this was built in one extended session with Claude Code (Anthropic's AI coding tool). I didn't have a series of small back-and-forth chats where the AI proposed something generic and I corrected it after the fact. Instead I wrote one detailed upfront brief that already *named* the generic AI patterns (purple gradients, glassmorphism, bento cards, fake testimonials) and ruled them out before any output existed. That's a different shape of judgment — prevention instead of correction — and it's the honest one. Below, each example says which kind it is. **Rewrite the wording in your own voice before submitting; keep only what you can actually explain in an interview.**

---

### 1. Defining the one working asset (preempted, in my prompt)
I didn't ask "what should I build" and get a landing page back. I specified the system myself: a registration flow that issues a referral code, feeds a referral dashboard, a leaderboard, campaign analytics, and an A/B experiment view — not just a landing page.
- **Why I specified it that way, not left it to the AI:** the brief itself flags that "everyone might build a landing page." More importantly, the arithmetic doesn't work otherwise. At realistic student-ad costs (~₹25 per registration), ₹2,000 buys about 80 registrations. A landing page converts traffic; it doesn't create any. The other ~420 have to come from places students already are, and from each other — which means the referral loop isn't a nice-to-have feature, it's the plan.
- **Where the AI's judgment actually showed up:** within that brief, Claude chose the specific mechanics — personal codes, one-tap WhatsApp sharing, a reward at 3 friends, campus leaderboard — and I accepted that shape because it matches how students already behave (they attend workshops in groups and already live in class WhatsApp groups).

### 2. Channel count (preempted, in my prompt)
I capped it at three channels myself: college communities via ambassadors, the referral loop, and one paid experiment — rather than asking generically and trimming a longer list afterward.
- **Why:** the brief says "prioritise, don't give us 20 ideas," and with 7 days and ₹2,000, more channels means less signal in each one. Communities bring volume, referrals multiply it, and the paid spend buys a *learning* (which message converts) rather than a pile of untracked clicks.
- **What I'd still want to check with an interviewer:** whether 20 colleges × 3 groups is realistic for one intern to actually recruit ambassadors for in week one — that number is my biggest assumption, not something I'd state as fact.

### 3. Visual direction (genuinely preemptive rejection)
- **What an unconstrained AI build defaults to, and how I know:** ask any current AI model for "a modern landing page and dashboard" with no further steering, and it reaches for the same small set of patterns — purple-to-blue gradients, glassmorphism, Inter, a bento grid of stat cards, a counter claiming adoption, a row of testimonials. It's a known, common default, not a one-off suggestion I happened to get.
- **What I ruled out before the build started, and told the AI explicitly not to do:** all of the above, plus fake scarcity ("only 12 seats left"). I asked for an original, restrained editorial system instead — the result is "Field Notes": paper and ink with one accent colour, serif headlines, a mono font for data, hairlines instead of cards, and one signature device (a ruler with a playhead) reused for the 60-minute hour, the 7-day campaign and the 5-friend referral progress.
- **Why this mattered to me specifically:** the product is meant to demonstrate judgment, not just output. Fake counters and testimonials would also have been fabricated data, which is exactly the habit I don't want in a role that reports real growth numbers.

### 4. A real catch during the build (this one actually happened, mid-session)
While reviewing the finished Experiment screen, the "planned sample size" text said the test was designed for ≈928 visitors per arm — but the actual simulated results only reached ~710 per arm. That inconsistency would have undermined the statistics on the page: a test can't claim a result if it wasn't actually powered to detect it.
- **What changed:** the planned-sample calculation was corrected to match reality — sized for a 50% relative lift (≈615/arm, achievable in a 7-day window with ~1,400 total test visitors) — and the screen now says explicitly that a smaller effect would have gone undetected.
- **Why it's worth including:** it's a genuine example of asking for review against a visible, checkable detail (does the stated test size match the test actually run), not a cosmetic note. A careless build would have shipped the mismatch.

---

## The brief's three questions

**What changed between your first idea and the final solution?**
The very first framing — before I wrote the detailed brief — was "build a registration landing page." Working through the ₹2,000 budget arithmetic is what changed it: that money buys roughly 80 registrations, nowhere near 500, so the only way to hit the target is to make every registrant a channel for the next one. The final asset is a referral loop with its own measurement console; the landing page is one of nine screens, not the whole product.

**If you had another 24 hours, what would you improve?**
1. A real backend (e.g. Supabase) so a referral attributes across devices, not just inside one browser — right now the prototype's referral tracking is local to whoever's browser registered.
2. A WhatsApp bot (n8n + WhatsApp Business API) that actually sends the code after registering and two reminders (T-24h, T-2h).
3. Track attendance by A/B variant, not just registrations — a headline that wins registrations but loses attendance would be a hollow win, and that's not measured yet.
4. Run the next experiment already queued in the console (`Experiment 02`): show the three example projects above the fold, aimed at the funnel's biggest drop (visit → form start).

**What did AI suggest that you deliberately rejected, and why?**
The pattern I ruled out before any output existed, specifically because I expected it by default: fake social proof — a "500+ students already registered" counter and testimonials — and fake scarcity ("only 12 seats left"). Both are common in landing-page advice, and both would have been fabricated here. Every number that's actually invented for the prototype is labelled "simulated" instead, visible throughout the product, because the challenge is explicit that this is a simulation and I didn't want that line to blur.
