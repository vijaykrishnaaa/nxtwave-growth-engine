# 08 — Growth assumptions (and what would break them)

All of these are **TARGET / ASSUMPTION**, not observed results. Each one is a slider on `/console/model`.

| Assumption | Value | Why it's plausible | What would break it | Fallback |
|---|---|---|---|---|
| Colleges with an ambassador | 20 | 15 ambassadors, some covering 2 colleges, recruited from coding clubs and class reps on Day 1 | Ambassadors don't post | Pay in status they care about: certificate, LinkedIn recommendation, first access |
| Groups per college × members | 3 × 250 | Class, branch and placement or coding-club groups are typically a few hundred each | Groups are muted or saturated | Second wave on Day 6 with new (winning) copy |
| Members who open the link | 13% | A classmate's message in a group they read, not an ad | Message fatigue (shows as the Day 2 → Day 5 decline) | New copy, a personal forward instead of a broadcast |
| Warm visit → register | 15.5% | Free, 60 min, clear outcome, 6-field form | A form that feels long or asks for payment | Experiment 02 (projects above the fold), progressive fields |
| Cost per click | ₹2.50 | Broad student targeting in India | Competitive season pushes it to ₹4–5 | **Weakest assumption.** If CPR doubles, paid gives 40, so add 3 colleges (+45) rather than more money |
| Paid visit → register | 10% | Cold traffic converts lower than warm | Mismatch between ad and page | Message match: ad A → page A, ad B → page B |
| Share rate | 40% | Shown a reward at the moment of registering, with one-tap WhatsApp | The reward isn't valued | Starter Kit is concrete and immediate. Campus leaderboard adds pride |
| Friends per sharer | 0.8 | Friends attend workshops together | Sharing goes to people who aren't final-year | Pre-written message names the audience |
| Viral factor k | 0.32 | 0.4 × 0.8 | — | First-order only. Friends-of-friends are left out to stay conservative |

**Totals:** 302 + 80 + 122 = **≈505** in the base scenario. Conservative ≈ 215 and ambitious ≈ 867 are both available as presets, so it's visible how sensitive the plan is.

**Simulated outcome vs plan:** the simulated campaign finishes at 534 (communities under plan at 277, referrals and paid over plan, organic +41). Communities underperforming while referrals overperform is the story the console tells, and it's why Day 6 shifts effort.

**What isn't modelled:** attendance. A typical free-webinar show-up rate is well under 100%. It comes after this brief's success metric (registrations), and it's the first thing I'd instrument next.
