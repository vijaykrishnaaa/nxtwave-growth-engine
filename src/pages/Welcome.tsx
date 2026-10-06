import { useMemo } from 'react'
import { WORKSHOP } from '../data/campaign'
import { useDocumentTitle } from '../lib/hooks'
import { currentUser, referralStats, useAppState } from '../lib/store'
import { firstName } from '../lib/format'
import { ButtonLink, Button, EmptyState } from '../components/ui'
import { SharePanel, downloadIcs } from '../components/share'

export default function Welcome() {
  useDocumentTitle('Seat reserved · The 60-Minute Build')
  const s = useAppState()
  const me = currentUser(s)
  const stats = useMemo(() => (me ? referralStats(me.code, s) : null), [me, s])

  if (!me || !stats) {
    return (
      <div className="container section">
        <EmptyState
          title="No seat reserved in this browser yet"
          action={<ButtonLink to="/register" arrow>Reserve my seat</ButtonLink>}
        >
          Registrations are stored in this browser only. If you registered on another device, open your invite
          link there.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="welcome container">
      <div className="welcome__hero">
        <svg className="welcome__check" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="26" />
          <path d="M17 29l7.5 7.5L40 21" />
        </svg>
        <p className="t-eyebrow">Seat reserved</p>
        <h1 className="t-display-l">
          You’re in, <em>{firstName(me.name)}.</em>
        </h1>
        <p className="t-body-l welcome__sub">
          {WORKSHOP.dateLabel}, {WORKSHOP.timeLabel}. The joining link goes to <strong>{me.email}</strong>
          {me.phone ? ' and your WhatsApp' : ''}.
          <span className="welcome__simnote"> (Simulation: nothing is actually sent.)</span>
        </p>
      </div>

      <div className="welcome__body">
        <p className="welcome__ask t-heading">
          Bring three friends from your batch, <em>get the Starter Kit.</em>
        </p>
        <SharePanel me={me} friends={stats.friends.length} />
        <div className="welcome__ctas">
          <ButtonLink to="/me" size="lg" arrow>
            Open my invite dashboard
          </ButtonLink>
          <Button variant="secondary" size="lg" onClick={downloadIcs}>
            Add to calendar
          </Button>
        </div>
      </div>
    </div>
  )
}
