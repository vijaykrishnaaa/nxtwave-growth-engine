const nf = new Intl.NumberFormat('en-IN')

export const num = (n: number) => nf.format(Math.round(n))

export const pct = (x: number, digits = 1) => `${(x * 100).toFixed(digits)}%`

export const rupees = (n: number, digits = 0) =>
  '₹' +
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n)

export function ago(ts: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 45) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

export const referralLink = (code: string) =>
  `${window.location.origin}/?ref=${encodeURIComponent(code)}`

export const prettyLink = (code: string) =>
  `${window.location.host}/?ref=${code}`
