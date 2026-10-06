import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import type { ChannelId } from '../data/campaign'
import { num, pct } from '../lib/format'

/* Series identity is fixed by entity, never by rank (dataviz rule). */
export const SERIES: { id: ChannelId; label: string; color: string }[] = [
  { id: 'communities', label: 'College communities', color: 'var(--series-communities)' },
  { id: 'referrals', label: 'Referrals', color: 'var(--series-referrals)' },
  { id: 'paid', label: 'Paid', color: 'var(--series-paid)' },
  { id: 'organic', label: 'Organic', color: 'var(--series-organic)' },
]

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(640)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <ul className="legend">
      {items.map((i) => (
        <li key={i.label}>
          <span
            className={`swatch${i.dashed ? ' swatch--dashed' : ''}`}
            style={{ background: i.dashed ? undefined : i.color, borderColor: i.color }}
          />
          {i.label}
        </li>
      ))}
    </ul>
  )
}

/** Wraps a chart with its question, its answer, and a table view. */
export function ChartFrame({
  question,
  answer,
  children,
  table,
  aside,
}: {
  question: string
  answer: ReactNode
  children: ReactNode
  table?: ReactNode
  aside?: ReactNode
}) {
  const [asTable, setAsTable] = useState(false)
  return (
    <figure className="chart">
      <figcaption className="chart__head">
        <div>
          <p className="chart__q">{question}</p>
          <p className="chart__a">{answer}</p>
        </div>
        <div className="chart__tools">
          {aside}
          {table && (
            <button type="button" className="chart__toggle" aria-pressed={asTable} onClick={() => setAsTable((x) => !x)}>
              {asTable ? 'Chart' : 'Table'}
            </button>
          )}
        </div>
      </figcaption>
      {asTable ? <div className="chart__table">{table}</div> : children}
    </figure>
  )
}

/* ---- Stacked daily columns with a "needed per day" reference --------- */

export type DayStack = { day: number; label: string; values: Record<ChannelId, number>; projected: boolean }

