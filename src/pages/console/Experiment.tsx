import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { EXPERIMENT } from '../../data/campaign'
import { useDocumentTitle } from '../../lib/hooks'
import { currentVariant, useAppState } from '../../lib/store'
import { num, pct, rupees } from '../../lib/format'
import { sampleSizePerArm, twoProportion, wilson } from '../../lib/stats'
import { SimTag, Tag } from '../../components/ui'
import { ChartFrame, IntervalPlot } from '../../components/charts'

export default function Experiment() {
  useDocumentTitle('Experiment 01 · Growth Engine')
  const { A, B } = EXPERIMENT.variants
  const t = twoProportion(A.registrations, A.visitors, B.registrations, B.visitors)
  const ciA = wilson(A.registrations, A.visitors)
  const ciB = wilson(B.registrations, B.visitors)
  const shareA = A.sharers / A.registrations
  const shareB = B.sharers / B.registrations
  const shareTest = twoProportion(A.sharers, A.registrations, B.sharers, B.registrations)
  const needed = sampleSizePerArm(0.11, 0.5)
  const s = useAppState()

  const live = useMemo(() => {
    const real = s.events.filter((e) => !e.simulated)
    const by = (v: 'A' | 'B') => ({
      visits: real.filter((e) => e.type === 'visit' && e.variant === v).length,
      regs: real.filter((e) => e.type === 'register' && e.variant === v).length,
    })
    return { A: by('A'), B: by('B') }
  }, [s.events])

  const variants = [
    { key: 'A' as const, v: A, ci: ciA, winner: false },
    { key: 'B' as const, v: B, ci: ciB, winner: true },
  ]

  return (
    <div className="container console-page">
      <header className="cp-head">
        <div>
          <p className="t-eyebrow">
            Experiment {EXPERIMENT.id} · {EXPERIMENT.name}
          </p>
          <h1 className="t-heading">
            Does a <em>career</em> promise beat a <em>learning</em> promise?
          </h1>
        </div>
        <div className="xp-tags">
          <Tag tone="success">Concluded · Day 5</Tag>
          <SimTag>Simulated experiment</SimTag>
        </div>
      </header>

      <section className="xp-hyp" aria-label="Hypothesis and design">
        <div>
          <p className="t-eyebrow">Hypothesis</p>
          <blockquote>{EXPERIMENT.hypothesis}</blockquote>
        </div>
        <dl className="xp-facts">
          <div>
            <dt>Window</dt>
            <dd>{EXPERIMENT.window}</dd>
          </div>
          <div>
            <dt>Split</dt>
            <dd>{EXPERIMENT.split}</dd>
          </div>
          <div>
            <dt>Primary</dt>
            <dd>{EXPERIMENT.primary}</dd>
          </div>
          <div>
            <dt>Guardrail</dt>
            <dd>Share rate. A winning headline must not attract people who don’t pass it on.</dd>
          </div>
          <div>
            <dt>Planned n</dt>
            <dd>
              ≈{num(needed)} per arm: a 50% lift on an 11% baseline at 80% power. Sized for a big effect on purpose,
              since 7 days only allow ~1,400 test visitors. Smaller effects would go unseen. Reached: {num(A.visitors)}{' '}
              and {num(B.visitors)}.
            </dd>
          </div>
        </dl>
      </section>

      <section className="xp-variants" aria-label="Variants and results">
        {variants.map(({ key, v, ci, winner }) => (
          <article key={key} className={`xp-variant${winner ? ' is-winner' : ''}`}>
            <div className="xp-variant__head">
              <p className="xp-variant__label">Variant {v.label}</p>
              {winner ? <Tag tone="signal">Winner · shipped</Tag> : <Tag>Control</Tag>}
            </div>
            <div className="xp-thumb" aria-label={`Landing page with headline: ${v.headline}`}>
              <p className="xp-thumb__eyebrow">Free live workshop — Build your first AI project in 60 minutes</p>
              <p className="xp-thumb__h">{v.headline}</p>
              <span className="xp-thumb__btn">Reserve my seat →</span>
              <p className="xp-thumb__ad">
                <span className="t-mono">Matching ad · </span>“{v.ad}”
              </p>
            </div>
            <dl className="xp-variant__stats">
              <div>
                <dt>Visitors</dt>
                <dd>{num(v.visitors)}</dd>
              </div>
              <div>
                <dt>Registrations</dt>
                <dd>{num(v.registrations)}</dd>
              </div>
              <div>
                <dt>Conversion</dt>
                <dd>{pct(ci.p)}</dd>
              </div>
            </dl>
            <Link to={`/?v=${key.toLowerCase()}`} className="btn btn--ghost btn--sm">
              <span>Open variant {key} on the landing page</span>
            </Link>
          </article>
        ))}
      </section>

      <section className="xp-verdict" aria-labelledby="verdict-title">
        <div>
          <h2 id="verdict-title" className="sr-only">Result</h2>
          <dl className="xp-verdict__stats">
            <div>
              <dt>Relative lift</dt>
              <dd>
                +{pct(t.lift, 0)}
                <small>B over A</small>
              </dd>
            </div>
            <div>
              <dt>p-value</dt>
              <dd>
                {t.pValue < 0.001 ? '<0.001' : t.pValue.toFixed(3)}
                <small>two-proportion z = {t.z.toFixed(2)}</small>
              </dd>
            </div>
            <div>
              <dt>95% CI, difference</dt>
              <dd>
                +{(t.diffLo * 100).toFixed(1)} to +{(t.diffHi * 100).toFixed(1)}
                <small>percentage points</small>
              </dd>
            </div>
          </dl>
          <ChartFrame
            question="How sure are we?"
            answer="Each line is a 95% confidence interval for the conversion rate. They barely overlap, and the interval for the difference stays above zero. B is better, not just luckier."
          >
            <IntervalPlot
              rows={[
                { label: 'A · Learning', p: ciA.p, lo: ciA.lo, hi: ciA.hi },
                { label: 'B · Career', p: ciB.p, lo: ciB.lo, hi: ciB.hi, winner: true },
              ]}
            />
          </ChartFrame>

          <table className="table xp-guard">
            <caption className="sr-only">Guardrail and cost metrics</caption>
            <thead>
              <tr>
                <th>Secondary metric</th>
                <th className="num">A</th>
                <th className="num">B</th>
                <th>Read</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Shared their link (guardrail)</td>
                <td className="num">{pct(shareA, 0)}</td>
                <td className="num">{pct(shareB, 0)}</td>
                <td className="t-small">
                  B registrants share more too (p = {shareTest.pValue.toFixed(2)}). The guardrail holds.
                </td>
              </tr>
              <tr>
                <td>Paid cost per registration</td>
                <td className="num">{rupees(A.adSpend / A.adRegs)}</td>
                <td className="num">{rupees(B.adSpend / B.adRegs)}</td>
                <td className="t-small">
                  {rupees(500)} each. Small sample, so we read it as a direction and not a verdict.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <aside className="decision" aria-labelledby="decision-title">
          <p className="t-eyebrow">Decision</p>
          <h3 id="decision-title">Ship B everywhere, then put the remaining ₹1,000 behind it.</h3>
          <p>
            The test was a message test, not a page test, so the win carries to every channel. The community copy
            changes too, not just the landing page.
          </p>
          <ol className="timeline">
            <li>
              <span className="t-mono">D3</span>
              <span>Test starts. ₹500 per variant, landing page split 50/50.</span>
            </li>
            <li>
              <span className="t-mono">D5</span>
              <span>Read at noon. B ships to 100% of landing traffic.</span>
            </li>
            <li>
              <span className="t-mono">D5</span>
              <span>Ambassador messages rewritten: “an AI project for your resume”.</span>
            </li>
            <li>
              <span className="t-mono">D6</span>
              <span>₹1,000 into B ads. Projected CPR drops from ₹25 to about ₹20.</span>
            </li>
          </ol>
        </aside>
      </section>

      <section aria-labelledby="learn-title">
        <div className="section-title">
          <h2 id="learn-title" className="t-title">What we learned, and what we didn’t</h2>
        </div>
        <div className="xp-learn">
          <div>
            <p className="t-eyebrow">Learned</p>
            <h3 className="t-title">Outcome beats topic.</h3>
            <p>
              Final-years respond to what the hour does for them (a resume line) more than to what it teaches (AI).
              That changes how every later campaign gets written.
            </p>
          </div>
          <div>
            <p className="t-eyebrow">Learned</p>
            <h3 className="t-title">The winner also spreads better.</h3>
            <p>
              B registrants shared their link {pct(shareB / shareA - 1, 0)} more often. A message people are happy
              to forward is worth twice: once to them, once to their friends.
            </p>
          </div>
          <div>
            <p className="t-eyebrow">Not yet known</p>
            <h3 className="t-title">Does it change who shows up?</h3>
            <p>
              Registration isn’t attendance. On Day 8, compare show-up rates by variant. A headline that converts but
              doesn’t attend would be a hollow win.
            </p>
          </div>
        </div>
      </section>

      <section className="live" aria-labelledby="xp-live-title">
        <div className="live__head">
          <h2 id="xp-live-title" className="t-title">Live from this browser</h2>
          <Tag tone="success">Real events</Tag>
        </div>
        <p className="t-small t-muted live__lede">
          The variant switch is real. This browser currently gets variant <strong>{currentVariant()}</strong>. Change it
          from Demo controls, or open <Link to="/?v=a">/?v=a</Link>.
        </p>
        <dl className="live__grid">
          <div>
            <dt>A · visits</dt>
            <dd className="t-tnum">{live.A.visits}</dd>
          </div>
          <div>
            <dt>A · registrations</dt>
            <dd className="t-tnum">{live.A.regs}</dd>
          </div>
          <div>
            <dt>B · visits</dt>
            <dd className="t-tnum">{live.B.visits}</dd>
          </div>
          <div>
            <dt>B · registrations</dt>
            <dd className="t-tnum">{live.B.regs}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
