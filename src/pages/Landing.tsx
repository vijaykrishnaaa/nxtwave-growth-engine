import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EXPERIMENT, WORKSHOP } from '../data/campaign'
import { useCountdown, useDocumentTitle, usePrefersReducedMotion, useReveal } from '../lib/hooks'
import { currentUser, currentVariant, findByCode, setVariant, track, useAppState, type Variant } from '../lib/store'
import { firstName } from '../lib/format'
import { Arrow, ButtonLink, Ruler } from '../components/ui'

const PROJECTS = [
  {
    name: 'Placement-prep bot',
    does: 'Ask it anything about your college’s placement process. It answers from the notes you give it.',
    learn: 'Retrieval (RAG) basics',
    line: 'Built a retrieval-based Q&A assistant over placement documents using Python and an LLM API; deployed as a public web app.',
  },
  {
    name: 'Resume ↔ JD matcher',
    does: 'Paste a job description and your resume. It lists the gaps and rewrites one bullet for that role.',
    learn: 'Prompt design, structured output',
    line: 'Built an LLM tool that scores resume–job fit and returns structured suggestions as JSON; deployed with a simple web UI.',
  },
  {
    name: 'Notes → quiz',
    does: 'Upload lecture notes as a PDF and get practice questions with worked answers.',
    learn: 'Document parsing, generation',
    line: 'Built a PDF-to-quiz generator with Python and an LLM API that turns lecture notes into graded practice sets.',
  },
]

const STEPS = [
  { at: 0, end: 8, title: 'Open the notebook', short: 'Set up', body: 'Everything runs in your browser. No installs, no GPU, no card details.' },
  { at: 8, end: 15, title: 'Pick your project', short: 'Pick', body: 'Choose one of the three starting points. A mentor helps you scope it to what fits in the hour.' },
  { at: 15, end: 30, title: 'First working output', short: 'First output', body: 'Write your first prompt and get the app answering. Rough, but alive.' },
  { at: 30, end: 45, title: 'Give it your data', short: 'Your data', body: 'Connect your notes, resume or PDF so it answers about your material, not the internet’s.' },
  { at: 45, end: 55, title: 'Ship it', short: 'Ship', body: 'Deploy to a public link you can open on your phone and send to anyone.' },
  { at: 55, end: 60, title: 'Write the resume line', short: 'Resume line', body: 'Push to GitHub, write the bullet, and leave with something you can show in an interview.' },
]

const HEADLINES: Record<Variant, { h1: React.ReactNode; lede: string }> = {
  A: {
    h1: (
      <>
        Learn AI in <em>60&nbsp;minutes.</em>
      </>
    ),
    lede: 'A free, hands-on introduction to how AI applications are built, for final-year engineering students.',
  },
  B: {
    h1: (
      <>
        Build an AI project <em>for your resume.</em>
      </>
    ),
    lede: 'Sixty minutes, live and free. You leave with a deployed app, a GitHub link, and a project you can explain in your next interview.',
  },
}

const mm = (n: number) => `${String(n).padStart(2, '0')}:00`

function useLandingTracking() {
  const [params] = useSearchParams()
  const ref = params.get('ref')?.toUpperCase() ?? null
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    try {
      if (!sessionStorage.getItem('ge:visited')) {
        sessionStorage.setItem('ge:visited', '1')
        track('visit')
      }
      if (ref && findByCode(ref)) {
        const k = `ge:refvisit:${ref}`
        if (!sessionStorage.getItem(k)) {
          sessionStorage.setItem(k, '1')
          track('ref_visit', { code: ref })
        }
        sessionStorage.setItem('ge:ref', ref)
      }
    } catch {
      track('visit')
    }
  }, [ref])
  return ref
}

