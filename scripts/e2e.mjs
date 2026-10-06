// End-to-end check of the referral loop in one browser.
import { chromium } from 'playwright-core'
const base = process.env.BASE ?? 'http://localhost:5173'
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const p = await b.newPage()
const errors = []
p.on('pageerror', (e) => errors.push(e.message))
const assert = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1 } else console.log('ok  ', m) }

await p.goto(base + '/'); await p.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
async function register(name, email, ref) {
  await p.goto(base + (ref ? `/?ref=${ref}` : '/'), { waitUntil: 'networkidle' })
  if (ref) assert(await p.getByText('saved you a seat').isVisible(), `invite banner for ${ref}`)
  await p.locator('.hero__ctas a').first().click()
  await p.waitForURL('**/register**')
  await p.getByLabel('Full name').fill(name)
  await p.getByLabel('Email').fill(email)
  await p.getByLabel('College').fill('HYD-07 (fictional campus)')
  await p.getByLabel('Branch').selectOption('CSE')
  await p.getByLabel('Graduating in').selectOption('2027 (final year)')
  await p.getByRole('button', { name: 'Reserve my seat' }).click()
  await p.waitForURL('**/welcome')
  return (await p.locator('.share__codevalue').textContent()).trim()
}
// validation
await p.goto(base + '/register', { waitUntil: 'networkidle' })
await p.getByRole('button', { name: 'Reserve my seat' }).click()
assert((await p.locator('.field__error').count()) === 5, 'empty submit shows 5 errors (WhatsApp optional)')
assert(await p.evaluate(() => document.activeElement?.getAttribute('name') === 'name'), 'focus moves to first invalid field')

const codeA = await register('Asha Verma', 'asha@example.com')
assert(/^ASHA\d{2}$/.test(codeA), `code generated: ${codeA}`)
// a friend's browser: nobody signed in
await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('growth-engine:v1')); s.currentId = null; localStorage.setItem('growth-engine:v1', JSON.stringify(s)); sessionStorage.clear() })
const codeB = await register('Bala Krishnan', 'bala@example.com', codeA)
assert(codeB !== codeA, `friend got own code: ${codeB}`)
const state = await p.evaluate(() => JSON.parse(localStorage.getItem('growth-engine:v1')))
const a = state.registrants.find((r) => r.code === codeA)
assert(state.registrants.filter((r) => r.referredBy === codeA).length === 1, 'referral credited to A')
assert(state.events.some((e) => e.type === 'ref_visit' && e.code === codeA), 'invite visit tracked')
// duplicate email
await p.goto(base + '/register', { waitUntil: 'networkidle' })
await p.getByLabel('Full name').fill('Asha Again'); await p.getByLabel('Email').fill('asha@example.com')
await p.getByLabel('College').fill('X College'); await p.getByLabel('Branch').selectOption('IT'); await p.getByLabel('Graduating in').selectOption('2028')
await p.getByRole('button', { name: 'Reserve my seat' }).click()
assert(await p.getByText('This email already has a seat.').isVisible(), 'duplicate email caught')
// switch to A and check dashboard
await p.evaluate((id) => { const s = JSON.parse(localStorage.getItem('growth-engine:v1')); s.currentId = id; localStorage.setItem('growth-engine:v1', JSON.stringify(s)) }, a.id)
await p.goto(base + '/me', { waitUntil: 'networkidle' }); await p.waitForTimeout(600)
assert((await p.locator('.stat__value').first().textContent()).trim() === '1', 'A dashboard shows 1 referral')
assert(await p.getByText('Bala K').first().isVisible(), 'activity lists friend')
await p.goto(base + '/leaderboard', { waitUntil: 'networkidle' })
assert(await p.locator('tr.is-me, .board__mine').count() > 0, 'A appears on leaderboard')
await p.goto(base + '/?v=a', { waitUntil: 'networkidle' })
assert((await p.locator('h1').textContent()).includes('Learn AI'), 'variant A preview renders')
await p.goto(base + '/console/experiment', { waitUntil: 'networkidle' })
assert(await p.getByText('0.003').isVisible(), 'p-value computed')
await p.evaluate(() => localStorage.clear())
assert(errors.length === 0, 'no page errors ' + errors.join(';'))
await b.close()
