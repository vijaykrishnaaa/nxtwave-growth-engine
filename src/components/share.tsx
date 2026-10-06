import { WORKSHOP } from '../data/campaign'
import { prettyLink, referralLink } from '../lib/format'
import { track, type Registrant } from '../lib/store'
import { Button, CountUp, Ruler, useToast } from './ui'

export const REWARDS = [
  { at: 3, name: 'AI Project Starter Kit', short: 'Starter Kit' },
  { at: 5, name: 'Live project review', short: 'Live review' },
]

export function nextReward(count: number) {
  return REWARDS.find((r) => count < r.at) ?? null
}

export function whatsappText(code: string) {
  return (
    `I just saved a seat for a free 60-minute live workshop: we build an AI project you can put on your resume. ` +
    `${WORKSHOP.dateLabel}, ${WORKSHOP.timeLabel}. Join with my link: ${referralLink(code)}`
  )
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers that block the async clipboard
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

export function SharePanel({ me, friends, compact }: { me: Registrant; friends: number; compact?: boolean }) {
  const toast = useToast()
  const next = nextReward(friends)

  return (
    <section className={`share${compact ? ' share--compact' : ''}`} aria-labelledby="share-title">
      <div className="share__code">
        <p id="share-title" className="t-eyebrow">Your invite code</p>
        <p className="share__codevalue t-mono">{me.code}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            if (await copy(me.code)) {
              track('share_copy_code', { code: me.code })
              toast('Code copied')
            }
          }}
        >
          Copy code
        </Button>
      </div>

      <div className="share__link">
        <p className="t-eyebrow">Your link</p>
        <p className="share__url t-mono">{prettyLink(me.code)}</p>
        <div className="share__actions">
          <Button
            size="sm"
            onClick={async () => {
              if (await copy(referralLink(me.code))) {
                track('share_copy_link', { code: me.code })
                toast('Link copied. Paste it in your class group')
              }
            }}
          >
            Copy link
          </Button>
          <a
            className="btn btn--secondary btn--sm share__wa"
            href={`https://wa.me/?text=${encodeURIComponent(whatsappText(me.code))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('share_whatsapp', { code: me.code })}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M7 1.2a5.8 5.8 0 0 0-5 8.7L1.2 12.8l3-.8A5.8 5.8 0 1 0 7 1.2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <span>Share on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="share__progress">
        <div className="share__count">
          <p className="share__fraction">
            <span className="share__n"><CountUp value={friends} /></span>
            <span className="share__of">/ 5 friends</span>
          </p>
          <p className="t-small share__next" aria-live="polite">
            {next ? (
              <>
                <strong>{next.at - friends === 1 ? 'One more' : `${next.at - friends} more`}</strong> to unlock the{' '}
                {next.name}.
              </>
            ) : (
              <strong className="share__done">Both rewards unlocked. Thank you for bringing your batch.</strong>
            )}
          </p>
        </div>
        <Ruler
          label={`${friends} of 5 friends registered`}
          min={0}
          max={5}
          step={1}
          major={1}
          value={Math.min(friends, 5)}
          fill
          tickLabel={(n) => n}
          milestones={REWARDS.map((r) => ({ at: r.at, label: r.short, sub: `${r.at} friends` }))}
        />
      </div>
    </section>
  )
}

export function downloadIcs() {
  const start = new Date(WORKSHOP.startsAt)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//60-Minute Build//Growth Engine prototype//EN',
    'BEGIN:VEVENT',
    `UID:60-minute-build-${start.getTime()}@prototype`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    'SUMMARY:Build Your First AI Project in 60 Minutes (live workshop)',
    'DESCRIPTION:Free live workshop. Bring a laptop. Joining link arrives by email.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'ai-workshop-18-oct.ics'
  a.click()
  URL.revokeObjectURL(url)
}
