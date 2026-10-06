# 01 — Strategy

> **What's real and what's simulated**
> REAL: the challenge constraints (500 registrations, ₹2,000, 7 days, final-year engineering students, the workshop title).
> SIMULATED: every registration, click, referral, leaderboard entry and experiment result in the product. Channel targets are **assumptions**, not results.

## The student

**Who exactly.** Final-year B.Tech / BE students (2027 batch) at tier-2 and tier-3 engineering colleges, mostly CSE / IT / ECE, plus non-CS branches who want a software job. It's October, so they're in the middle of placement season.

**What they're dealing with right now**
- Placement drives are running, and AI shows up in nearly every job description.
- Their resume has a mini-project and a college assignment on it. Nothing with AI.
- They've watched "learn AI" videos and finished none of them. "Learning AI" sounds like a three-month commitment they can't make right now.
- They spend their day in WhatsApp class groups. That's where announcements, drive updates and links travel.

**The insight.** *They don't want to learn AI. They want one AI project they can put on their resume and explain in an interview.* "60 minutes" makes it believable. "Your first project" makes it safe for a beginner. "For your resume" is what makes it urgent.

**What makes them register**
1. A concrete output: a deployed project and a GitHub link by the end of the hour.
2. Low cost: free, 60 minutes, Sunday evening, no setup beforehand.
3. Peer proof: a friend sent the link, or their campus is climbing the leaderboard.
4. A reason to act now: the workshop has a date, and the referral reward is time-bound.

## Growth hypothesis

> Framing the workshop around a career outcome ("an AI project for your resume") will convert better than a learning outcome ("learn AI"). Giving each registrant a personal referral link will add about 30% more registrations on top of the direct channels, at ₹0 marginal cost.

## The loop (what the product implements)

```
ACQUIRE ──► LAND ──► REGISTER ──► GET CODE ──► SHARE ──► FRIEND LANDS (personalised) ─┐
   ▲                                                                                   │
   └───────────────────────────── more registrations ◄─────────────────────────────────┘
                     MEASURE (events) ──► LEARN (A/B) ──► SCALE (ship winner, move ₹)
```

## Three channels, prioritised

| # | Channel | Target (assumption) | Cost | Why it should work |
|---|---|---|---|---|
| 1 | **Campus WhatsApp / Telegram communities** via ~15 student ambassadors (class reps, coding-club leads) | **300** | ₹0 | Final-years already live in these groups. A message from a classmate gets opened far more than an ad. Ambassadors are paid in status and rewards, not cash. |
| 2 | **Referral loop** (personal code → starter kit at 3, project review at 5) | **120** | ₹0 | Rewards are digital and cost nothing to give. Friends tend to attend workshops together, so the referral matches how students already decide. |
| 3 | **One paid experiment**: Instagram ads, two messages | **80** | ₹2,000 | It's the one channel where money buys a *learning*: which message wins. Run ₹1,000 as the A/B test, then put the other ₹1,000 behind the winner. |
| | **Total** | **500** | **₹2,000** | Organic and word of mouth count as upside, not plan. |

**Why only three.** With ₹2,000 and 7 days, every extra channel splits attention. Communities bring volume, referrals multiply it, and paid tells us which message to use everywhere.

### The model behind the numbers
- **Communities:** 20 colleges × 3 groups × 250 members = 15,000 reached → 13% click → 1,950 visits → 15.5% register = **≈302**
- **Paid:** ₹2,000 ÷ ₹2.50 CPC = 800 clicks → 10% register = **80** (CPR ₹25, the weakest assumption)
- **Referrals:** 382 direct registrants × 40% share × 0.8 successful referrals each = **≈122** (k ≈ 0.32; second-order referrals left out to stay conservative)

**If assumptions break.** If paid CPR comes in at ₹50 instead of ₹25, paid brings 40 rather than 80. The fix is not more money. It's 3 more colleges (+45) on Day 6 and a referral nudge. The Growth Model screen shows this live.

## Budget: ₹2,000

| When | Spend | Purpose |
|---|---|---|
| Day 3–5 (noon) | ₹500 Variant A + ₹500 Variant B | Message test (ad → matching landing page) |
| Day 6–7 | ₹1,000 on the winner | Scale what worked |
| Communities, referrals, rewards | ₹0 | Ambassadors volunteer for a certificate, a LinkedIn shout-out and first access. Rewards are digital. |

## 7-day plan

| Day | Focus | Main move | What we measure |
|---|---|---|---|
| 1 | Set up | Ship the page, codes and tracking. Recruit 15 ambassadors. Soft-launch in 2 pilot groups. | Does the funnel work end to end? |
| 2 | Distribution | Ambassador messages go out across ~60 groups. Placement-cell and coding-club posts. | Visits and registrations per campus |
| 3 | Launch + test | Paid A/B starts (₹500 / ₹500). Landing page splits 50/50. | Conversion rate by variant |
| 4 | Referral push | "Invite 3 → Starter Kit" message to every registrant. Campus leaderboard goes live. | Share rate, k-factor |
| 5 | Learn | Read the test. Ship the winner to 100% and rewrite community copy in its framing. | Lift, significance |
| 6 | Scale | ₹1,000 behind the winner. Second wave in the groups that responded best. | Cost per registration |
| 7 | Final push | "Starts tonight" messages, leaderboard finale, last nudge to near-reward referrers. | Final count vs 500 |
