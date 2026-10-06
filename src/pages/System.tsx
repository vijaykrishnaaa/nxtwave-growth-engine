import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/hooks'
import { Button, EmptyState, Field, Note, Ruler, SelectField, SimTag, Skeleton, Stat, Tabs, Tag, useToast } from '../components/ui'

const COLORS: { token: string; hex: string; job: string; ratio?: string; dark?: boolean }[] = [
  { token: '--paper', hex: '#F2EFE7', job: 'Page. Warm, print-like' },
  { token: '--surface', hex: '#FAF8F3', job: 'Raised sheet' },
  { token: '--sunk', hex: '#E8E4D9', job: 'Inputs, tracks, chips' },
  { token: '--ink', hex: '#161512', job: 'Text, primary buttons', ratio: '15.9', dark: true },
  { token: '--ink-2', hex: '#4A463E', job: 'Secondary text', ratio: '8.2', dark: true },
  { token: '--ink-3', hex: '#6B665C', job: 'Muted text', ratio: '5.0', dark: true },
  { token: '--rule', hex: '#D6D0C2', job: 'Hairlines' },
  { token: '--signal', hex: '#D9431A', job: 'The one accent: playhead, progress, “you”', ratio: '3.8 (marks)', dark: true },
  { token: '--signal-ink', hex: '#B3370F', job: 'Signal used as text', ratio: '5.3', dark: true },
  { token: '--success', hex: '#2E6A3E', job: 'Unlocked, on pace', ratio: '5.6', dark: true },
  { token: '--warning', hex: '#8F5B00', job: 'Behind pace, assumption', ratio: '5.0', dark: true },
  { token: '--error', hex: '#B42318', job: 'Validation', ratio: '5.7', dark: true },
]

const SERIES = [
  ['College communities', '#3A6FB0'],
  ['Referrals', '#D9431A'],
  ['Paid', '#1F8A6E'],
  ['Organic', '#B08A1E'],
]

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 144]

