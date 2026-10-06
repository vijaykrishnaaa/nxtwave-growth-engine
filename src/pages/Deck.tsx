import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CHANNELS, DAYS, EXPERIMENT } from '../data/campaign'
import { useDocumentTitle } from '../lib/hooks'
import { pct } from '../lib/format'
import { twoProportion } from '../lib/stats'

const W = 1600
const H = 900

/* ---- Shared slide chrome ----------------------------------------------- */

function Slide({ n, kicker, children, sim }: { n: number; kicker: string; children: ReactNode; sim?: string }) {
  return (
    <section className="slide" aria-label={`Slide ${n}: ${kicker}`}>
      <header className="slide__top">
        <span className="slide__kicker t-mono">
          <b>0{n}</b> / 05 · {kicker}
        </span>
        <span className="slide__brand t-mono">Growth plan · Build Your First AI Project in 60 Minutes</span>
      </header>
      <div className="slide__body">{children}</div>
      <footer className="slide__foot t-mono">
        <span>{sim ?? 'Real: 500 registrations · ₹2,000 · 7 days · final-year engineering students'}</span>
        <MiniRuler n={n} />
      </footer>
    </section>
  )
}

function MiniRuler({ n }: { n: number }) {
  return (
    <svg width="120" height="14" viewBox="0 0 120 14" aria-hidden="true">
      <path d="M0 13.5h120" stroke="var(--ink)" />
      {[0, 30, 60, 90, 120].map((x) => (
        <path key={x} d={`M${Math.min(x, 119.5) + 0.5} 13V5`} stroke="var(--ink)" />
      ))}
      <path d={`M${(n - 1) * 30 - 4} 0h8l-4 5z`} fill="var(--signal)" transform={n === 1 ? 'translate(4 0)' : n === 5 ? 'translate(-4 0)' : undefined} />
    </svg>
  )
}

/* ---- Slides ------------------------------------------------------------- */

function S1() {
  return (
    <Slide n={1} kicker="The opportunity">
      <div className="s1">
        <div className="s1__left">
          <p className="t-mono s-eyebrow">The student insight</p>
          <h1 className="s-display">
            They don’t want to learn AI. <em>They want one AI project on their resume.</em>
          </h1>
        </div>
        <div className="s1__cols">
          <div>
            <p className="s-label">Who</p>
            <p className="s-text">
              Final-year B.Tech / BE students (2027 batch), tier-2 and tier-3 colleges, CSE / IT / ECE first. It’s
              October, so placement season is on.
            </p>
          </div>
          <div>
            <p className="s-label">Why they’d care</p>
            <p className="s-text">
              Every JD mentions AI. Their resume has a mini-project and nothing they built with AI. A 3-month course
              doesn’t fit a placement season.
            </p>
          </div>
          <div>
            <p className="s-label">What makes them register</p>
            <p className="s-text">
              A concrete output (a live link, a GitHub repo, one resume line), 60 minutes on a Sunday, and a friend
              who sent the link.
            </p>
          </div>
          <div className="s1__problem">
            <p className="s-label">The core problem</p>
            <p className="s-text">
              500 registrations in 7 days on ₹2,000 can’t be <em>bought</em>. At student ad prices that buys ~80. The
              other 420 have to come from places students already are, and from each other.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  )
}

