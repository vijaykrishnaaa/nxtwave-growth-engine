import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { WORKSHOP } from '../data/campaign'
import { useDocumentTitle } from '../lib/hooks'
import { emailTaken, findByCode, register, signInAs, track } from '../lib/store'
import { firstName } from '../lib/format'
import { Button, Field, SelectField } from '../components/ui'

const BRANCHES = ['CSE', 'IT', 'AI & DS / AI & ML', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other']
const YEARS = ['2027 (final year)', '2026 (already graduated)', '2028', '2029']

type Values = {
  name: string
  email: string
  phone: string
  college: string
  branch: string
  gradYear: string
}

type Errors = Partial<Record<keyof Values, string>>

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Enter your name as you’d like it on the certificate.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email doesn’t look complete.'
  const digits = v.phone.replace(/\D/g, '')
  if (v.phone.trim() && !(digits.length === 10 || (digits.length === 12 && digits.startsWith('91'))))
    e.phone = 'Use a 10-digit mobile number, or leave this empty.'
  if (v.college.trim().length < 3) e.college = 'Which college are you at?'
  if (!v.branch) e.branch = 'Pick your branch.'
  if (!v.gradYear) e.gradYear = 'Pick your graduation year.'
  return e
}

const ORDER: (keyof Values)[] = ['name', 'email', 'phone', 'college', 'branch', 'gradYear']

function readRef(param: string | null) {
  if (param) return param.toUpperCase()
  try {
    return sessionStorage.getItem('ge:ref')
  } catch {
    return null
  }
}

export default function Register() {
  useDocumentTitle('Reserve your seat · The 60-Minute Build')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const ref = readRef(params.get('ref'))
  const inviter = useMemo(() => (ref ? findByCode(ref) : null), [ref])

  const [v, setV] = useState<Values>({ name: '', email: '', phone: '', college: '', branch: '', gradYear: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [duplicate, setDuplicate] = useState<{ id: string; name: string } | null>(null)
  const started = useRef(false)
  const fields = useRef<Partial<Record<keyof Values, HTMLInputElement | HTMLSelectElement | null>>>({})

  const errors = validate(v)
  const show = (k: keyof Values) => (submitted || touched[k] ? errors[k] : undefined)
  const errorCount = Object.keys(errors).length

  const bind = (k: keyof Values) => ({
    name: k,
    value: v[k],
    ref: (el: HTMLInputElement | HTMLSelectElement | null) => (fields.current[k] = el),
    onChange: (e: { target: { value: string } }) => {
      setV((x) => ({ ...x, [k]: e.target.value }))
      if (k === 'email') setDuplicate(null)
    },
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    onFocus: () => {
      if (!started.current) {
        started.current = true
        track('form_start')
      }
    },
    error: show(k),
    disabled: loading,
  })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (errorCount) {
      const first = ORDER.find((k) => errors[k])
      if (first) fields.current[first]?.focus()
      return
    }
    const taken = emailTaken(v.email)
    if (taken) {
      setDuplicate({ id: taken.id, name: taken.name })
      fields.current.email?.focus()
      return
    }
    setLoading(true)
    // Simulated network round-trip so the loading state is honest about there being one in production
    await new Promise((r) => setTimeout(r, 650))
    const r = register({
      name: v.name.trim(),
      email: v.email.trim(),
      phone: v.phone.trim() || undefined,
      college: v.college.trim(),
      branch: v.branch,
      gradYear: v.gradYear.slice(0, 4),
      referredBy: inviter && ref ? ref : undefined,
    })
    track('register', { code: r.code })
    try {
      sessionStorage.removeItem('ge:ref')
    } catch {
      /* ignore */
    }
    navigate('/welcome')
  }

  return (
    <div className="container register">
      <div className="register__grid grid">
        <div className="register__main">
          <Link to="/" className="back t-small">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M13 7H2M6 3L2 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Back to the workshop
          </Link>
          <p className="t-eyebrow register__eyebrow">Seat reservation · Free</p>
          <h1 className="t-display-l">
            Reserve your seat<em>.</em>
          </h1>
          <p className="t-body-l register__lede">
            Six fields, about 40 seconds. We send the joining link to your email
            {` `}and, if you add it, WhatsApp.
          </p>

          <form className="register__form" onSubmit={onSubmit} noValidate aria-describedby="form-status">
            <p id="form-status" className="sr-only" aria-live="polite">
              {submitted && errorCount ? `${errorCount} field${errorCount > 1 ? 's need' : ' needs'} attention.` : ''}
            </p>

            <Field label="Full name" autoComplete="name" placeholder="e.g. Ananya Rao" {...bind('name')} />
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              {...bind('email')}
              error={
                duplicate
                  ? 'This email already has a seat.'
                  : show('email')
              }
            />
            {duplicate && (
              <p className="register__dup t-small">
                Looks like {firstName(duplicate.name)} registered already.{' '}
                <button
                  type="button"
                  className="linkish"
                  onClick={() => {
                    signInAs(duplicate.id)
                    navigate('/me')
                  }}
                >
                  Open my invites
                </button>
              </p>
            )}
            <Field
              label="WhatsApp number"
              optional
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="10-digit mobile"
              hint="Only for the joining link and one reminder."
              {...bind('phone')}
            />
            <Field label="College" autoComplete="organization" placeholder="Your college’s name" {...bind('college')} />
            <div className="register__pair">
              <SelectField label="Branch" options={BRANCHES} placeholder="Choose" {...bind('branch')} />
              <SelectField label="Graduating in" options={YEARS} placeholder="Choose" {...bind('gradYear')} />
            </div>

            <div className="register__submit">
              <Button type="submit" size="lg" arrow={!loading} loading={loading}>
                {loading ? 'Reserving your seat…' : 'Reserve my seat'}
              </Button>
              <p className="t-small t-muted">Free. No payment details, now or later.</p>
            </div>
          </form>
        </div>

        <aside className="register__aside" aria-label="Workshop summary">
          {ref && (
            <div className={`register__invite${inviter ? '' : ' is-unknown'}`}>
              {inviter ? (
                <>
                  <p className="t-eyebrow">Invited by</p>
                  <p className="register__inviter">
                    {inviter.name}
                    <span className="t-mono">{ref}</span>
                  </p>
                  <p className="t-small t-muted">Registering counts toward their reward.</p>
                </>
              ) : (
                <p className="t-small">
                  Invite code <span className="t-mono">{ref}</span> wasn’t recognised. You can still register.
                </p>
              )}
            </div>
          )}
          <dl className="register__summary">
            <div>
              <dt>Workshop</dt>
              <dd>Build Your First AI Project in 60 Minutes</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>
                {WORKSHOP.dateLabel}, {WORKSHOP.timeLabel}
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>Online, live</dd>
            </div>
          </dl>
          <p className="t-eyebrow register__get-title">You leave with</p>
          <ol className="register__get">
            <li>A deployed AI app with a public link</li>
            <li>The code on your GitHub</li>
            <li>One resume line you can defend in an interview</li>
            <li>Your own invite code, to bring friends</li>
          </ol>
        </aside>
      </div>
    </div>
  )
}
