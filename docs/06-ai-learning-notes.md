# 06 — AI + Learning notes

> **Before you submit:** these are drafted from how this build actually went. Rewrite them in your own voice, and keep only examples that match your own decisions. The interview will probe them.

Format: **Question to AI → AI suggested → What I changed → Why**

---

### 1. What should the "one working asset" be?
- **Question to AI:** "Plan a campaign to get 500 final-year engineering students to register for a free AI workshop, with ₹2,000 and 7 days. What should I build?"
- **AI suggested:** A conventional landing page: hero, benefits, testimonials, FAQ, registration form.
- **What I changed:** A referral-driven registration system. Register → personal code → one-tap WhatsApp share → the friend lands on a personalised invite → the referrer's progress, reward and rank update. A console measures the whole loop.
- **Why:** The brief itself warns that "everyone might build a landing page". More importantly, a landing page converts traffic but doesn't *create* any. With ₹2,000 you can't buy 500 students (at ~₹25 per registration, that's about 80). The other ~420 have to come from places students already are, and from each other. The loop is the plan. The landing page is just one screen in it.

### 2. Which channels?
- **Question to AI:** "Which acquisition channels should I use?"
- **AI suggested:** Eight or more: Instagram, LinkedIn, YouTube shorts, college clubs, email, WhatsApp, influencers, Reddit, posters.
- **What I changed:** Three, prioritised: college WhatsApp/Telegram communities via 15 ambassadors (300), the referral loop (120), and one paid experiment (80). Each has a stated assumption you can change in the Growth Model screen.
- **Why:** With 7 days and ₹2,000, focus beats coverage. Every extra channel splits attention and can't be measured properly. Communities bring volume, referrals multiply it, and the paid money buys a *learning* (which message wins) rather than a pile of clicks.

### 3. How should it look?
- **Question to AI:** "Design a modern landing page and dashboard for this campaign."
- **AI suggested:** Purple-to-blue gradient hero, glass cards, Inter, a bento grid of stat cards, a "500+ students already joined" counter and three testimonials.
- **What I changed:** A restrained editorial system ("Field Notes"): paper, ink and one vermilion accent. Serif headlines, a mono font for data, hairlines instead of cards. One signature device, a ruler with a playhead, reused for 60 minutes, 7 days and 5 friends. No testimonials, no counters, no fake scarcity. Every simulated number is labelled.
- **Why:** The product should show judgment, not look AI-generated. And the counter and testimonials would have been invented, which is a bad habit for someone whose job will be reporting real numbers.

### Bonus: a catch during the build
- **AI suggested:** "Planned sample: ~928 visitors per arm" on the experiment screen, next to results with only ~710 per arm.
- **What I changed:** Re-sized the test honestly. It's powered for a 50% lift (≈615 per arm), because 7 days only allow ~1,400 test visitors. The screen says so, and says smaller effects would go unseen.
- **Why:** A reviewer would spot an underpowered test that claims significance. Being upfront about the limit is more credible than a tidy number.

---

## The brief's three questions

**What changed between your first idea and the final solution?**
The first idea was a landing page with a registration form. The final version is a growth system: the landing page is one of nine screens, and the real asset is the referral loop plus the console that measures it. The shift came from doing the maths. ₹2,000 buys about 80 registrations, so the plan only works if registrants bring registrants.

**If you had another 24 hours, what would you improve?**
1. A real backend (Supabase) so referrals attribute across devices, not just inside one browser.
2. A WhatsApp bot (n8n + WhatsApp Business API) that sends the code after registering and two reminders: T-24h and T-2h.
3. Track attendance by variant. A headline that wins registrations but loses attendance is a hollow win.
4. Run Experiment 02: show the three projects above the fold, aimed at the biggest funnel drop (visit → form start).

**What did AI suggest that you deliberately rejected, and why?**
Fake social proof: a "500+ students already registered" counter and testimonials. It's the most common landing-page advice, and here it would have been fabricated. I also rejected fake scarcity ("only 12 seats left") because an online workshop has no seat limit. The simulation is honest instead: real constraints are labelled real, and every invented number is stamped "simulated".
