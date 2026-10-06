import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  currentUser,
  loadDemoStudent,
  resetAll,
  setVariant,
  signInAs,
  simulateClick,
  simulateFriend,
  useAppState,
} from '../lib/store'
import { firstName } from '../lib/format'
import { Button, ButtonLink, SimTag, useToast } from './ui'

/* ---- Simulation bar: always tells the truth about the data ------------- */

export function SimBar() {
  return (
    <div className="simbar">
      <div className="container simbar__inner">
        <p className="simbar__msg">
          <span className="simbar__dot" aria-hidden="true" />
          <strong>Simulation</strong>
          <span className="simbar__long">
            Prototype for the NxtWave Growth Intern challenge. Not an official NxtWave page. All data is simulated.
          </span>
        </p>
        <nav className="simbar__nav" aria-label="Prototype sections">
          <NavLink to="/" end>Site</NavLink>
          <NavLink to="/console">Console</NavLink>
          <NavLink to="/deck">Deck</NavLink>
          <NavLink to="/system">System</NavLink>
        </nav>
      </div>
    </div>
  )
}

export function Wordmark({ to = '/', sub }: { to?: string; sub?: string }) {
  return (
    <Link to={to} className="wordmark" aria-label={sub ? `The 60-Minute Build, ${sub}` : 'The 60-Minute Build, home'}>
      <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden="true">
        <path d="M0 15.5h28" stroke="currentColor" />
        {[0, 4, 8, 12, 16, 20, 24].map((x, i) => (
          <path key={x} d={`M${x + 0.5} 15V${i % 3 === 0 ? 6 : 10}`} stroke="currentColor" />
        ))}
        <path d="M18 0h6l-3 4z" fill="var(--signal)" />
        <path d="M21 4v11" stroke="var(--signal)" strokeWidth="1.5" />
      </svg>
      <span className="wordmark__name">
        The 60‑Minute Build{sub && <span className="wordmark__sub">{sub}</span>}
      </span>
    </Link>
  )
}

function StudentHeader() {
  const s = useAppState()
  const me = currentUser(s)
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Wordmark />
        <nav className="site-header__nav" aria-label="Workshop">
          <a href="/#hour">The hour</a>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          {me && <NavLink to="/me">My invites</NavLink>}
        </nav>
        {me ? (
          <ButtonLink to="/me" variant="secondary" size="sm" className="site-header__cta">
            {firstName(me.name)} · {me.code}
          </ButtonLink>
        ) : (
          <ButtonLink to="/register" size="sm" className="site-header__cta">
            Reserve my seat
          </ButtonLink>
        )}
      </div>
    </header>
  )
}

function ConsoleHeader() {
  return (
    <header className="console-header">
      <div className="container console-header__inner">
        <Link to="/console" className="console-brand">
          <span className="console-brand__name">Growth Engine</span>
          <span className="console-brand__sub">AI workshop campaign</span>
        </Link>
        <nav className="console-nav" aria-label="Console">
          <NavLink to="/console" end>Overview</NavLink>
          <NavLink to="/console/experiment">Experiment</NavLink>
          <NavLink to="/console/model">Model &amp; plan</NavLink>
        </nav>
        <SimTag />
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Wordmark />
          <p className="t-small t-muted site-footer__note">
            A growth-challenge prototype. Workshop format, rewards and every number here are proposals or
            simulations, not NxtWave commitments or results. Names and campuses are fictional.
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link to="/register">Reserve a seat</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/me">My invites</Link>
          <Link to="/console">Growth console</Link>
          <Link to="/deck">Growth plan deck</Link>
          <Link to="/system">Design system</Link>
        </nav>
      </div>
    </footer>
  )
}

/* ---- Route effects ----------------------------------------------------- */

function useScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

function Page() {
  const { pathname } = useLocation()
  return (
    <main id="main" key={pathname} className="page-in">
      <Outlet />
    </main>
  )
}

export function StudentLayout() {
  useScrollTop()
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SimBar />
      <StudentHeader />
      <Page />
      <Footer />
      <DemoControls />
    </>
  )
}

