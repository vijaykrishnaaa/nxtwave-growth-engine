// Exports the deck: deliverables/deck/slide-N.png, Growth-Plan.pdf, Growth-Plan.pptx
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import PptxGenJS from 'pptxgenjs'

const base = process.env.BASE ?? 'http://localhost:5173'
const out = 'deliverables'
mkdirSync(`${out}/deck`, { recursive: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
await page.goto(base + '/deck?print', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(800)
const pages = await page.$$('.deck-print__page')
for (let i = 0; i < pages.length; i++) {
  await pages[i].screenshot({ path: `${out}/deck/slide-${i + 1}.png` })
  console.log('slide', i + 1)
}
await page.emulateMedia({ media: 'print' })
await page.pdf({ path: `${out}/Growth-Plan.pdf`, width: '1600px', height: '900px', printBackground: true })
console.log('pdf')
await browser.close()

const pptx = new PptxGenJS()
pptx.defineLayout({ name: 'W', width: 13.333, height: 7.5 })
pptx.layout = 'W'
pptx.title = 'Growth Plan: Build Your First AI Project in 60 Minutes'
for (let i = 1; i <= pages.length; i++) {
  const s = pptx.addSlide()
  s.addImage({ path: `${out}/deck/slide-${i}.png`, x: 0, y: 0, w: 13.333, h: 7.5 })
}
await pptx.writeFile({ fileName: `${out}/Growth-Plan.pptx` })
console.log('pptx')
