import { useMemo, useState, type ReactNode } from 'react'
import { CHALLENGE, DAYS } from '../../data/campaign'
import { useDocumentTitle } from '../../lib/hooks'
import { SCENARIOS, collegesToClose, runModel, type ModelInputs } from '../../lib/model'
import { num, pct, rupees } from '../../lib/format'
import { Button, CountUp, Tag } from '../../components/ui'

type Key = keyof ModelInputs

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  hint,
  onChange,
}: {
  id: Key
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  hint?: ReactNode
  onChange: (k: Key, v: number) => void
}) {
  const fill = `${((value - min) / (max - min)) * 100}%`
  return (
    <div className="slider">
      <label htmlFor={`m-${id}`}>{label}</label>
      <output htmlFor={`m-${id}`}>{format(value)}</output>
      <input
        id={`m-${id}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--fill' as string]: fill }}
        onChange={(e) => onChange(id, Number(e.target.value))}
        aria-valuetext={format(value)}
      />
      {hint && <span className="slider__hint">{hint}</span>}
    </div>
  )
}

const P = (v: number) => pct(v, 1)
const P0 = (v: number) => pct(v, 0)

export default function Model() {
  useDocumentTitle('Model & plan · Growth Engine')
  const [inputs, setInputs] = useState<ModelInputs>(SCENARIOS.base)
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS | 'custom'>('base')
  const out = useMemo(() => runModel(inputs), [inputs])
  const target = CHALLENGE.target
  const gap = target - out.total
  const extraColleges = collegesToClose(gap, inputs)

  const set = (k: Key, v: number) => {
    setInputs((x) => ({ ...x, [k]: v }))
    setScenario('custom')
  }

  const max = Math.max(out.total, target) * 1.08
  const parts = [
    { label: 'College communities', v: out.communities, color: 'var(--series-communities)' },
    { label: 'Referrals', v: out.referrals, color: 'var(--series-referrals)' },
    { label: 'Paid', v: out.paid, color: 'var(--series-paid)' },
  ]

  return (
    <div className="container console-page">
      <header className="cp-head">
        <div>
          <p className="t-eyebrow">Growth model · how 500 adds up</p>
          <h1 className="t-heading">
            Three channels, one loop, <em>every number an assumption.</em>
          </h1>
        </div>
        <Tag tone="assumption">Target / assumption</Tag>
      </header>

      <div className="presets" role="group" aria-label="Scenario">
        {(['conservative', 'base', 'ambitious'] as const).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={scenario === k ? 'primary' : 'secondary'}
            aria-pressed={scenario === k}
            onClick={() => {
              setInputs(SCENARIOS[k])
              setScenario(k)
            }}
          >
            {k[0].toUpperCase() + k.slice(1)}
          </Button>
        ))}
        {scenario === 'custom' && <Tag>Custom</Tag>}
      </div>

      <div className="model">
        <div className="model__inputs">
          <section className="model__group" aria-labelledby="g-com">
            <div className="model__group-head">
              <h2 id="g-com" className="t-title">
                <span className="swatch" style={{ background: 'var(--series-communities)' }} />
                College communities
              </h2>
              <p className="model__group-out">
                <strong>{num(out.communities)}</strong> · ₹0
              </p>
            </div>
            <Slider id="colleges" label="Colleges with an ambassador" value={inputs.colleges} min={5} max={40} step={1} format={(v) => `${v}`} onChange={set} />
            <Slider id="groupsPerCollege" label="Groups per college (class, branch, club)" value={inputs.groupsPerCollege} min={1} max={6} step={1} format={(v) => `${v}`} onChange={set} />
            <Slider id="membersPerGroup" label="Members per group" value={inputs.membersPerGroup} min={80} max={400} step={10} format={(v) => `${v}`} onChange={set} />
            <Slider id="clickRate" label="Members who open the link" value={inputs.clickRate} min={0.03} max={0.25} step={0.005} format={P} onChange={set} hint="A classmate’s message, not an ad" />
            <Slider id="landingConversion" label="Visitors who register (warm)" value={inputs.landingConversion} min={0.05} max={0.3} step={0.005} format={P} onChange={set} />
            <p className="model__formula">
              {inputs.colleges} × {inputs.groupsPerCollege} × {inputs.membersPerGroup} = {num(out.reach)} reached → {num(out.communityVisits)} visits → {num(out.communities)}
            </p>
          </section>

          <section className="model__group" aria-labelledby="g-paid">
            <div className="model__group-head">
              <h2 id="g-paid" className="t-title">
                <span className="swatch" style={{ background: 'var(--series-paid)' }} />
                Paid experiment
              </h2>
              <p className="model__group-out">
                <strong>{num(out.paid)}</strong> · {rupees(inputs.budget)}
              </p>
            </div>
            <Slider id="cpc" label="Cost per click (Instagram, students)" value={inputs.cpc} min={1} max={8} step={0.25} format={(v) => rupees(v, 2)} onChange={set} hint="The weakest assumption in the plan" />
            <Slider id="paidConversion" label="Paid visitors who register (cold)" value={inputs.paidConversion} min={0.03} max={0.2} step={0.005} format={P} onChange={set} />
            <p className="model__formula">
              {rupees(inputs.budget)} ÷ {rupees(inputs.cpc, 2)} = {num(out.paidClicks)} clicks → {num(out.paid)} registrations · CPR {rupees(out.cpr, 0)}
            </p>
          </section>

          <section className="model__group" aria-labelledby="g-ref">
            <div className="model__group-head">
              <h2 id="g-ref" className="t-title">
                <span className="swatch" style={{ background: 'var(--series-referrals)' }} />
                Referral loop
              </h2>
              <p className="model__group-out">
                <strong>{num(out.referrals)}</strong> · ₹0
              </p>
            </div>
            <Slider id="shareRate" label="Registrants who share their code" value={inputs.shareRate} min={0.1} max={0.7} step={0.01} format={P0} onChange={set} />
            <Slider id="refsPerSharer" label="Friends who register, per sharer" value={inputs.refsPerSharer} min={0.2} max={2} step={0.05} format={(v) => v.toFixed(2)} onChange={set} />
            <p className="model__formula">
              {num(out.communities + out.paid)} direct × {P0(inputs.shareRate)} × {inputs.refsPerSharer.toFixed(2)} = {num(out.referrals)} · k = {out.k.toFixed(2)} (first order only; friends-of-friends left out)
            </p>
          </section>
        </div>

        <aside className="model__out" aria-live="polite" aria-label="Model output">
          <p className="t-eyebrow">Modelled registrations</p>
          <p className="model__total">
            <CountUp value={out.total} />
            <span>/ {target}</span>
          </p>
          <div className="stackbar-wrap">
            <div className="stackbar" aria-hidden="true">
              {parts.map((p) => (
                <span key={p.label} style={{ flexGrow: p.v, flexBasis: 0, background: p.color }} />
              ))}
              <span style={{ flexGrow: Math.max(0, max - out.total), flexBasis: 0, background: 'transparent' }} />
            </div>
            <span className="stackbar-wrap__target" style={{ left: `${(target / max) * 100}%` }}>
              <span>500</span>
            </span>
          </div>
          <dl className="model__rows">
            {parts.map((p) => (
              <div key={p.label}>
                <dt>
                  <span className="swatch" style={{ background: p.color }} />
                  {p.label}
                </dt>
                <dd>{num(p.v)}</dd>
              </div>
            ))}
            <div>
              <dt>Blended cost per registration</dt>
              <dd>{rupees(out.blendedCost, 2)}</dd>
            </div>
          </dl>
          {gap > 0 ? (
            <p className="note note--warning">
              <strong>{num(gap)} short.</strong> Cheapest fix: {extraColleges} more college{extraColleges > 1 ? 's' : ''}{' '}
              with ambassadors, which costs ₹0. More ad money is the last resort, not the first.
            </p>
          ) : (
            <p className="note note--success">
              <strong>Clears 500 by {num(-gap)}.</strong> The margin is the buffer for attendance drop-off and
              duplicate registrations.
            </p>
          )}
        </aside>
      </div>

      <section className="budget" aria-labelledby="budget-title">
        <div>
          <h2 id="budget-title" className="t-title">Where the ₹2,000 goes</h2>
          <p className="t-small t-muted" style={{ marginTop: 8 }}>
            All of it buys one thing: a learning. The volume comes from free channels.
          </p>
          <div className="budget__bar" aria-hidden="true">
            <span style={{ flex: 1 }}>TEST ₹1,000</span>
            <span style={{ flex: 1 }}>SCALE ₹1,000</span>
          </div>
          <p className="t-small t-muted">
            Ambassadors, referral rewards and the Starter Kit cost ₹0 in cash. They’re paid in status, a certificate
            and first access.
          </p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th className="num">Spend</th>
              <th>What it buys</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="t-mono">D3–D5</td>
              <td className="num">₹500 + ₹500</td>
              <td>Message test, ending Day 5 at noon. Ad A sends to page A, ad B to page B.</td>
            </tr>
            <tr>
              <td className="t-mono">D6–D7</td>
              <td className="num">₹1,000</td>
              <td>The winning message, scaled</td>
            </tr>
            <tr>
              <td className="t-mono">All week</td>
              <td className="num">₹0</td>
              <td>15 ambassadors · referral rewards · campus leaderboard · WhatsApp reminders</td>
            </tr>
            <tr>
              <td><strong>Total</strong></td>
              <td className="num"><strong>₹2,000</strong></td>
              <td />
            </tr>
          </tbody>
        </table>
      </section>

      <section className="plan" aria-labelledby="plan-title">
        <div className="section-title">
          <h2 id="plan-title" className="t-title">The 7 days</h2>
          <Tag>Plan</Tag>
        </div>
        <table className="table plan-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Focus</th>
              <th>Main move</th>
              <th className="num">Spend</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((d) => (
              <tr key={d.day}>
                <td>
                  <span className="t-mono">D{d.day}</span>
                </td>
                <td className="plan-table__focus">{d.focus}</td>
                <td>{d.move}</td>
                <td className="num">{d.spend ? rupees(d.spend) : '₹0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="next" className="next" aria-labelledby="next-title" style={{ marginTop: 'var(--s-9)' }}>
        <div className="section-title">
          <h2 id="next-title" className="t-title">Experiment backlog</h2>
          <Tag tone="assumption">Proposed</Tag>
        </div>
        <ol className="next-list">
          <li>
            <span className="t-mono">EXP 02</span>
            <div>
              <strong>Show the three projects above the fold</strong>
              <p>The funnel’s biggest drop is visit → form start (26%). Hypothesis: seeing the actual output earlier lifts form starts.</p>
            </div>
            <Tag>Funnel</Tag>
          </li>
          <li>
            <span className="t-mono">EXP 03</span>
            <div>
              <strong>Pre-filled WhatsApp message vs bare link</strong>
              <p>Most sharing happens in class groups. Test whether a ready-made message raises share rate above 40%.</p>
            </div>
            <Tag>Referral</Tag>
          </li>
          <li>
            <span className="t-mono">EXP 04</span>
            <div>
              <strong>Reminder timing: T-24h vs T-2h</strong>
              <p>Registrations only matter if people attend. Measure show-up rate, the metric that comes after this brief.</p>
            </div>
            <Tag>Attendance</Tag>
          </li>
        </ol>
      </section>
    </div>
  )
}
