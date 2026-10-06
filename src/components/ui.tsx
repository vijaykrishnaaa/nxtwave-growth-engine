import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { useCountUp } from '../lib/hooks'

/* ---- Button ------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'signal'
type Size = 'md' | 'lg' | 'sm'

const cls = (variant: Variant, size: Size, extra?: string) =>
  ['btn', `btn--${variant}`, `btn--${size}`, extra].filter(Boolean).join(' ')

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  arrow?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'primary', size = 'md', arrow, loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cls(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
})

type LinkBtnProps = LinkProps & { variant?: Variant; size?: Size; arrow?: boolean }

export function ButtonLink({ variant = 'primary', size = 'md', arrow, className, children, ...rest }: LinkBtnProps) {
  return (
    <Link className={cls(variant, size, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  )
}

export function Arrow({ dir = 'right' }: { dir?: 'right' | 'down' }) {
  return (
    <svg className="btn__arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"
      style={dir === 'down' ? { transform: 'rotate(90deg)' } : undefined}>
      <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

/* ---- Tag --------------------------------------------------------------- */

export function Tag({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'sim' | 'success' | 'warning' | 'signal' | 'assumption'
  children: ReactNode
}) {
  return <span className={`tag tag--${tone}`}>{children}</span>
}

export const SimTag = ({ children = 'Simulated data' }: { children?: ReactNode }) => (
  <Tag tone="sim">{children}</Tag>
)

/* ---- Fields ------------------------------------------------------------ */

type FieldShell = { label: string; hint?: string; error?: string; optional?: boolean }

export const Field = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldShell>(
  function Field({ label, hint, error, optional, id, className, ...rest }, ref) {
    const auto = useId()
    const fid = id ?? auto
    const hintId = hint ? `${fid}-hint` : undefined
    const errId = error ? `${fid}-err` : undefined
    return (
      <div className={['field', error && 'field--error', className].filter(Boolean).join(' ')}>
        <label htmlFor={fid} className="field__label">
          {label}
          {optional && <span className="field__optional">optional</span>}
        </label>
        <input
          ref={ref}
          id={fid}
          className="field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={[errId, hintId].filter(Boolean).join(' ') || undefined}
          {...rest}
        />
        {error ? (
          <p id={errId} className="field__error">{error}</p>
        ) : hint ? (
          <p id={hintId} className="field__hint">{hint}</p>
        ) : null}
      </div>
    )
  },
)