function S2() {
  const steps = [
    ['Acquire', 'Ambassadors post in class groups. One paid test.', 'Communities · Ads'],
    ['Land', 'Headline speaks to a career outcome. Invite banner if referred.', '/'],
    ['Register', 'Six fields, ~40s, inline errors, no payment.', '/register'],
    ['Get code', 'Personal code + link, instantly.', '/welcome'],
    ['Share', 'One tap to WhatsApp. Starter Kit at 3 friends.', '/me'],
    ['Friend lands', '“Vijay saved you a seat.” Credited on register.', '/?ref=CODE'],
  ]
  return (
    <Slide n={2} kicker="The growth engine">
      <div className="s2">
        <h2 className="s-display s-display--m">
          Not a landing page. <em>A loop</em> that turns every registrant into a channel.
        </h2>
        <ol className="s2__loop">
          {steps.map(([t, d, r], i) => (
            <li key={t} className={i >= 3 ? 'is-loop' : undefined}>
              <span className="s2__n t-mono">{String(i + 1).padStart(2, '0')}</span>
              <p className="s2__t">{t}</p>
              <p className="s2__d">{d}</p>
              <p className="s2__r t-mono">{r}</p>
            </li>
          ))}
        </ol>
        <svg className="s2__arc" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M1380 4 C1380 60, 1380 60, 1300 60 L860 60 C780 60, 780 60, 780 4" fill="none" stroke="var(--signal)" strokeWidth="2" />
          <path d="M772 14 L780 2 L788 14" fill="none" stroke="var(--signal)" strokeWidth="2" />
          <text x="1080" y="52" textAnchor="middle" className="s2__arctext">every friend gets a code too · k ≈ 0.3</text>
        </svg>
        <div className="s2__measure">
          {[
            ['Measure', 'Every step fires an event: visit, form start, register, share, invite visit.'],
            ['Learn', 'A/B test on the message, read on Day 5 with a significance test.'],
            ['Scale', 'Winner to 100%, copy rewritten everywhere, remaining ₹1,000 behind it.'],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="s-label">{t}</p>
              <p className="s-text">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}

function S3() {
  const ch = CHANNELS.filter((c) => c.target > 0)
  return (
    <Slide n={3} kicker="500 registrations" sim="Target / assumption. Not results. Each number is a slider in the Growth Model screen.">
      <div className="s3">
        <div className="s3__eq">
          {ch.map((c, i) => (
            <div key={c.id} className="s3__term">
              <span className="s3__num" style={{ borderColor: `var(--series-${c.id})` }}>
                {c.target}
              </span>
              <p className="s3__lab">{c.label}</p>
              <p className="s3__why">{c.why}</p>
              <p className="s3__cost t-mono">{c.cost}</p>
              {i < ch.length - 1 && <span className="s3__op">+</span>}
            </div>
          ))}
          <div className="s3__term s3__term--total">
            <span className="s3__op s3__op--eq">=</span>
            <span className="s3__num">500</span>
            <p className="s3__lab">Registrations</p>
            <p className="s3__why">Model: 505. Organic is upside, not plan.</p>
          </div>
        </div>
        <div className="s3__math t-mono">
          <p>20 colleges × 3 groups × 250 = 15,000 reached → 13% open → 1,950 visits → 15.5% = 302</p>
          <p>₹2,000 ÷ ₹2.50 CPC = 800 clicks → 10% = 80 (CPR ₹25, the weakest assumption)</p>
          <p>382 direct × 40% share × 0.8 friends = 122 (k = 0.32, first-order only)</p>
        </div>
        <div className="s3__bottom">
          <div className="s3__budget">
            <p className="s-label">₹2,000 budget</p>
            <div className="s3__bar">
              <span>₹1,000 · A/B test · D3–5</span>
              <span>₹1,000 · scale winner · D6–7</span>
            </div>
            <p className="s-small">₹0 for ambassadors, rewards and leaderboard. Paid in status, not cash.</p>
            <p className="s3__break">
              <b>If assumptions break:</b> paid CPR at ₹50 halves paid to 40. The fix is 3 more colleges (+45), not more
              money.
            </p>
          </div>
          <ol className="s3__days">
            {DAYS.map((d) => (
              <li key={d.day}>
                <span className="t-mono">D{d.day}</span>
                <b>{d.focus}</b>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Slide>
  )
}

function S4() {
  const shots = [
    ['landing', 'Landing', 'Headline = live A/B variant. Invite banner when referred.'],
    ['dashboard', 'Referral dashboard', 'Code, one-tap WhatsApp, progress to reward, activity.'],
    ['console', 'Growth console', 'Day scrubber, pace vs 500, channels vs target, funnel.'],
    ['experiment', 'Experiment', 'Lift, p-value and CIs computed live. Decision logged.'],
  ]
  return (
    <Slide n={4} kicker="What I built" sim="Working asset: React + TypeScript. Real event tracking in-browser; campaign numbers simulated and labelled as such.">
      <div className="s4">
        <div className="s4__head">
          <h2 className="s-display s-display--m">
            The Growth Engine: <em>9 working screens,</em> one system.
          </h2>
          <p className="s-text">
            Register → get a code → share → a friend registers through the link → the referrer’s count, reward
            progress and rank update. Every step is tracked. Demo controls simulate friends for the walkthrough.
          </p>
        </div>
        <div className="s4__grid">
          {shots.map(([f, t, d]) => (
            <figure key={f}>
              <div className="s4__frame">
                <img src={`/deck/${f}.png`} alt={`${t} screen`} />
              </div>
              <figcaption>
                <b>{t}</b> {d}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Slide>
  )
}

function S5() {
  const { A, B } = EXPERIMENT.variants
  const t = twoProportion(A.registrations, A.visitors, B.registrations, B.visitors)
  return (
    <Slide n={5} kicker="Experiment → learn → scale" sim="Simulated experiment. Numbers show the method, not a real NxtWave result.">
      <div className="s5">
        <div className="s5__test">
          <p className="s-label">Hypothesis</p>
          <p className="s5__hyp">“Career-oriented messaging will get more registrations than generic learning messaging.”</p>
          <div className="s5__ab">
            <div>
              <p className="t-mono s5__v">A · Learning</p>
              <p className="s5__h">Learn AI in 60 minutes.</p>
              <p className="s5__cr">{pct(t.pA)}</p>
              <p className="s-small">79 of 712 visitors</p>
            </div>
            <div className="is-win">
              <p className="t-mono s5__v">B · Career · winner</p>
              <p className="s5__h">Build an AI project for your resume.</p>
              <p className="s5__cr">{pct(t.pB)}</p>
              <p className="s-small">117 of 706 visitors</p>
            </div>
          </div>
          <p className="s5__stat t-mono">
            +{pct(t.lift, 0)} relative lift · p = {t.pValue.toFixed(3)} · 95% CI +{(t.diffLo * 100).toFixed(1)} to +
            {(t.diffHi * 100).toFixed(1)} pts · guardrail: B shares more (44% vs 33%)
          </p>
          <div className="s5__learn">
            <div>
              <p className="s-label">Learned</p>
              <p className="s-text">Outcome beats topic. Final-years respond to what the hour does for them, not what it teaches.</p>
            </div>
            <div>
              <p className="s-label">Not yet known</p>
              <p className="s-text">Whether B changes who shows up. Registration isn’t attendance, so measure show-up per variant.</p>
            </div>
          </div>
        </div>
        <div className="s5__right">
          <div>
            <p className="s-label">What changed</p>
            <ul className="s5__list">
              <li>Day 5: B to 100% of landing traffic</li>
              <li>Ambassador copy rewritten in career framing</li>
              <li>₹1,000 behind B ads: CPR ₹25 → ~₹20</li>
            </ul>
          </div>
          <div>
            <p className="s-label">First idea → final</p>
            <p className="s-text">
              A landing page with a form. It converts, but it doesn’t grow. The final version is a referral loop with
              its own measurement, because ₹2,000 can’t buy 500 students and their friends can bring them.
            </p>
          </div>
          <div>
            <p className="s-label">With another 24 hours</p>
            <ul className="s5__list">
              <li>Real backend + a WhatsApp bot (n8n) that sends codes and reminders</li>
              <li>Track attendance, not just registrations, per variant</li>
              <li>Run Exp 02: the three projects above the fold</li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const SLIDES = [S1, S2, S3, S4, S5]

/* ---- Viewer ------------------------------------------------------------- */

export default function Deck() {
  useDocumentTitle('Growth plan · 5 slides')
  const [params, setParams] = useSearchParams()
  const print = params.has('print')
  const [i, setI] = useState(() => Math.min(4, Math.max(0, Number(params.get('slide') ?? 1) - 1)))
  const stage = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (print) return
    const fit = () => {
      const el = stage.current
      if (!el) return
      setScale(Math.min(el.clientWidth / W, el.clientHeight / H))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [print])

  const go = useCallback(
    (d: number) =>
      setI((x) => {
        const n = Math.min(4, Math.max(0, x + d))
        setParams({ slide: String(n + 1) }, { replace: true })
        return n
      }),
    [setParams],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        go(1)
      }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  if (print) {
    return (
      <div className="deck-print">
        {SLIDES.map((S, k) => (
          <div key={k} className="deck-print__page">
            <S />
          </div>
        ))}
      </div>
    )
  }

  const Current = SLIDES[i]
  return (
    <div className="deck">
      <div className="deck__bar">
        <Link to="/" className="t-mono">← Product</Link>
        <span className="t-mono">
          {i + 1} / 5 · ← → to navigate
        </span>
        <a href="/deck?print" className="t-mono">All slides</a>
      </div>
      <div className="deck__stage" ref={stage}>
        <div className="deck__canvas" style={{ width: W, height: H, transform: `scale(${scale})` }} key={i}>
          <Current />
        </div>
      </div>
      <div className="deck__nav">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous slide">←</button>
        {SLIDES.map((_, k) => (
          <button
            key={k}
            type="button"
            className={k === i ? 'is-on' : undefined}
            aria-label={`Slide ${k + 1}`}
            aria-current={k === i}
            onClick={() => go(k - i)}
          />
        ))}
        <button type="button" onClick={() => go(1)} disabled={i === 4} aria-label="Next slide">→</button>
      </div>
    </div>
  )
}
