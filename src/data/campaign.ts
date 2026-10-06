/* ==========================================================================
   Campaign data.
   REAL      → CHALLENGE (the brief's constraints)
   SIMULATED → everything else. Numbers are invented to be internally
               consistent (daily rows sum to funnel totals; paid regs ×
               CPR = spend). They are not NxtWave results.
   ========================================================================== */

export const CHALLENGE = {
  workshop: 'Build Your First AI Project in 60 Minutes',
  target: 500,
  budget: 2000,
  days: 7,
  audience: 'Final-year engineering students',
} as const

export const WORKSHOP = {
  // Sunday 18 Oct 2026, 6:00 PM IST — final day of the 7-day campaign
  startsAt: '2026-10-18T18:00:00+05:30',
  dateLabel: 'Sun 18 Oct',
  timeLabel: '6:00 PM IST',
  length: '60 minutes, live',
  where: 'Online. Link arrives on email and WhatsApp',
} as const

export type ChannelId = 'communities' | 'referrals' | 'paid' | 'organic'

export const CHANNELS: {
  id: ChannelId
  label: string
  short: string
  target: number
  cost: string
  why: string
}[] = [
  {
    id: 'communities',
    label: 'College communities',
    short: 'Communities',
    target: 300,
    cost: '₹0',
    why: 'WhatsApp and Telegram class groups, posted by 15 student ambassadors.',
  },
  {
    id: 'referrals',
    label: 'Referral loop',
    short: 'Referrals',
    target: 120,
    cost: '₹0',
    why: 'Personal codes. 3 friends unlock the Starter Kit.',
  },
  {
    id: 'paid',
    label: 'Paid experiment',
    short: 'Paid',
    target: 80,
    cost: '₹2,000',
    why: 'Instagram ads: ₹1,000 to test two messages, ₹1,000 to scale the winner.',
  },
  {
    id: 'organic',
    label: 'Organic / word of mouth',
    short: 'Organic',
    target: 0,
    cost: '₹0',
    why: 'Not planned for. Counted as upside.',
  },
]

export type Day = {
  day: number
  date: string
  focus: string
  move: string
  visits: number
  formStarts: number
  regs: Record<ChannelId, number>
  sharers: number
  refClicks: number
  newReferrers: number
  spend: number
}

/** SIMULATED daily campaign data. Day 5 is "today" in the console. */
export const DAYS: Day[] = [
  {
    day: 1, date: 'Mon 12 Oct', focus: 'Set up',
    move: 'Page, codes and tracking go live. 15 ambassadors recruited. Soft launch in 2 pilot groups.',
    visits: 140, formStarts: 34, regs: { communities: 14, referrals: 0, paid: 0, organic: 5 },
    sharers: 3, refClicks: 6, newReferrers: 0, spend: 0,
  },
  {
    day: 2, date: 'Tue 13 Oct', focus: 'Distribute',
    move: 'Ambassadors post in ~60 class groups. Placement-cell and coding-club channels.',
    visits: 590, formStarts: 152, regs: { communities: 71, referrals: 5, paid: 0, organic: 6 },
    sharers: 22, refClicks: 48, newReferrers: 4, spend: 0,
  },
  {
    day: 3, date: 'Wed 14 Oct', focus: 'Launch + test',
    move: 'Paid A/B starts, ₹500 per variant. Landing page splits 50/50.',
    visits: 580, formStarts: 158, regs: { communities: 52, referrals: 13, paid: 16, organic: 6 },
    sharers: 27, refClicks: 82, newReferrers: 9, spend: 450,
  },
  {
    day: 4, date: 'Thu 15 Oct', focus: 'Referral push',
    move: '"Invite 3, get the Starter Kit" sent to every registrant. Campus leaderboard opens.',
    visits: 610, formStarts: 166, regs: { communities: 38, referrals: 34, paid: 17, organic: 5 },
    sharers: 41, refClicks: 160, newReferrers: 22, spend: 450,
  },
  {
    day: 5, date: 'Fri 16 Oct', focus: 'Learn',
    move: 'Test read: B wins. B ships to 100%. Community copy rewritten in career framing.',
    visits: 390, formStarts: 100, regs: { communities: 26, referrals: 22, paid: 7, organic: 5 },
    sharers: 25, refClicks: 106, newReferrers: 14, spend: 100,
  },
  {
    day: 6, date: 'Sat 17 Oct', focus: 'Scale',
    move: 'Remaining ₹1,000 goes to Variant B. Second wave in the best-responding groups.',
    visits: 640, formStarts: 174, regs: { communities: 40, referrals: 30, paid: 28, organic: 6 },
    sharers: 38, refClicks: 140, newReferrers: 18, spend: 560,
  },
  {
    day: 7, date: 'Sun 18 Oct', focus: 'Final push',
    move: '"Starts tonight" messages. Nudge everyone 1 referral short of a reward.',
    visits: 520, formStarts: 142, regs: { communities: 36, referrals: 22, paid: 22, organic: 8 },
    sharers: 20, refClicks: 96, newReferrers: 12, spend: 440,
  },
]

export const TODAY = 5