export default function Landing() {
  useDocumentTitle('Build Your First AI Project in 60 Minutes · Free live workshop')
  const s = useAppState()
  const me = currentUser(s)
  const [params] = useSearchParams()
  const forced = params.get('v')?.toUpperCase()
  const variant: Variant = forced === 'A' || forced === 'B' ? forced : currentVariant()

  // ?v=a|b sets this browser's variant, so tracked events carry the variant actually shown
  useEffect(() => {
    if (forced === 'A') setVariant('A')
    if (forced === 'B') setVariant(null)
  }, [forced])
  const ref = useLandingTracking()
  const inviter = useMemo(() => (ref ? findByCode(ref) : null), [ref, s.registrants])
  const root = useReveal<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  const [sweep, setSweep] = useState(reduced ? 60 : 0)
  const countdown = useCountdown(WORKSHOP.startsAt)

  useEffect(() => {
    if (reduced) return
    const t = window.setTimeout(() => setSweep(60), 350)
    return () => window.clearTimeout(t)
  }, [reduced])

  const registerTo = ref && inviter ? `/register?ref=${ref}` : '/register'
  // Someone else's invite link always offers registration, even if this browser has a seat
  const invited = Boolean(ref && inviter && ref !== me?.code)
  const seated = Boolean(me) && !invited
  const copy = HEADLINES[variant]

  return (
    <div ref={root} className="landing">
      {/* ---------------------------------------------------------- Hero */}
      <section className="hero container" aria-labelledby="hero-title">
        {ref && (
          <div className={`invite${inviter ? '' : ' invite--unknown'}`} role="note">
            {inviter ? (
              <>
                <span className="invite__mark" aria-hidden="true" />
                <p>
                  <strong>{firstName(inviter.name)} saved you a seat.</strong> Register with their code{' '}
                  <span className="t-mono">{ref}</span> and you’ll both move up the campus leaderboard.
                </p>
              </>
            ) : (
              <p>
                We couldn’t find the invite code <span className="t-mono">{ref}</span>. You can still register
                below.
              </p>
            )}
          </div>
        )}

        <div className="hero__grid grid">
          <p className="hero__eyebrow t-eyebrow">
            Free live workshop<span aria-hidden="true"> — </span>
            <span className="hero__title-official">Build Your First AI Project in 60 Minutes</span>
          </p>

          <h1 id="hero-title" className="hero__h1 t-display-xl" data-variant={variant}>
            {copy.h1}
          </h1>

          <div className="hero__lede">
            <p className="t-body-l">{copy.lede}</p>
            <div className="hero__ctas">
              {seated ? (
                <ButtonLink to="/me" size="lg" arrow>
                  You’re in. See my invites
                </ButtonLink>
              ) : (
                <ButtonLink to={registerTo} size="lg" arrow onClick={() => track('cta_click')}>
                  Reserve my seat
                </ButtonLink>
              )}
              <a href="#build" className="btn btn--ghost btn--md">
                <span>See what you’ll build</span>
              </a>
            </div>
          </div>

          <dl className="hero__meta">
            <div>
              <dt>When</dt>
              <dd>
                {WORKSHOP.dateLabel}, {WORKSHOP.timeLabel}
              </dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{WORKSHOP.length}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>Online. Link on email &amp; WhatsApp</dd>
            </div>
            <div>
              <dt>For</dt>
              <dd>Final-year engineering students, any branch</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd>Free</dd>
            </div>
            <div className="hero__countdown">
              <dt>Starts in</dt>
              <dd className="t-mono">
                {countdown.past ? 'Happened' : `${countdown.days}d ${countdown.hours}h ${countdown.mins}m`}
              </dd>
            </div>
          </dl>
        </div>

        <div className="hero__ruler">
          <Ruler
            label="The workshop timeline, from minute 0 to minute 60"
            min={0}
            max={60}
            step={1}
            major={5}
            value={sweep}
            fill
            tickLabel={(n) => (n % 15 === 0 ? mm(n) : null)}
            milestones={STEPS.map((st) => ({ at: st.at, label: st.short }))}
          />
        </div>
      </section>

      {/* ------------------------------------------------ What you'll build */}
      <section id="build" className="section container band" aria-labelledby="build-title">
        <header className="band__head grid">
          <p className="band__index t-eyebrow">01 / What you’ll build</p>
          <h2 id="build-title" className="band__title t-display-l t-twotone reveal">
            One project, shipped live. <span>Pick your starting point in the room.</span>
          </h2>
        </header>

        <ol className="projects">
          {PROJECTS.map((p, i) => (
            <li key={p.name} className="project grid reveal">
              <span className="project__n t-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="project__name t-heading">{p.name}</h3>
              <p className="project__does">{p.does}</p>
              <p className="project__learn">
                <span className="t-eyebrow">You learn</span>
                {p.learn}
              </p>
              <figure className="project__line">
                <figcaption className="t-eyebrow">The line it adds to your resume</figcaption>
                <blockquote>“{p.line}”</blockquote>
              </figure>
            </li>
          ))}
        </ol>
        <p className="projects__foot t-small t-muted reveal">
          Whichever you pick, you leave with three things: <strong>a live link</strong>,{' '}
          <strong>a GitHub repo</strong> and <strong>one resume bullet</strong>.
        </p>
      </section>

      {/* ------------------------------------------------- The 60 minutes */}
      <Hour />

      {/* ------------------------------------------------- Why final year */}
      <section className="section container band" aria-labelledby="why-title">
        <header className="band__head grid">
          <p className="band__index t-eyebrow">03 / Why now</p>
          <h2 id="why-title" className="band__title t-display-l reveal">
            Placement season doesn’t wait for a <em>three-month</em> course.
          </h2>
        </header>
        <ol className="why grid">
          {[
            ['Interviewers ask what you’ve built.', 'Not what you watched. A project you made, and can explain line by line, is a better answer than a certificate.'],
            ['“AI” is in the job description.', 'You don’t need to be an expert. You need to have used it to make something that works.'],
            ['An hour fits your week.', 'Sunday evening, between a placement test and an assignment deadline. No prep, no installs.'],
          ].map(([h, b], i) => (
            <li key={h} className="why__item reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="t-mono why__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-title">{h}</h3>
              <p>{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ----------------------------------------------- Bring friends */}
      <section className="section container band" aria-labelledby="friends-title">
        <header className="band__head grid">
          <p className="band__index t-eyebrow">04 / Bring your friends</p>
          <h2 id="friends-title" className="band__title t-display-l t-twotone reveal">
            Better with your batch. <span>And there’s something in it for you.</span>
          </h2>
        </header>
        <div className="friends grid">
          <ol className="friends__steps reveal">
            {[
              ['Register', 'Takes about 40 seconds.'],
              ['Get your code', 'It’s yours. Your first name plus two digits.'],
              ['Share it', 'One tap to your class WhatsApp group.'],
              ['Friends register', 'Every friend who joins with your code counts.'],
            ].map(([t, b], i) => (
              <li key={t}>
                <span className="t-mono">{i + 1}</span>
                <div>
                  <p className="friends__t">{t}</p>
                  <p className="t-small t-muted">{b}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="friends__reward reveal">
            <Ruler
              label="Referral rewards: Starter Kit at 3 friends, live review at 5 friends"
              min={0}
              max={5}
              step={1}
              major={1}
              tickLabel={(n) => n}
              milestones={[
                { at: 3, label: 'Starter Kit', sub: '3 friends' },
                { at: 5, label: 'Live review', sub: '5 friends' },
              ]}
            />
            <dl className="rewards">
              <div>
                <dt>AI Project Starter Kit</dt>
                <dd>A prompt pack, 5 more project templates and a deployment checklist. Yours at 3 friends.</dd>
              </div>
              <div>
                <dt>Live project review</dt>
                <dd>Your project is reviewed on screen during the workshop. Yours at 5 friends.</dd>
              </div>
            </dl>
            <p className="t-small t-muted">
              Rewards are digital and don’t run out. Everyone who reaches 3 gets the kit.{' '}
              <Link to="/leaderboard">See the leaderboard</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className="section container band" aria-labelledby="faq-title">
        <header className="band__head grid">
          <p className="band__index t-eyebrow">05 / Before you ask</p>
          <h2 id="faq-title" className="band__title t-heading">Questions students ask first</h2>
        </header>
        <div className="faq">
          {[
            ['Do I need to know AI or Python?', 'No. If you’ve written any code in college, you can follow along. Every step is typed out with you, live.'],
            ['What do I need on the day?', 'A laptop with a browser and a stable connection. Everything runs online, so there’s nothing to install beforehand.'],
            ['Is it really free?', 'Yes. No payment details are asked for, either at registration or on the day.'],
            ['I’m not in final year. Can I join?', 'Yes. It’s pitched at final-years preparing for placements, but anyone is welcome.'],
          ].map(([q, a]) => (
            <details key={q} className="faq__item">
              <summary>
                {q}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Close */}
      <section className="close" aria-labelledby="close-title">
        <div className="container close__inner">
          <p className="t-eyebrow close__eyebrow">
            {WORKSHOP.dateLabel} · {WORKSHOP.timeLabel} · Online · Free
          </p>
          <h2 id="close-title" className="t-display-l">
            Bring a laptop <em>and one idea.</em>
          </h2>
          {seated ? (
            <ButtonLink to="/me" size="lg" className="btn--invert" arrow>
              Share my invite link
            </ButtonLink>
          ) : (
            <ButtonLink to={registerTo} size="lg" className="btn--invert" arrow onClick={() => track('cta_click')}>
              Reserve my seat
            </ButtonLink>
          )}
          <p className="close__fine t-small">
            Headline variant shown: {EXPERIMENT.variants[variant].label}.{' '}
            <Link to="/console/experiment">Why this headline?</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

/* Scroll-linked: the clock on the left follows the step you're reading. */
function Hour() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const step = STEPS[active]
  return (
    <section id="hour" className="section container band hour" aria-labelledby="hour-title">
      <header className="band__head grid">
        <p className="band__index t-eyebrow">02 / The 60 minutes</p>
        <h2 id="hour-title" className="band__title t-display-l">
          Minute by minute, <em>so you know it fits.</em>
        </h2>
      </header>
      <div className="hour__grid grid">
        <div className="hour__clock" aria-hidden="true">
          <div className="hour__sticky">
            <p className="hour__time t-mono">
              {mm(step.at)}
              <span>→ {mm(step.end)}</span>
            </p>
            <p className="hour__now">{step.title}</p>
            <Ruler label="" min={0} max={60} step={5} major={15} value={step.at} fill tickLabel={(n) => n} />
          </div>
        </div>
        <ol className="hour__steps">
          {STEPS.map((st, i) => (
            <li
              key={st.title}
              ref={(el) => (refs.current[i] = el)}
              data-i={i}
              className={`hour__step${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
            >
              <span className="hour__stamp t-mono">{mm(st.at)}</span>
              <div>
                <h3 className="t-title">{st.title}</h3>
                <p>{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className="hour__cta">
        <Link to="/register" className="btn btn--secondary btn--md" onClick={() => track('cta_click')}>
          <span>Save my seat for Sunday</span>
          <Arrow />
        </Link>
      </p>
    </section>
  )
}
