/* The 500-registration growth model. Every input is an ASSUMPTION. */

export type ModelInputs = {
  colleges: number
  groupsPerCollege: number
  membersPerGroup: number
  clickRate: number // share of group members who open the link
  landingConversion: number // warm traffic: visit → registered
  budget: number
  cpc: number // ₹ per paid click
  paidConversion: number // cold traffic: visit → registered
  shareRate: number // registrants who share their code
  refsPerSharer: number // successful referrals per sharer
}

export const SCENARIOS: Record<'conservative' | 'base' | 'ambitious', ModelInputs> = {
  conservative: {
    colleges: 20, groupsPerCollege: 3, membersPerGroup: 220, clickRate: 0.09,
    landingConversion: 0.12, budget: 2000, cpc: 4, paidConversion: 0.08,
    shareRate: 0.3, refsPerSharer: 0.6,
  },
  base: {
    colleges: 20, groupsPerCollege: 3, membersPerGroup: 250, clickRate: 0.13,
    landingConversion: 0.155, budget: 2000, cpc: 2.5, paidConversion: 0.1,
    shareRate: 0.4, refsPerSharer: 0.8,
  },
  ambitious: {
    colleges: 25, groupsPerCollege: 3, membersPerGroup: 260, clickRate: 0.15,
    landingConversion: 0.17, budget: 2000, cpc: 2, paidConversion: 0.12,
    shareRate: 0.45, refsPerSharer: 0.9,
  },
}

export function runModel(i: ModelInputs) {
  const reach = i.colleges * i.groupsPerCollege * i.membersPerGroup
  const communityVisits = reach * i.clickRate
  const communities = communityVisits * i.landingConversion
  const paidClicks = i.budget / i.cpc
  const paid = paidClicks * i.paidConversion
  const direct = communities + paid
  const k = i.shareRate * i.refsPerSharer
  // First-order referrals only. Friends-of-friends are left out on purpose (conservative).
  const referrals = direct * k
  const total = communities + paid + referrals
  const cpr = paid > 0 ? i.budget / paid : Infinity
  return {
    reach,
    communityVisits,
    communities,
    paidClicks,
    paid,
    referrals,
    k,
    total,
    cpr,
    blendedCost: total > 0 ? i.budget / total : 0,
  }
}

/** How many extra colleges would close a gap, holding the other inputs. */
export function collegesToClose(gap: number, i: ModelInputs) {
  if (gap <= 0) return 0
  const perCollege =
    i.groupsPerCollege * i.membersPerGroup * i.clickRate * i.landingConversion *
    (1 + i.shareRate * i.refsPerSharer)
  return Math.ceil(gap / perCollege)
}