export function ConsoleLayout() {
  useScrollTop()
  return (
    <div className="console">
      <a className="skip-link" href="#main">Skip to content</a>
      <SimBar />
      <ConsoleHeader />
      <Page />
      <DemoControls />
    </div>
  )
}

export function BareLayout() {
  useScrollTop()
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SimBar />
      <Page />
    </>
  )
}

/* ---- Demo controls: for walkthroughs; clearly labelled ---------------- */

function DemoControls() {
  const ref = useRef<HTMLDialogElement>(null)
  const s = useAppState()
  const me = currentUser(s)
  const toast = useToast()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const people = useMemo(() => s.registrants.filter((r) => !r.referredBy || !r.simulated), [s.registrants])

  const open = () => {
    setConfirmReset(false)
    ref.current?.showModal()
  }
  const close = () => ref.current?.close()

  return (
    <>
      <button type="button" className="demo-fab" onClick={open} aria-haspopup="dialog">
        <span className="demo-fab__dot" aria-hidden="true" />
        Demo controls
      </button>
      <dialog
        ref={ref}
        className="dialog demo"
        aria-labelledby="demo-title"
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="demo__head">
          <div>
            <p className="t-eyebrow">Walkthrough tools</p>
            <h2 id="demo-title" className="t-title">Demo controls</h2>
          </div>
          <button type="button" className="demo__close" onClick={close} aria-label="Close demo controls">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <section className="demo__group" aria-labelledby="demo-session">
          <h3 id="demo-session" className="demo__label">Session</h3>
          <p className="t-small">
            {me ? (
              <>Signed in as <strong>{me.name}</strong>, code <span className="t-mono">{me.code}</span></>
            ) : (
              'Not registered in this browser.'
            )}
          </p>
          {people.length > 1 && (
            <label className="demo__switch t-small">
              Switch to
              <select value={me?.id ?? ''} onChange={(e) => signInAs(e.target.value || null)}>
                <option value="">Nobody (logged out)</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} · {p.code}</option>
                ))}
              </select>
            </label>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              loadDemoStudent()
              close()
              navigate('/me')
              toast('Loaded demo student Vijay M.')
            }}
          >
            Load demo student (4 referrals)
          </Button>
        </section>

        <section className="demo__group" aria-labelledby="demo-ref">
          <h3 id="demo-ref" className="demo__label">Referral loop</h3>
          <div className="demo__row">
            <Button
              variant="secondary"
              size="sm"
              disabled={!me}
              onClick={() => {
                if (!me) return
                simulateClick(me.code)
                toast('Simulated a link click')
              }}
            >
              Simulate link click
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!me}
              onClick={() => {
                if (!me) return
                const f = simulateFriend(me.code)
                toast(`${f.name} registered with ${me.code}`)
              }}
            >
              Simulate friend joining
            </Button>
          </div>
          {!me && <p className="t-small t-muted">Register or load the demo student first.</p>}
        </section>

        <section className="demo__group" aria-labelledby="demo-variant">
          <h3 id="demo-variant" className="demo__label">Landing variant</h3>
          <div className="segmented" role="radiogroup" aria-labelledby="demo-variant">
            {([
              ['A', 'A · Learning'],
              ['B', 'B · Career (winner)'],
            ] as const).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={(s.variant ?? 'B') === v}
                onClick={() => {
                  setVariant(v === 'B' ? null : v)
                  toast(`Landing page now shows variant ${v}`)
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="t-small t-muted">Experiment 01 ended on Day 5. B serves 100% unless you preview A.</p>
        </section>

        <section className="demo__group demo__group--danger">
          {confirmReset ? (
            <div className="demo__row">
              <span className="t-small">Clear every local registration and event?</span>
              <Button
                variant="signal"
                size="sm"
                onClick={() => {
                  resetAll()
                  close()
                  navigate('/')
                  toast('Local data cleared')
                }}
              >
                Yes, clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
              Reset this browser's data
            </Button>
          )}
        </section>
      </dialog>
    </>
  )
}
