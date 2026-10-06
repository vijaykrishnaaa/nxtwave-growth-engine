import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CAMPUSES, OTHER_CAMPUSES } from '../data/campaign'
import { useDocumentTitle } from '../lib/hooks'
import { buildBoard } from '../lib/leaderboard'
import { currentUser, useAppState } from '../lib/store'
import { ButtonLink, SimTag, Tabs } from '../components/ui'

type Tab = 'students' | 'campuses'

export default function Leaderboard() {
  useDocumentTitle('Leaderboard · The 60-Minute Build')
  const s = useAppState()
  const me = currentUser(s)
  const [tab, setTab] = useState<Tab>('students')
  const board = useMemo(() => buildBoard(s), [s])
  const reduced = useReducedMotion()
  const top = board.rows.slice(0, 10)
  const meRow = board.rows.find((r) => r.isMe)
  const meOutside = meRow && !top.includes(meRow)
  const max = Math.max(...board.rows.map((r) => r.referrals), 1)
  const campusMax = CAMPUSES[0].regs

  return (
    <div className="container board">
      <header className="board__head">
        <div>
          <p className="t-eyebrow">Leaderboard · as of campaign day 5</p>
          <h1 className="t-display-l t-twotone">
            Who’s bringing their batch. <span>Ranked by friends who registered.</span>
          </h1>
        </div>
        <div className="board__meta">
          <SimTag />
          <p className="t-small t-muted">Names and campus codes are fictional.</p>
        </div>
      </header>

      <Tabs
        label="Leaderboard view"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'students', label: 'Students' },
          { id: 'campuses', label: 'Campuses' },
        ]}
      />

      {tab === 'students' ? (
        <div role="tabpanel" id="panel-students" aria-labelledby="tab-students" className="board__panel">
          <table className="table board__table">
            <caption className="sr-only">Top referrers by successful referrals</caption>
            <thead>
              <tr>
                <th scope="col" className="board__rankcol">Rank</th>
                <th scope="col">Student</th>
                <th scope="col" className="board__campuscol">Campus</th>
                <th scope="col" className="board__barcol"><span className="sr-only">Share of top</span></th>
                <th scope="col" className="num">Referrals</th>
              </tr>
            </thead>
            <tbody>
              {top.map((r) => (
                <motion.tr
                  key={r.key}
                  layout={!reduced}
                  transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
                  className={r.isMe ? 'is-me' : undefined}
                >
                  <td className="board__rank t-mono">{String(r.rank).padStart(2, '0')}</td>
                  <td className="board__name">
                    {r.name}
                    {r.isMe && <span className="board__you">you</span>}
                  </td>
                  <td className="board__campus t-mono">{r.campus}</td>
                  <td className="board__barcell" aria-hidden="true">
                    <span className="board__bar" style={{ width: `${(r.referrals / max) * 100}%` }} />
                  </td>
                  <td className="num board__n">{r.referrals}</td>
                </motion.tr>
              ))}
              <tr className="board__tail">
                <td />
                <td colSpan={4} className="t-small t-muted">
                  + {board.tail.people} more students with 1–2 referrals each
                </td>
              </tr>
            </tbody>
          </table>

          {meOutside && meRow && (
            <div className="board__mine" role="status">
              <span className="t-mono">{meRow.referrals ? `#${meRow.rank}` : '—'}</span>
              <p>
                <strong>You</strong>, {meRow.referrals} referral{meRow.referrals === 1 ? '' : 's'}.{' '}
                {meRow.referrals === 0
                  ? 'One friend puts you on the board.'
                  : `${top[top.length - 1].referrals - meRow.referrals + 1} more to reach the top 10.`}
              </p>
              <ButtonLink to="/me" size="sm" variant="secondary">Share my link</ButtonLink>
            </div>
          )}
          {!me && (
            <p className="board__cta t-small t-muted">
              Want to be on here? <ButtonLink to="/register" variant="ghost" size="sm">Reserve a seat and get a code</ButtonLink>
            </p>
          )}
        </div>
      ) : (
        <div role="tabpanel" id="panel-campuses" aria-labelledby="tab-campuses" className="board__panel">
          <table className="table board__table">
            <caption className="sr-only">Registrations by campus</caption>
            <thead>
              <tr>
                <th scope="col" className="board__rankcol">Rank</th>
                <th scope="col">Campus</th>
                <th scope="col" className="board__campuscol">City</th>
                <th scope="col" className="board__barcol"><span className="sr-only">Share of top</span></th>
                <th scope="col" className="num">Registrations</th>
              </tr>
            </thead>
            <tbody>
              {CAMPUSES.map((c, i) => (
                <tr key={c.code}>
                  <td className="board__rank t-mono">{String(i + 1).padStart(2, '0')}</td>
                  <td className="board__name t-mono">{c.code}</td>
                  <td className="board__campus">{c.city}</td>
                  <td className="board__barcell" aria-hidden="true">
                    <span className="board__bar" style={{ width: `${(c.regs / campusMax) * 100}%` }} />
                  </td>
                  <td className="num board__n">{c.regs}</td>
                </tr>
              ))}
              <tr className="board__tail">
                <td />
                <td colSpan={3} className="t-small t-muted">+ {OTHER_CAMPUSES.count} more campuses</td>
                <td className="num t-small t-muted">{OTHER_CAMPUSES.regs}</td>
              </tr>
            </tbody>
          </table>
          <p className="t-small t-muted board__why">
            Why campuses: students pass the link on more readily when their college is competing. The top campus at
            close gets its own live Q&amp;A slot. That’s a proposal, at ₹0 cost.
          </p>
        </div>
      )}
    </div>
  )
}