export default function System() {
  useDocumentTitle('Design system · Field Notes')
  const toast = useToast()
  const [tab, setTab] = useState<'one' | 'two'>('one')
  const [ruler, setRuler] = useState(2)

  return (
    <div className="container system">
      <header className="sys-head">
        <p className="t-eyebrow">Design system · v1</p>
        <h1 className="t-display-l">
          Field Notes<em>.</em>
        </h1>
        <p className="t-body-l">
          An engineer’s notebook, marked up in red pen. Paper, ink and one accent. Hierarchy comes from type and
          hairlines, not from cards and shadows. Every value lives in <span className="t-mono">src/styles/tokens.css</span>.
        </p>
        <Note>
          No Figma MCP was connected in this environment, so nothing here was made in Figma. The wireframes were
          written first (<span className="t-mono">docs/04-wireframes.md</span>) and are redrawn below. This page is the
          living source of truth.
        </Note>
      </header>

      <Block n="01" title="Colour" lede="Each colour has one job. Contrast is measured against paper.">
        <ul className="swatches">
          {COLORS.map((c) => (
            <li key={c.token}>
              <span className="swatches__chip" style={{ background: c.hex }} />
              <p className="t-mono swatches__token">{c.token}</p>
              <p className="t-small">{c.job}</p>
              <p className="t-mono swatches__hex">
                {c.hex}
                {c.ratio && <span> · {c.ratio}:1</span>}
              </p>
            </li>
          ))}
        </ul>
        <p className="t-eyebrow sys-sub">Chart series: validated with the dataviz six-check, all pass</p>
        <ul className="series">
          {SERIES.map(([l, h]) => (
            <li key={l}>
              <span className="swatch" style={{ background: h, width: 24, height: 12 }} />
              <span className="t-small">{l}</span>
              <span className="t-mono t-small t-muted">{h}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block n="02" title="Type" lede="Three roles. Newsreader for the editorial voice, IBM Plex Sans for UI and figures, Plex Mono for anything a machine produces.">
        <div className="specimens">
          <Spec meta="Display XL · Newsreader 400 · 52→112 / 0.94 · −0.035em">
            <p className="t-display-xl">
              Build an AI project <em>for your resume.</em>
            </p>
          </Spec>
          <Spec meta="Display L · Newsreader 400 · 36→64 / 1.02">
            <p className="t-display-l">Minute by minute.</p>
          </Spec>
          <Spec meta="Heading · Newsreader 400 · 28→40 / 1.1">
            <p className="t-heading">Can we get to 500 registrations?</p>
          </Spec>
          <Spec meta="Title · Plex Sans 600 · 20 / 1.3 · −0.01em">
            <p className="t-title">Which channel is carrying us?</p>
          </Spec>
          <Spec meta="Body L · Plex Sans 400 · 17→19 / 1.5">
            <p className="t-body-l">You leave with a deployed app, a GitHub link, and a project you can explain.</p>
          </Spec>
          <Spec meta="Body · Plex Sans 400 · 16 / 1.55">
            <p>Everything runs in your browser. No installs, no GPU, no card details.</p>
          </Spec>
          <Spec meta="Eyebrow · Plex Mono 500 · 12 · +0.08em caps">
            <p className="t-eyebrow">02 / The 60 minutes</p>
          </Spec>
          <Spec meta="Hero figure · Plex Sans 500 · 56→96 · proportional figures">
            <p className="hero-fig__value" style={{ margin: 0 }}>
              342<span className="hero-fig__of">/ 500</span>
            </p>
          </Spec>
          <Spec meta="Data · Plex Mono 500">
            <p className="share__codevalue t-mono" style={{ margin: 0 }}>VIJAY20</p>
          </Spec>
        </div>
      </Block>

      <Block n="03" title="Space and grid" lede="4-based steps, only the ones in use. 12 / 8 / 4 columns at 1024 / 640.">
        <ul className="spaces">
          {SPACE.map((s, i) => (
            <li key={s}>
              <span className="t-mono t-small">--s-{i + 1}</span>
              <span className="spaces__bar" style={{ width: s }} />
              <span className="t-mono t-small t-muted">{s}px</span>
            </li>
          ))}
        </ul>
        <div className="grid sys-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
      </Block>

      <Block n="04" title="The ruler" lede="The signature device. 00–60 minutes on the landing page, Day 1–7 in the console, 0–5 friends in the share panel.">
        <div className="sys-ruler">
          <Ruler
            label={`${ruler} of 5 friends`}
            min={0}
            max={5}
            step={1}
            major={1}
            value={ruler}
            fill
            tickLabel={(n) => n}
            milestones={[
              { at: 3, label: 'Starter Kit', sub: '3 friends' },
              { at: 5, label: 'Live review', sub: '5 friends' },
            ]}
          />
          <div className="sys-row">
            <Button size="sm" variant="secondary" onClick={() => setRuler((r) => Math.max(0, r - 1))}>− Friend</Button>
            <Button size="sm" variant="secondary" onClick={() => setRuler((r) => Math.min(5, r + 1))}>+ Friend</Button>
            <span className="t-small t-muted">Playhead and fill move at 420ms, ease-emph.</span>
          </div>
        </div>
      </Block>

      <Block n="05" title="Components" lede="Not everything is a card. Rows, rules and lists do most of the work.">
        <div className="comp-grid">
          <Comp name="Button">
            <div className="sys-row">
              <Button arrow>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost link</Button>
            </div>
            <div className="sys-row">
              <Button loading>Reserving…</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
            </div>
          </Comp>
          <Comp name="Input · Select">
            <Field label="Email" placeholder="you@example.com" />
            <Field label="Email" defaultValue="arun@" error="That email doesn’t look complete." />
            <SelectField label="Branch" options={['CSE', 'ECE']} defaultValue="CSE" />
          </Comp>
          <Comp name="Tag">
            <div className="sys-row">
              <SimTag />
              <Tag tone="assumption">Assumption</Tag>
              <Tag tone="success">Concluded</Tag>
              <Tag tone="signal">Winner</Tag>
              <Tag>Control</Tag>
            </div>
          </Comp>
          <Comp name="Tabs">
            <Tabs label="Example" value={tab} onChange={setTab} tabs={[{ id: 'one', label: 'Students' }, { id: 'two', label: 'Campuses' }]} />
          </Comp>
          <Comp name="Stat strip">
            <dl className="kpis" style={{ ['--kpi-cols' as string]: 2 }}>
              <Stat label="Successful referrals" value="4" note="friends registered" />
              <Stat label="Link clicks" value="12" note="people opened your link" />
            </dl>
          </Comp>
          <Comp name="Toast">
            <Button variant="secondary" onClick={() => toast('Link copied. Paste it in your class group')}>
              Trigger toast
            </Button>
          </Comp>
          <Comp name="Note">
            <Note tone="warning">15 behind linear pace. Need 79/day.</Note>
            <Note tone="success">Clears 500 by 5.</Note>
          </Comp>
          <Comp name="Loading · Empty">
            <Skeleton lines={3} />
            <EmptyState title="Your link hasn’t been opened yet.">Paste the pre-written message in your class group.</EmptyState>
          </Comp>
        </div>
      </Block>

      <Block n="06" title="Motion" lede="Motion only where something changed: a number, progress, a rank. All of it collapses under prefers-reduced-motion.">
        <table className="table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Used for</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['--dur-1', '120ms', 'Hover, press (timing taken from Linear’s 100–160ms)'],
              ['--dur-2', '200ms', 'Tabs underline, toasts, state change'],
              ['--dur-3', '420ms', 'Reveals, progress fill, leaderboard reorder'],
              ['--dur-4', '900ms', 'Count-up, only when a value changes, never on first paint'],
              ['--ease-out', 'cubic-bezier(.25,.46,.45,.94)', 'Most transitions'],
              ['--ease-emph', 'cubic-bezier(.2,.8,.2,1)', 'Playhead, arrows: things that arrive'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td className="t-mono">{a}</td>
                <td className="t-mono t-small">{b}</td>
                <td className="t-small">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Block>

      <Block n="07" title="Wireframes" lede="Drawn before any code. Low-fi on purpose, to show hierarchy and the primary action only.">
        <div className="wires">
          <Wire name="Landing" to="/" primary="Reserve my seat">
            <i className="w-eyebrow" /><i className="w-h1" /><i className="w-h1 w-h1--short" />
            <div className="w-row"><i className="w-text" /><i className="w-meta" /></div>
            <i className="w-btn" /><i className="w-ruler" />
          </Wire>
          <Wire name="Registration" to="/register" primary="Reserve my seat">
            <div className="w-row"><div className="w-col"><i className="w-h2" /><i className="w-field" /><i className="w-field" /><i className="w-field" /><i className="w-btn" /></div><i className="w-meta" /></div>
          </Wire>
          <Wire name="Success" to="/welcome" primary="Open my dashboard">
            <i className="w-check" /><i className="w-h2 w-center" /><div className="w-panel"><i className="w-code" /><i className="w-ruler" /></div>
          </Wire>
          <Wire name="Referral dashboard" to="/me" primary="Copy link">
            <i className="w-h2" /><i className="w-kpis" /><div className="w-row"><div className="w-panel"><i className="w-code" /><i className="w-ruler" /></div><i className="w-feed" /></div>
          </Wire>
          <Wire name="Leaderboard" to="/leaderboard" primary="Share my link">
            <i className="w-h2" /><i className="w-tabs" />{[1, 2, 3, 4, 5].map((r) => <i key={r} className={`w-tr${r === 3 ? ' w-tr--me' : ''}`} />)}
          </Wire>
          <Wire name="Analytics" to="/console" primary="Scrub the day">
            <i className="w-scrub" /><i className="w-fig" /><i className="w-kpis" /><i className="w-chart" />
          </Wire>
          <Wire name="Experiment" to="/console/experiment" primary="Ship the winner">
            <i className="w-h2" /><div className="w-row"><i className="w-thumb" /><i className="w-thumb w-thumb--win" /></div><i className="w-chart w-chart--short" />
          </Wire>
        </div>
        <table className="table states">
          <caption className="t-eyebrow">States per screen</caption>
          <thead>
            <tr><th>Screen</th><th>Empty</th><th>Loading</th><th>Success</th><th>Error</th></tr>
          </thead>
          <tbody>
            <tr><td>Landing</td><td>—</td><td>—</td><td>Already registered: CTA becomes “See my invites”</td><td>Unknown invite code: quiet note, still registerable</td></tr>
            <tr><td>Registration</td><td>Placeholders</td><td>“Reserving…” + progress line</td><td>Routes to /welcome</td><td>Inline field errors, focus moves to first, duplicate-email recovery</td></tr>
            <tr><td>Dashboard</td><td>“Link not opened yet” + ready message</td><td>Skeleton</td><td>Reward unlocked banner</td><td>No session: register or view demo</td></tr>
            <tr><td>Leaderboard</td><td>Unranked: pinned “you” row</td><td>—</td><td>Row moves (FLIP)</td><td>—</td></tr>
            <tr><td>Console</td><td>Live strip at 0</td><td>—</td><td>Pace note turns green</td><td>Behind pace: warning note</td></tr>
          </tbody>
        </table>
      </Block>

      <Block n="08" title="Deliberately rejected" lede="What the first AI drafts suggested, and why it isn’t here.">
        <ul className="rejected">
          <li><strong>Purple-to-blue gradient hero, glass cards.</strong> It reads as “AI-generated” within a second, and it says nothing about this workshop.</li>
          <li><strong>A bento grid of eight stat cards.</strong> Every number would look equally important. One hero figure instead, and every chart answers a named question.</li>
          <li><strong>Testimonials and a “500+ students already joined” counter.</strong> They would be invented. Simulated data is labelled everywhere, including a dashed stamp.</li>
          <li><strong>Fake scarcity (“only 12 seats left”).</strong> An online workshop has no seat limit. The countdown is to a real date.</li>
          <li><strong>Inter + rounded-2xl everything.</strong> Replaced with a serif / sans / mono system and 2px radii.</li>
          <li><strong>Scroll-jacked hero.</strong> The only scroll-linked element is the minute clock, which helps you follow the steps.</li>
        </ul>
        <p className="t-small t-muted">
          More in <span className="t-mono">docs/06-ai-learning-notes.md</span>. Reference board:{' '}
          <span className="t-mono">docs/02-reference-board.md</span>. <Link to="/deck">See the deck</Link>.
        </p>
      </Block>
    </div>
  )
}

function Block({ n, title, lede, children }: { n: string; title: string; lede: string; children: ReactNode }) {
  return (
    <section className="sys-block" aria-labelledby={`sys-${n}`}>
      <header className="sys-block__head">
        <p className="t-eyebrow">{n}</p>
        <h2 id={`sys-${n}`} className="t-heading">{title}</h2>
        <p className="t-small t-muted">{lede}</p>
      </header>
      <div className="sys-block__body">{children}</div>
    </section>
  )
}

function Spec({ meta, children }: { meta: string; children: ReactNode }) {
  return (
    <div className="spec">
      <p className="t-mono spec__meta">{meta}</p>
      {children}
    </div>
  )
}

function Comp({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="comp">
      <p className="t-eyebrow">{name}</p>
      <div className="comp__body">{children}</div>
    </div>
  )
}

function Wire({ name, to, primary, children }: { name: string; to: string; primary: string; children: ReactNode }) {
  return (
    <figure className="wire">
      <div className="wire__frame" aria-hidden="true">{children}</div>
      <figcaption>
        <Link to={to}>{name}</Link>
        <span className="t-small t-muted">Primary: {primary}</span>
      </figcaption>
    </figure>
  )
}
