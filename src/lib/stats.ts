/* Small, dependency-free statistics for the experiment screen. */

/** Standard normal CDF (Abramowitz & Stegun 7.1.26, |error| < 7.5e-8). */
export function normCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

/** Wilson score interval for a single proportion. */
export function wilson(successes: number, n: number, z = 1.96) {
  if (n === 0) return { p: 0, lo: 0, hi: 0 }
  const p = successes / n
  const denom = 1 + (z * z) / n
  const centre = (p + (z * z) / (2 * n)) / denom
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom
  return { p, lo: centre - half, hi: centre + half }
}

/** Two-proportion z-test (pooled), two-sided. */
export function twoProportion(xA: number, nA: number, xB: number, nB: number) {
  const pA = xA / nA
  const pB = xB / nB
  const pooled = (xA + xB) / (nA + nB)
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / nA + 1 / nB))
  const z = se === 0 ? 0 : (pB - pA) / se
  const pValue = 2 * (1 - normCdf(Math.abs(z)))
  // CI on the absolute difference (unpooled SE)
  const seDiff = Math.sqrt((pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB)
  return {
    pA,
    pB,
    lift: pA === 0 ? 0 : (pB - pA) / pA,
    diff: pB - pA,
    diffLo: pB - pA - 1.96 * seDiff,
    diffHi: pB - pA + 1.96 * seDiff,
    z,
    pValue,
  }
}

/** Per-variant sample size for 80% power, two-sided α = 0.05. */
export function sampleSizePerArm(baseline: number, relativeLift: number) {
  const p1 = baseline
  const p2 = baseline * (1 + relativeLift)
  const zA = 1.96
  const zB = 0.8416
  const pBar = (p1 + p2) / 2
  const num =
    zA * Math.sqrt(2 * pBar * (1 - pBar)) + zB * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
  return Math.ceil((num * num) / ((p2 - p1) * (p2 - p1)))
}