export const dayTotal = (d: Day) =>
  d.regs.communities + d.regs.referrals + d.regs.paid + d.regs.organic

export function cumulative(upTo: number) {
  const rows = DAYS.filter((d) => d.day <= upTo)
  const sum = (f: (d: Day) => number) => rows.reduce((a, d) => a + f(d), 0)
  const regs = {
    communities: sum((d) => d.regs.communities),
    referrals: sum((d) => d.regs.referrals),
    paid: sum((d) => d.regs.paid),
    organic: sum((d) => d.regs.organic),
  }
  const total = regs.communities + regs.referrals + regs.paid + regs.organic
  return {
    regs,
    total,
    visits: sum((d) => d.visits),
    formStarts: sum((d) => d.formStarts),
    sharers: sum((d) => d.sharers),
    refClicks: sum((d) => d.refClicks),
    referrers: sum((d) => d.newReferrers),
    spend: sum((d) => d.spend),
  }
}

/** SIMULATED audience mix of registrants (share of total). */
export const AUDIENCE = {
  finalYear: 0.81,
  branches: [
    { label: 'CSE / IT', share: 0.58 },
    { label: 'ECE / EEE', share: 0.27 },
    { label: 'Mech / Civil / other', share: 0.15 },
  ],
}

/* ---- Experiment 01 (SIMULATED) ----------------------------------------- */

export const EXPERIMENT = {
  id: '01',
  name: 'Message framing',
  hypothesis:
    'Career-oriented messaging will get more registrations than generic learning messaging.',
  window: 'Day 3, 9:00 AM → Day 5, 12:00 PM',
  split: '50 / 50 on all landing traffic. Paid ads match the page they send to.',
  primary: 'Registration rate (registered ÷ unique visitors)',
  variants: {
    A: {
      label: 'A · Learning',
      headline: 'Learn AI in 60 minutes.',
      ad: 'Learn AI in 60 Minutes',
      visitors: 712,
      registrations: 79,
      sharers: 26,
      adSpend: 500,
      adRegs: 15,
    },
    B: {
      label: 'B · Career',
      headline: 'Build an AI project for your resume.',
      ad: 'Build an AI Project for Your Resume',
      visitors: 706,
      registrations: 117,
      sharers: 52,
      adSpend: 500,
      adRegs: 25,
    },
  },
  decision: 'Ship B to 100% of traffic on Day 5. Move the remaining ₹1,000 to B ads.',
}

/* ---- Leaderboard seed (SIMULATED, fictional people, as of Day 5) -------- */

export type Campus = { code: string; city: string; regs: number }

export const CAMPUSES: Campus[] = [
  { code: 'HYD-07', city: 'Hyderabad', regs: 58 },
  { code: 'VJA-03', city: 'Vijayawada', regs: 47 },
  { code: 'WGL-02', city: 'Warangal', regs: 39 },
  { code: 'VSKP-05', city: 'Visakhapatnam', regs: 34 },
  { code: 'GNT-01', city: 'Guntur', regs: 29 },
  { code: 'TPT-04', city: 'Tirupati', regs: 26 },
  { code: 'KNL-02', city: 'Kurnool', regs: 21 },
  { code: 'NLR-01', city: 'Nellore', regs: 18 },
  { code: 'KKD-03', city: 'Kakinada', regs: 15 },
]
export const OTHER_CAMPUSES = { count: 11, regs: 55 }

export type Referrer = { name: string; campus: string; referrals: number; code: string }

export const REFERRERS: Referrer[] = [
  { name: 'Ananya R.', campus: 'HYD-07', referrals: 6, code: 'ANANYA14' },
  { name: 'Rahul K.', campus: 'VJA-03', referrals: 5, code: 'RAHUL31' },
  { name: 'Vijay M.', campus: 'HYD-07', referrals: 4, code: 'VIJAY20' },
  { name: 'Harini V.', campus: 'WGL-02', referrals: 3, code: 'HARINI08' },
  { name: 'Sai Teja P.', campus: 'GNT-01', referrals: 3, code: 'SAITEJ52' },
  { name: 'Mohammed A.', campus: 'HYD-07', referrals: 2, code: 'MOHAMM27' },
  { name: 'Keerthana S.', campus: 'VSKP-05', referrals: 2, code: 'KEERTH63' },
  { name: 'Pranay G.', campus: 'WGL-02', referrals: 2, code: 'PRANAY45' },
  { name: 'Divya N.', campus: 'TPT-04', referrals: 2, code: 'DIVYA19' },
  { name: 'Charan B.', campus: 'VJA-03', referrals: 2, code: 'CHARAN71' },
]
/** The long tail behind the top 10: people → referrals */
export const REFERRER_TAIL = { people: 39, referrals: 43 }

export const DEMO_STUDENT = {
  name: 'Vijay M.',
  firstName: 'Vijay',
  email: 'vijay.demo@example.com',
  college: 'HYD-07 (fictional campus)',
  branch: 'CSE',
  gradYear: '2027',
  code: 'VIJAY20',
  clicks: 12,
  friends: ['Rahul S.', 'Meghana C.', 'Akhil R.', 'Sneha T.'],
}