export function StackedColumns({ data, reference, refLabel }: { data: DayStack[]; reference: number; refLabel: string }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const height = 280
  const m = { t: 24, r: 8, b: 40, l: 36 }
  const iw = Math.max(200, width - m.l - m.r)
  const ih = height - m.t - m.b
  const totals = data.map((d) => SERIES.reduce((a, s) => a + d.values[s.id], 0))
  const max = Math.ceil(Math.max(...totals, reference) / 25) * 25
  const y = (v: number) => m.t + ih - (v / max) * ih
  const slot = iw / data.length
  const bw = Math.min(24, slot * 0.5)
  const ticks = Array.from({ length: max / 25 + 1 }, (_, i) => i * 25)
  const gap = 2

  return (
    <div ref={ref} className="chart__plot" onMouseLeave={() => setHover(null)}>
      <svg width={width} height={height} role="img" aria-label="Daily registrations by channel, stacked, with the daily pace needed to reach 500">
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--surface)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-3)" strokeWidth="1.2" />
          </pattern>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={m.l + iw} y1={y(t)} y2={y(t)} className="grid-line" />
            <text x={m.l - 8} y={y(t)} className="axis-text" textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = m.l + slot * i + slot / 2
          let acc = 0
          const segs = SERIES.map((s) => {
            const v = d.values[s.id]
            const y0 = y(acc)
            acc += v
            const y1 = y(acc)
            return { s, v, y0, y1 }
          }).filter((x) => x.v > 0)
          const total = totals[i]
          return (
            <g key={d.day} className={`col${hover === i ? ' is-hover' : ''}${d.projected ? ' is-projected' : ''}`}>
              {/* hit target bigger than the mark */}
              <rect
                x={m.l + slot * i}
                y={m.t}
                width={slot}
                height={ih}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${d.label}: ${total} registrations${d.projected ? ', projected' : ''}`}
              />
              {d.projected ? (
                <path
                  d={roundedTop(cx - bw / 2, y(total), bw, y(0) - y(total), 4)}
                  fill="url(#hatch)"
                  stroke="var(--ink-3)"
                  strokeWidth="1"
                  pointerEvents="none"
                />
              ) : (
                segs.map((g, k) => {
                  const top = k === segs.length - 1
                  const h = Math.max(0, g.y0 - g.y1 - (k > 0 ? gap : 0))
                  const yy = g.y1
                  return top ? (
                    <path key={g.s.id} d={roundedTop(cx - bw / 2, yy, bw, h, 4)} fill={g.s.color} pointerEvents="none" />
                  ) : (
                    <rect key={g.s.id} x={cx - bw / 2} y={yy} width={bw} height={h} fill={g.s.color} pointerEvents="none" />
                  )
                })
              )}
              <text x={cx} y={y(total) - 8} textAnchor="middle" className="value-text">
                {total}
              </text>
              <text x={cx} y={m.t + ih + 18} textAnchor="middle" className="axis-text">
                D{d.day}
              </text>
              {d.projected && (
                <text x={cx} y={m.t + ih + 32} textAnchor="middle" className="axis-text axis-text--faint">
                  proj.
                </text>
              )}
            </g>
          )
        })}
        <line x1={m.l} x2={m.l + iw} y1={y(reference)} y2={y(reference)} className="ref-line" />
        <text x={m.l + 6} y={y(reference) - 6} textAnchor="start" className="ref-text">
          {refLabel}
        </text>
        <line x1={m.l} x2={m.l + iw} y1={y(0)} y2={y(0)} className="baseline" />
      </svg>
      {hover !== null && (
        <div
          className="tip"
          style={{
            left: Math.min(width - 180, Math.max(0, m.l + slot * hover + slot / 2 - 90)),
            top: Math.max(0, y(totals[hover]) - 150),
          }}
        >
          <p className="tip__title">
            {data[hover].label}
            {data[hover].projected ? ' · projected' : ''}
          </p>
          {SERIES.map((s) => (
            <p key={s.id} className="tip__row">
              <span className="tip__key">
                <span className="swatch" style={{ background: s.color }} />
                {s.label}
              </span>
              <span>{data[hover].values[s.id]}</span>
            </p>
          ))}
          <p className="tip__row tip__total">
            <span>Total</span>
            <span>{totals[hover]}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0) return ''
  const rr = Math.min(r, h, w / 2)
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`
}

/* ---- Channel vs target: bar behind the label (after Plausible) ------- */

