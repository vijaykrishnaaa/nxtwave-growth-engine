/* ==========================================================================
   Local store: registrants, session, and the event log.
   Lives in this browser only (localStorage). Everything here is real
   behaviour from this browser — the console shows it apart from the
   simulated baseline.
   ========================================================================== */

import { useSyncExternalStore } from 'react'
import { DEMO_STUDENT, REFERRERS } from '../data/campaign'

export type Variant = 'A' | 'B'

export type Registrant = {
  id: string
  name: string
  email: string
  phone?: string
  college: string
  branch: string
  gradYear: string
  code: string
  referredBy?: string
  variant: Variant
  createdAt: number
  /** created by a demo control rather than by a person filling the form */
  simulated?: boolean
}

export type EventType =
  | 'visit'
  | 'cta_click'
  | 'form_start'
  | 'register'
  | 'share_copy_link'
  | 'share_copy_code'
  | 'share_whatsapp'
  | 'ref_visit'

export type TrackedEvent = {
  id: string
  type: EventType
  at: number
  variant?: Variant
  code?: string
  simulated?: boolean
}

type State = {
  registrants: Registrant[]
  currentId: string | null
  events: TrackedEvent[]
  variant: Variant | null
}

const KEY = 'growth-engine:v1'
const EMPTY: State = { registrants: [], currentId: null, events: [], variant: null }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<State>
    return { ...EMPTY, ...parsed }
  } catch {
    return EMPTY
  }
}

let state: State = load()
const listeners = new Set<() => void>()

function commit(next: State) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage blocked — the session still works in memory */
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load()
      l()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

/** Returns the whole (immutable) state; derive with useMemo in the caller. */
export function useAppState(): State {
  return useSyncExternalStore(subscribe, () => state)
}

export type AppState = State

export const getState = () => state

const uid = () => Math.random().toString(36).slice(2, 10)

/* ---- Events ------------------------------------------------------------ */

export function track(type: EventType, extra: Partial<TrackedEvent> = {}) {
  const event: TrackedEvent = { id: uid(), type, at: Date.now(), variant: currentVariant(), ...extra }
  commit({ ...state, events: [...state.events, event].slice(-2000) })
}

/* ---- Variant ----------------------------------------------------------- */

/** Experiment 01 concluded on Day 5, so B serves everyone unless a preview is set. */
export function currentVariant(): Variant {
  return state.variant ?? 'B'
}

export function setVariant(v: Variant | null) {
  commit({ ...state, variant: v })
}

/* ---- Registrants ------------------------------------------------------- */

const seededCodes = new Set(REFERRERS.map((r) => r.code))

export function codeExists(code: string) {
  const c = code.trim().toUpperCase()
  return seededCodes.has(c) || state.registrants.some((r) => r.code === c)
}

export function findByCode(code: string): { name: string } | null {
  const c = code.trim().toUpperCase()
  const local = state.registrants.find((r) => r.code === c)
  if (local) return { name: local.name }
  const seeded = REFERRERS.find((r) => r.code === c)
  return seeded ? { name: seeded.name } : null
}

export function makeCode(name: string) {
  const base = (name.trim().split(/\s+/)[0] || 'FRIEND')
    .normalize('NFD')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
    .slice(0, 6) || 'FRIEND'
  for (let i = 0; i < 200; i++) {
    const code = base + String(10 + Math.floor(Math.random() * 90))
    if (!codeExists(code)) return code
  }
  return base + uid().slice(0, 4).toUpperCase()
}

export function emailTaken(email: string) {
  const e = email.trim().toLowerCase()
  return state.registrants.find((r) => r.email.toLowerCase() === e && !r.simulated) ?? null
}

export type NewRegistrant = Omit<Registrant, 'id' | 'code' | 'createdAt' | 'variant'>

export function register(input: NewRegistrant): Registrant {
  const r: Registrant = {
    ...input,
    id: uid(),
    code: makeCode(input.name),
    variant: currentVariant(),
    createdAt: Date.now(),
  }
  commit({
    ...state,
    registrants: [...state.registrants, r],
    currentId: input.simulated ? state.currentId : r.id,
  })
  return r
}

export function signInAs(id: string | null) {
  commit({ ...state, currentId: id })
}

export function currentUser(s: State = state) {
  return s.registrants.find((r) => r.id === s.currentId) ?? null
}

/* ---- Referral stats for one code -------------------------------------- */

export function referralStats(code: string, s: State = state) {
  const friends = s.registrants
    .filter((r) => r.referredBy === code)
    .sort((a, b) => b.createdAt - a.createdAt)
  const clicks = s.events.filter((e) => e.type === 'ref_visit' && e.code === code).length
  const shares = s.events.filter((e) => e.type.startsWith('share_') && e.code === code).length
  const conversion = clicks > 0 ? friends.length / clicks : 0
  return { friends, clicks, shares, conversion }
}

/* ---- Demo controls ----------------------------------------------------- */

const FRIEND_NAMES = [
  'Rahul S.', 'Meghana C.', 'Akhil R.', 'Sneha T.', 'Varun T.', 'Bhavya K.',
  'Rohith D.', 'Tarun J.', 'Swathi L.', 'Nikhil Y.', 'Pooja H.', 'Lakshmi P.',
]

export function simulateClick(code: string) {
  track('ref_visit', { code, simulated: true })
}

export function simulateFriend(code: string) {
  const used = new Set(state.registrants.map((r) => r.name))
  const name = FRIEND_NAMES.find((n) => !used.has(n)) ?? `Friend ${state.registrants.length + 1}`
  // A friend has to open the link before registering
  track('ref_visit', { code, simulated: true })
  return register({
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, '')}.${uid().slice(0, 3)}@example.com`,
    college: 'Simulated friend',
    branch: 'CSE',
    gradYear: '2027',
    referredBy: code,
    simulated: true,
  })
}

/** Loads "Vijay M.", the demo student: 4 referrals from 12 link clicks. */
export function loadDemoStudent() {
  const existing = state.registrants.find((r) => r.code === DEMO_STUDENT.code)
  if (existing) {
    signInAs(existing.id)
    return existing
  }
  const now = Date.now()
  const hour = 3600_000
  const vijay: Registrant = {
    id: uid(),
    name: DEMO_STUDENT.name,
    email: DEMO_STUDENT.email,
    college: DEMO_STUDENT.college,
    branch: DEMO_STUDENT.branch,
    gradYear: DEMO_STUDENT.gradYear,
    code: DEMO_STUDENT.code,
    variant: 'B',
    createdAt: now - 52 * hour,
    simulated: true,
  }
  const friendAges = [2, 9, 26, 31]
  const friends: Registrant[] = DEMO_STUDENT.friends.map((name, i) => ({
    id: uid(),
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
    college: 'HYD-07 (fictional campus)',
    branch: i % 2 ? 'ECE' : 'CSE',
    gradYear: '2027',
    code: name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 6) + (40 + i),
    referredBy: DEMO_STUDENT.code,
    variant: 'B',
    createdAt: now - friendAges[i] * hour,
    simulated: true,
  }))
  const clicks: TrackedEvent[] = Array.from({ length: DEMO_STUDENT.clicks }, (_, i) => ({
    id: uid(),
    type: 'ref_visit',
    at: now - (48 - i * 4) * hour,
    code: DEMO_STUDENT.code,
    variant: 'B',
    simulated: true,
  }))
  commit({
    ...state,
    registrants: [...state.registrants, vijay, ...friends],
    events: [...state.events, ...clicks],
    currentId: vijay.id,
  })
  return vijay
}

export function resetAll() {
  commit({ ...EMPTY })
}