export const SelectField = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldShell & { options: string[]; placeholder?: string }
>(function SelectField({ label, hint, error, id, options, placeholder, className, ...rest }, ref) {
  const auto = useId()
  const fid = id ?? auto
  const errId = error ? `${fid}-err` : undefined
  return (
    <div className={['field', error && 'field--error', className].filter(Boolean).join(' ')}>
      <label htmlFor={fid} className="field__label">{label}</label>
      <div className="field__select">
        <select ref={ref} id={fid} className="field__input" aria-invalid={error ? true : undefined}
          aria-describedby={errId} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
      {error ? <p id={errId} className="field__error">{error}</p> : hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  )
})

/* ---- Ruler: the signature device -------------------------------------- */

export type Milestone = { at: number; label: ReactNode; sub?: ReactNode }

export function Ruler({
  min,
  max,
  step,
  major,
  value,
  fill,
  milestones = [],
  tickLabel,
  className,
  label,
}: {
  min: number
  max: number
  step: number
  major: number
  /** playhead position; omit for no playhead */
  value?: number
  /** fill the track up to the playhead */
  fill?: boolean
  milestones?: Milestone[]
  tickLabel?: (n: number) => ReactNode
  className?: string
  label: string
}) {
  const span = max - min
  const pos = (n: number) => `${((n - min) / span) * 100}%`
  const ticks: number[] = []
  for (let n = min; n <= max + 1e-9; n += step) ticks.push(Math.round(n * 1000) / 1000)
  const clamped = value === undefined ? undefined : Math.max(min, Math.min(max, value))

  return (
    <div
      className={['ruler', fill && 'ruler--fill', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={label}
    >
      <div className="ruler__track">
        {fill && clamped !== undefined && <div className="ruler__fill" style={{ width: pos(clamped) }} />}
        {ticks.map((n, ti) => {
          const isMajor = Math.abs((n - min) % major) < 1e-6 || Math.abs(((n - min) % major) - major) < 1e-6
          return (
            <span
              key={n}
              className={[
                'ruler__tick',
                isMajor && 'ruler__tick--major',
                ti === 0 && 'is-first',
                ti === ticks.length - 1 && 'is-last',
              ].filter(Boolean).join(' ')}
              style={{ left: pos(n) }}
            >
              {isMajor && tickLabel && <span className="ruler__num">{tickLabel(n)}</span>}
            </span>
          )
        })}
        {milestones.map((m) => (
          <span
            key={m.at}
            className={[
              'ruler__milestone',
              clamped !== undefined && clamped >= m.at && 'is-reached',
              (m.at - min) / span > 0.85 && 'is-end',
              (m.at - min) / span < 0.1 && 'is-start',
            ].filter(Boolean).join(' ')}
            style={{ left: pos(m.at) }}
          >
            <span className="ruler__mlabel">
              {m.label}
              {m.sub && <span className="ruler__msub">{m.sub}</span>}
            </span>
          </span>
        ))}
        {clamped !== undefined && (
          <span className="ruler__head" style={{ left: pos(clamped) }} aria-hidden="true">
            <svg width="12" height="9" viewBox="0 0 12 9"><path d="M0 0h12L6 9z" /></svg>
          </span>
        )}
      </div>
    </div>
  )
}

/* ---- Numbers ----------------------------------------------------------- */

export function CountUp({
  value,
  format = (n: number) => Math.round(n).toLocaleString('en-IN'),
  fromZero,
}: {
  value: number
  format?: (n: number) => string
  fromZero?: boolean
}) {
  const v = useCountUp(value, { fromZero })
  return <>{format(v)}</>
}

export function Stat({
  label,
  value,
  note,
  tone,
}: {
  label: ReactNode
  value: ReactNode
  note?: ReactNode
  tone?: 'signal' | 'warning' | 'success'
}) {
  return (
    <div className={`stat${tone ? ` stat--${tone}` : ''}`}>
      <dt className="stat__label">{label}</dt>
      <dd className="stat__value">{value}</dd>
      {note && <dd className="stat__note">{note}</dd>}
    </div>
  )
}

/* ---- Tabs -------------------------------------------------------------- */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { id: T; label: ReactNode }[]
  value: T
  onChange: (id: T) => void
  label: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + tabs.length) % tabs.length
    refs.current[next]?.focus()
    onChange(tabs[next].id)
  }
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => (refs.current[i] = el)}
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={value === t.id ? 0 : -1}
          className="tabs__tab"
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ---- Toast ------------------------------------------------------------- */

type ToastMsg = { id: number; text: string }
const ToastCtx = createContext<(text: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([])
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setItems((xs) => [...xs.slice(-2), { id, text }])
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 2400)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="toast">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

/* ---- States ------------------------------------------------------------ */

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="empty">
      <svg className="empty__mark" width="120" height="24" viewBox="0 0 120 24" aria-hidden="true">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={i * 10 + 0.5} x2={i * 10 + 0.5} y1={i % 5 === 0 ? 4 : 12} y2="24" />
        ))}
        <path d="M0 23.5h120" />
      </svg>
      <p className="t-title">{title}</p>
      {children && <div className="empty__body">{children}</div>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  )
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} style={{ width: `${90 - i * 18}%` }} />
      ))}
    </div>
  )
}

export function Note({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' | 'success' | 'error' }) {
  return <p className={`note note--${tone}`}>{children}</p>
}
