import { REFERRERS, REFERRER_TAIL } from '../data/campaign'
import type { AppState } from './store'

export type BoardRow = {
  key: string
  name: string
  campus: string
  referrals: number
  code: string
  isMe: boolean
  local: boolean
}

/** Seeded (simulated) referrers merged with real referrers from this browser. */
export function buildBoard(s: AppState) {
  const counts = new Map<string, number>()
  s.registrants.forEach((r) => {
    if (r.referredBy) counts.set(r.referredBy, (counts.get(r.referredBy) ?? 0) + 1)
  })
  const me = s.registrants.find((r) => r.id === s.currentId)
  const localCodes = new Set(s.registrants.map((r) => r.code))

  const rows: BoardRow[] = REFERRERS.filter((r) => !localCodes.has(r.code)).map((r) => ({
    key: r.code,
    name: r.name,
    campus: r.campus,
    referrals: r.referrals,
    code: r.code,
    isMe: false,
    local: false,
  }))

  s.registrants.forEach((r) => {
    const n = counts.get(r.code) ?? 0
    if (n === 0 && r.id !== me?.id) return
    rows.push({
      key: r.code,
      name: r.name,
      campus: shortCampus(r.college),
      referrals: n,
      code: r.code,
      isMe: r.id === me?.id,
      local: true,
    })
  })

  // Highest first; ties keep seeded order so ranks don't shuffle on reload
  rows.sort((a, b) => b.referrals - a.referrals)
  let rank = 0
  let prev = -1
  const ranked = rows.map((r, i) => {
    if (r.referrals !== prev) {
      rank = i + 1
      prev = r.referrals
    }
    return { ...r, rank }
  })
  return { rows: ranked, tail: REFERRER_TAIL }
}

export function shortCampus(college: string) {
  const m = college.match(/^[A-Z]{2,5}-\d{2}/)
  if (m) return m[0]
  return college.length > 22 ? college.slice(0, 21) + '…' : college
}

export function myRank(s: AppState) {
  const { rows } = buildBoard(s)
  const me = rows.find((r) => r.isMe)
  if (!me || me.referrals === 0) return null
  return me.rank
}
