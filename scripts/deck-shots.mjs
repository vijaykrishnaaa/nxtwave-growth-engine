// Captures product screenshots used on slide 4 of the deck → public/deck/*.png
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const base = process.env.BASE ?? 'http://localhost:5173'
mkdirSync('public/deck', { recursive: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1400 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce' })
const page = await ctx.newPage()
const hide = '.demo-fab{display:none!important}'

async function shot(route, file, { scrollTo, height = 1400 } = {}) {
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: hide })
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')))
  if (scrollTo) await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), scrollTo)
  await page.waitForTimeout(900)
  await page.screenshot({ path: `public/deck/${file}.png`, clip: { x: 0, y: 0, width: 1080, height } })
  console.log('saved', file)
}

await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await shot('/', 'landing')
await shot('/register?ref=VIJAY20', 'register')
// demo student for the referral screens
await page.goto(base + '/me', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'View as demo student' }).click()
await page.waitForTimeout(600)
await shot('/welcome', 'welcome')
await shot('/me', 'dashboard')
await shot('/leaderboard', 'leaderboard')
await shot('/console', 'console')
await shot('/console/experiment', 'experiment')
await page.evaluate(() => localStorage.clear())
await browser.close()