export function ChannelRows({
  rows,
}: {
  rows: { id: ChannelId; label: string; color: string; actual: number; target: number; expected: number; note: string }[]
}) {
  const max = Math.max(...rows.map((r) => Math.max(r.actual, r.target)), 1)
  return (
    <ul className="chrows">
      {rows.map((r) => {
        const ratio = r.expected > 0 ? r.actual / r.expected : null
        return (
          <li key={r.id} className="chrow">
            <div className="chrow__track" aria-hidden="true">
              <span className="chrow__bar" style={{ width: `${(r.actual / max) * 100}%`, background: r.color }} />
              {r.target > 0 && <span className="chrow__target" style={{ left: `${(r.target / max) * 100}%` }} />}
              {r.expected > 0 && <span className="chrow__expected" style={{ left: `${(r.expected / max) * 100}%` }} />}
            </div>
            <div className="chrow__text">
              <p className="chrow__label">
                <span className="swatch" style={{ background: r.color }} />
                {r.label}
              </p>
              <p className="chrow__nums">
                <strong>{num(r.actual)}</strong>
                <span>{r.target > 0 ? ` / ${num(r.target)} target` : ' · not in plan'}</span>
              </p>
            </div>
            <p className="chrow__note">
              {ratio !== null && (
                <span className={`chrow__pace ${ratio >= 1 ? 'is-ahead' : ratio >= 0.9 ? 'is-near' : 'is-behind'}`}>
                  {ratio >= 1 ? 'Ahead of plan' : ratio >= 0.9 ? 'Near plan' : 'Behind plan'} · {pct(ratio, 0)}
                </span>
              )}
              {r.note}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

/* ---- Funnel ------------------------------------------------------------ */

export function Funnel({ steps }: { steps: { label: string; value: number; hint?: string }[] }) {
  const first = steps[0]?.value || 1
  let worst = 1
  let worstRate = 1
  steps.forEach((s, i) => {
    if (i === 0) return
    const r = s.value / steps[i - 1].value
    if (r < worstRate) {
      worstRate = r
      worst = i
    }
  })
  return (
    <ol className="funnel">
      {steps.map((s, i) => {
        const rate = i > 0 ? s.value / steps[i - 1].value : null
        return (
          <li key={s.label} className={`funnel__step${i === worst ? ' is-leak' : ''}`}>
            <div className="funnel__row">
              <p className="funnel__label">
                <span className="t-mono funnel__i">{i + 1}</span>
                {s.label}
              </p>
              <p className="funnel__value">{num(s.value)}</p>
            </div>
            <div className="funnel__track" aria-hidden="true">
              <span className="funnel__bar" style={{ width: `${(s.value / first) * 100}%` }} />
            </div>
            {rate !== null && (
              <p className="funnel__rate">
                {pct(rate, 0)} of previous step{i === worst ? ' · biggest drop' : ''}
                {s.hint && <span> · {s.hint}</span>}
              </p>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ---- Confidence interval plot (experiment) --------------------------- */

export function IntervalPlot({
  rows,
  max = 0.25,
}: {
  rows: { label: string; p: number; lo: number; hi: number; winner?: boolean }[]
  max?: number
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const m = { l: 96, r: 24 }
  const iw = Math.max(160, width - m.l - m.r)
  const x = (v: number) => m.l + (v / max) * iw
  const rowH = 44
  const h = rows.length * rowH + 36
  const ticks = [0, 0.05, 0.1, 0.15, 0.2, 0.25].filter((t) => t <= max)
  return (
    <div ref={ref} className="chart__plot">
      <svg width={width} height={h} role="img" aria-label={rows.map((r) => `${r.label}: ${pct(r.p)} (95% CI ${pct(r.lo)} to ${pct(r.hi)})`).join('; ')}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={8} y2={h - 26} className="grid-line" />
            <text x={x(t)} y={h - 8} textAnchor="middle" className="axis-text">
              {pct(t, 0)}
            </text>
          </g>
        ))}
        {rows.map((r, i) => {
          const cy = 8 + rowH * i + rowH / 2
          const color = r.winner ? 'var(--signal)' : 'var(--ink-2)'
          return (
            <g key={r.label}>
              <text x={0} y={cy} dominantBaseline="middle" className="value-text">
                {r.label}
              </text>
              <line x1={x(r.lo)} x2={x(r.hi)} y1={cy} y2={cy} stroke={color} strokeWidth="2" strokeLinecap="round" />
              <line x1={x(r.lo)} x2={x(r.lo)} y1={cy - 6} y2={cy + 6} stroke={color} strokeWidth="2" />
              <line x1={x(r.hi)} x2={x(r.hi)} y1={cy - 6} y2={cy + 6} stroke={color} strokeWidth="2" />
              <circle cx={x(r.p)} cy={cy} r="6" fill={color} stroke="var(--surface)" strokeWidth="2" />
              <text x={x(r.hi) + 10} y={cy} dominantBaseline="middle" className="value-text">
                {pct(r.p)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ---- Simple proportion bars ------------------------------------------- */

export function ShareBars({ rows }: { rows: { label: string; share: number }[] }) {
  return (
    <ul className="sharebars">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="sharebars__text">
            <span>{r.label}</span>
            <span className="t-tnum">{pct(r.share, 0)}</span>
          </div>
          <div className="sharebars__track" aria-hidden="true">
            <span style={{ width: `${r.share * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
