// QA helper: full-page screenshots of a route at given widths, plus an overflow check.
// usage: node scripts/shoot.mjs /console 1440,390 [outDir] [--setup=demo|registered]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const [, , route = '/', widthsArg = '1440', outDir = 'qa', ...flags] = process.argv
const setup = flags.find((f) => f.startsWith('--setup='))?.split('=')[1]
const base = process.env.BASE ?? 'http://localhost:5173'
const widths = widthsArg.split(',').map(Number)
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
  page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  if (setup === 'demo') {
    await page.evaluate(() => localStorage.clear())
    await page.goto(base + '/me', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'View as demo student' }).click()
  }
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.addStyleTag({ content: '.demo-fab{display:none!important}' })
  // reveal everything that waits for intersection
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')))
  const overflow = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 5)
      .map((el) => el.tagName + '.' + (el.className?.toString?.() ?? '').slice(0, 40)),
  }))
  const name = `${outDir}/${route.replace(/[\/?=&#]+/g, '_') || 'home'}-${w}.png`
  await page.screenshot({ path: name, fullPage: true })
  console.log(w, name, overflow.sw > overflow.cw ? `OVERFLOW ${overflow.sw}>${overflow.cw} ${overflow.offenders.join(' | ')}` : 'ok')
  await ctx.close()
}
await browser.close()
