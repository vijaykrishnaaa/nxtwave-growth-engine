import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../lib/hooks'
import { currentUser, loadDemoStudent, referralStats, useAppState } from '../lib/store'
import { ago, firstName, pct } from '../lib/format'
import { myRank } from '../lib/leaderboard'
import { Button, ButtonLink, CountUp, EmptyState, Skeleton, SimTag, Stat, useToast } from '../components/ui'
import { REWARDS, SharePanel, whatsappText } from '../components/share'

export default function Dashboard() {
  useDocumentTitle('My invites · The 60-Minute Build')
  const s = useAppState()
  const me = currentUser(s)
  const navigate = useNavigate()
  const toast = useToast()
  const stats = useMemo(() => (me ? referralStats(me.code, s) : null), [me, s])
  const rank = useMemo(() => myRank(s), [s])
  const [loading, setLoading] = useState(true)

  // A real dashboard fetches; keep the loading state visible for one beat
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 380)
    return () => window.clearTimeout(t)
  }, [])

  if (!me || !stats) {
    return (
      <div className="container section dash">
        <p className="t-eyebrow">My invites</p>
        <h1 className="t-display-l dash__title">Your invite dashboard</h1>
        <EmptyState
          title="You haven’t reserved a seat in this browser"
          action={
            <div className="dash__empty-actions">
              <ButtonLink to="/register" arrow>Reserve my seat</ButtonLink>
              <Button
                variant="secondary"
                onClick={() => {
                  loadDemoStudent()
                  toast('Loaded demo student Vijay M.')
                }}
              >
                View as demo student
              </Button>
            </div>
          }
        >
          Register to get your own invite code. Or open the demo student (simulated) to see a dashboard that already
          has referrals.
        </EmptyState>
      </div>
    )
  }

  const n = stats.friends.length
  const unlocked = REWARDS.filter((r) => n >= r.at)
  const activity = [
    ...stats.friends.map((f) => ({ id: f.id, at: f.createdAt, kind: 'joined' as const, name: f.name })),
    ...s.events
      .filter((e) => e.type === 'ref_visit' && e.code === me.code)
      .map((e) => ({ id: e.id, at: e.at, kind: 'click' as const, name: '' })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 8)

  return (
    <div className="container dash">
      <header className="dash__head">
        <div>
          <p className="t-eyebrow">
            My invites · <span className="t-mono">{me.code}</span>
          </p>
          <h1 className="t-display-l dash__title t-twotone">
            Welcome back, {firstName(me.name)}. <span>You’re helping build the next cohort.</span>
          </h1>
        </div>
        {me.simulated && <SimTag>Demo student · simulated</SimTag>}
      </header>

      {loading ? (
        <div className="dash__loading" aria-busy="true" aria-label="Loading your invites">
          <Skeleton lines={2} />
          <Skeleton lines={3} />
        </div>
      ) : (
        <>
          <dl className="kpis dash__kpis">
            <Stat label="Successful referrals" value={<CountUp value={n} />} note="friends registered" />
            <Stat label="Link clicks" value={<CountUp value={stats.clicks} />} note="people opened your link" />
            <Stat
              label="Conversion"
              value={stats.clicks ? pct(stats.conversion, 0) : '—'}
              note={stats.clicks ? 'clicks that registered' : 'no clicks yet'}
            />
            <Stat
              label="Leaderboard rank"
              value={rank ? `#${rank}` : '—'}
              note={rank ? 'among all referrers' : 'ranked after 1 referral'}
              tone={rank && rank <= 3 ? 'signal' : undefined}
            />
          </dl>

          {unlocked.length > 0 && (
            <div className="dash__unlocked" role="status">
              {unlocked.map((r) => (
                <div key={r.at} className="unlock">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <circle cx="9" cy="9" r="8" />
                    <path d="M5 9.5l2.5 2.5L13 6.5" />
                  </svg>
                  <p>
                    <strong>{r.name} unlocked.</strong>{' '}
                    {r.at === 3
                      ? 'Prompt pack, 5 more templates and a deployment checklist.'
                      : 'Your project gets reviewed on screen during the workshop.'}
                  </p>
                  {r.at === 3 && (
                    <Button variant="ghost" size="sm" onClick={() => toast('Simulation: the kit would download here')}>
                      Download kit
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="dash__grid grid">
            <div className="dash__share">
              <SharePanel me={me} friends={n} />
            </div>

            <section className="dash__activity" aria-labelledby="activity-title">
              <h2 id="activity-title" className="t-eyebrow">Activity</h2>
              {activity.length === 0 ? (
                <div className="dash__empty">
                  <p className="t-title">Your link hasn’t been opened yet.</p>
                  <p className="t-small t-muted">
                    Class groups work best in the evening, when people are scrolling. Here’s a message you can paste:
                  </p>
                  <blockquote className="dash__msg">{whatsappText(me.code)}</blockquote>
                </div>
              ) : (
                <ol className="feed">
                  {activity.map((a) => (
                    <li key={a.id} className={`feed__item feed__item--${a.kind}`}>
                      <span className="feed__dot" aria-hidden="true" />
                      <p>
                        {a.kind === 'joined' ? (
                          <>
                            <strong>{a.name}</strong> registered with your code
                          </>
                        ) : (
                          'Someone opened your link'
                        )}
                      </p>
                      <time className="t-small t-muted" dateTime={new Date(a.at).toISOString()}>
                        {ago(a.at)}
                      </time>
                    </li>
                  ))}
                </ol>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')} arrow>
                See the leaderboard
              </Button>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
