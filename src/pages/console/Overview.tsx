import { useMemo, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AUDIENCE, CHALLENGE, CHANNELS, DAYS, TODAY, cumulative, dayTotal } from '../../data/campaign'
import { useDocumentTitle } from '../../lib/hooks'
import { useAppState } from '../../lib/store'
import { num, pct, rupees } from '../../lib/format'
import { CountUp, Ruler, Stat, Tag } from '../../components/ui'
import { ChannelRows, ChartFrame, Funnel, Legend, SERIES, ShareBars, StackedColumns } from '../../components/charts'

export default function Overview() {
  useDocumentTitle('Overview · Growth Engine')
  const [day, setDay] = useState(TODAY)
  const c = useMemo(() => cumulative(day), [day])
  const finalC = useMemo(() => cumulative(7), [])
  const s = useAppState()

  const target = CHALLENGE.target
  const expected = Math.round((target * day) / 7)
  const gapToPace = c.total - expected
  const remainingDays = 7 - day
  const neededPerDay = remainingDays > 0 ? Math.max(0, (target - c.total) / remainingDays) : 0
  const cr = c.visits ? c.total / c.visits : 0
  const paidCpr = c.regs.paid ? c.spend / c.regs.paid : 0
  const blended = c.total ? c.spend / c.total : 0
  const refShare = c.total ? c.regs.referrals / c.total : 0
  const k = c.total - c.regs.referrals > 0 ? c.regs.referrals / (c.total - c.regs.referrals) : 0
  const isFinal = day === 7

  const stacks = DAYS.map((d) => ({
    day: d.day,
    label: `Day ${d.day} · ${d.date}`,
    values: d.regs,
    projected: d.day > day,
  }))

  const channelRows = CHANNELS.map((ch) => {
    const series = SERIES.find((x) => x.id === ch.id)!
    const actual = c.regs[ch.id]
    const exp = ch.target ? Math.round((ch.target * day) / 7) : 0
    const notes: Record<string, string> = {
      communities:
        day >= 4 ? 'Slowing from 71/day on Day 2. Same groups, same message, so fatigue. Day 6 second wave uses B copy.' : 'Day 2 spike when ambassadors posted.',
      referrals: day >= 4 ? 'The leaderboard launch on Day 4 lifted it to 34 that day.' : 'Starts slowly. Needs a base of registrants to share.',
      paid: day >= 3 ? `${rupees(c.spend)} spent so far. B ads cost ${rupees(20)} per registration vs ${rupees(33)} for A.` : 'Starts Day 3 with the A/B test.',
      organic: 'Forwards and word of mouth. Not in the plan.',
    }
    return { id: ch.id, label: ch.label, color: series.color, actual, target: ch.target, expected: exp, note: notes[ch.id] }
  })

  const live = useMemo(() => {
    const real = s.events.filter((e) => !e.simulated)
    const count = (t: string) => real.filter((e) => e.type === t).length
    return {
      visits: count('visit'),
      cta: count('cta_click'),
      starts: count('form_start'),
      regs: count('register'),
      shares: real.filter((e) => e.type.startsWith('share_')).length,
      refVisits: count('ref_visit'),
    }
  }, [s.events])

  return (
    <div className="container console-page">
      <header className="cp-head">
        <div>
          <p className="t-eyebrow">Campaign overview · 12 → 18 Oct</p>
          <h1 className="t-heading">
            Can we get to <em>500</em> registrations in 7 days, on ₹2,000?
          </h1>
        </div>
      </header>

      <DayScrubber day={day} onChange={setDay} />

      {/* ------------------------------------------------ Hero figure */}
      <section className="hero-fig" aria-label="Registrations against target">
        <div className="hero-fig__num">
          <p className="hero-fig__label">Registrations {isFinal ? 'at close' : `by end of Day ${day}`}</p>
          <p className="hero-fig__value">
            <CountUp value={c.total} />
            <span className="hero-fig__of">/ {target}</span>
          </p>
          <p className="hero-fig__pct">
            <CountUp value={c.total / target} format={(v) => pct(v)} /> of target
          </p>
        </div>
        <div className="hero-fig__status">
          {isFinal ? (
            <p className={`pace ${c.total >= target ? 'pace--ok' : 'pace--behind'}`}>
              <strong>{c.total >= target ? `Target reached: ${num(c.total - target)} over.` : `${num(target - c.total)} short.`}</strong>{' '}
              Day 7 total, simulated.
            </p>
          ) : (
            <p className={`pace ${gapToPace >= 0 ? 'pace--ok' : 'pace--behind'}`}>
              <strong>
                {gapToPace >= 0 ? `${gapToPace} ahead of` : `${-gapToPace} behind`} linear pace
              </strong>{' '}
              (expected {expected} by Day {day}). Need <strong>{Math.ceil(neededPerDay)}/day</strong> for the last{' '}
              {remainingDays} day{remainingDays > 1 ? 's' : ''}. The plan projects <strong>{finalC.total}</strong> at
              close.
            </p>
          )}
        </div>
        <div className="hero-fig__ruler">
          <Ruler
            label={`${c.total} of ${target} registrations`}
            min={0}
            max={550}
            step={10}
            major={50}
            value={c.total}
            fill
            tickLabel={(n) => (n % 100 === 0 ? n : null)}
            milestones={[
              ...(isFinal ? [] : [{ at: expected, label: `Pace ${expected}` }]),
              { at: target, label: 'Target' },
            ]}
          />
        </div>
      </section>

      {/* ------------------------------------------------ KPI strip */}
      <dl className="kpis cp-kpis" style={{ ['--kpi-cols' as string]: 5 }}>
        <Stat label="Landing conversion" value={pct(cr)} note={`${num(c.total)} of ${num(c.visits)} visitors`} />
        <Stat
          label="Paid cost / registration"
          value={c.regs.paid ? rupees(paidCpr, 0) : '—'}
          note={c.regs.paid ? `${rupees(c.spend)} spent of ₹2,000` : 'paid starts Day 3'}
        />
        <Stat label="Blended cost / registration" value={rupees(blended, 2)} note="all spend ÷ all registrations" />
        <Stat label="From referrals" value={pct(refShare)} note={`${c.regs.referrals} registrations`} tone="signal" />
        <Stat label="Viral factor k" value={k.toFixed(2)} note="referred ÷ direct registrants" />
      </dl>

      {/* ------------------------------------------------ Charts */}
      <div className="cp-grid">
        <ChartFrame
          question="Are we on pace, day by day?"
          answer={
            <>
              The dashed line is the {Math.round(target / 7)}/day a flat plan needs. Days 2–4 beat it. Day 5 dipped
              once paid paused for the test read, which is why Day 6 puts the remaining ₹1,000 behind the winner.
            </>
          }
          aside={<Legend items={SERIES.map((s) => ({ label: s.label, color: s.color }))} />}
          table={
            <table className="table">
              <thead>
                <tr>
                  <th>Day</th>
                  {SERIES.map((s) => <th key={s.id} className="num">{s.label}</th>)}
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map((d) => (
                  <tr key={d.day}>
                    <td>D{d.day} {d.day > day ? '(proj.)' : ''}</td>
                    {SERIES.map((s) => <td key={s.id} className="num">{d.regs[s.id]}</td>)}
                    <td className="num">{dayTotal(d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <StackedColumns data={stacks} reference={target / 7} refLabel={`${Math.round(target / 7)}/day needed`} />
        </ChartFrame>

        <ChartFrame
          question="Which channel is carrying us?"
          answer="The bar is actual. The black tick is the 7-day target, the grey tick is where the plan expected the channel to be today."
        >
          <ChannelRows rows={channelRows} />
        </ChartFrame>

        <div className="cp-split">
          <ChartFrame
            question="Where do we lose people?"
            answer={
              <>
                Most visitors never start the form. That’s the next test to run (
                <Link to="/console/model#next">Experiment 02</Link>), ahead of anything after registration.
              </>
            }
          >
            <Funnel
              steps={[
                { label: 'Visited the landing page', value: c.visits },
                { label: 'Started the form', value: c.formStarts },
                { label: 'Registered', value: c.total },
                { label: 'Shared their link', value: c.sharers },
                { label: 'Brought ≥1 friend', value: c.referrers, hint: `${c.regs.referrals} friends in total` },
              ]}
            />
          </ChartFrame>

          <ChartFrame
            question="Are we reaching the right student?"
            answer={`${pct(AUDIENCE.finalYear, 0)} of registrants are in final year. The career framing reaches the people the brief asked for.`}
          >
            <ShareBars
              rows={[
                { label: 'Final year (2027)', share: AUDIENCE.finalYear },
                ...AUDIENCE.branches.map((b) => ({ label: b.label, share: b.share })),
              ]}
            />
          </ChartFrame>
        </div>
      </div>

      {/* ------------------------------------------------ Live from this browser */}
      <section className="live" aria-labelledby="live-title">
        <div className="live__head">
          <h2 id="live-title" className="t-title">Live from this browser</h2>
          <Tag tone="success">Real events</Tag>
        </div>
        <p className="t-small t-muted live__lede">
          The product records real events as you click through it. These are kept separate from the simulated numbers
          above, which they don’t change.
        </p>
        <dl className="live__grid">
          {[
            ['Landing visits', live.visits],
            ['CTA clicks', live.cta],
            ['Form starts', live.starts],
            ['Registrations', live.regs],
            ['Share actions', live.shares],
            ['Invite-link visits', live.refVisits],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt>{k}</dt>
              <dd className="t-tnum">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

function DayScrubber({ day, onChange }: { day: number; onChange: (d: number) => void }) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(7, day + 1))
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(1, day - 1))
    }
  }
  return (
    <div className="scrub">
      <p id="scrub-label" className="scrub__label t-eyebrow">
        Show campaign as of
      </p>
      <div className="scrub__track" role="radiogroup" aria-labelledby="scrub-label" onKeyDown={onKey}>
        {DAYS.map((d) => (
          <button
            key={d.day}
            type="button"
            role="radio"
            aria-checked={d.day === day}
            tabIndex={d.day === day ? 0 : -1}
            className={`scrub__day${d.day === day ? ' is-on' : ''}${d.day > TODAY ? ' is-future' : ''}${d.day <= day ? ' is-past' : ''}`}
            onClick={() => onChange(d.day)}
          >
            <span className="scrub__n">Day {d.day}</span>
            <span className="scrub__focus">{d.focus}</span>
            <span className="scrub__date t-mono">{d.date}</span>
          </button>
        ))}
      </div>
      <p className="scrub__move t-small" aria-live="polite">
        <span className="t-mono">D{day}</span> {DAYS[day - 1].move}
        {day > TODAY && <span className="scrub__proj"> Days after Day {TODAY} are the plan’s projection.</span>}
      </p>
    </div>
  )
}
