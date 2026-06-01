import { Product, Routine, SkinType } from '@/types'
import { singleProducts } from './products'

// ─── Ingredient helpers ───────────────────────────────────────────────────────

const norm = (s: string) => s.toLowerCase()
const hasIngr = (p: Product, ...terms: string[]) =>
  terms.some(t => p.key_ingredients.some(i => norm(i).includes(norm(t))))

const isRetinoid   = (p: Product) => hasIngr(p, 'retinol', 'retinal', 'retinoid', 'tretinoin', 'retinoic')
const isAcid       = (p: Product) => hasIngr(p, 'aha', 'bha', 'pha', 'glycolic', 'salicylic', 'lactic') || p.category === 'Exfoliators'
const isVitaminC   = (p: Product) => hasIngr(p, 'vitamin c', 'ascorbic', 'naa', 'map')
const isNiacinamide = (p: Product) => hasIngr(p, 'niacinamide')
const isBenzoyl    = (p: Product) => hasIngr(p, 'benzoyl')
const isExfoliant  = (p: Product) => isAcid(p) || p.category === 'Exfoliators'
const isStrongActive = (p: Product) => isRetinoid(p) || isAcid(p) || isBenzoyl(p) || isVitaminC(p)

// ─── Ingredient preferences per skin type ────────────────────────────────────

const BENEFICIAL: Record<SkinType, string[]> = {
  Oily:        ['niacinamide', 'bha', 'salicylic', 'pha', 'zinc', 'tea tree', 'centella', 'green tea', 'witch hazel'],
  Dry:         ['ceramide', 'hyaluronic', 'squalane', 'shea', 'panthenol', 'glycerin', 'peptide', 'collagen', 'argan'],
  Combination: ['niacinamide', 'hyaluronic', 'ceramide', 'centella', 'panthenol', 'pha'],
  Sensitive:   ['centella', 'allantoin', 'panthenol', 'ceramide', 'aloe', 'cica', 'madecassoside', 'mugwort'],
  Normal:      ['hyaluronic', 'ceramide', 'niacinamide', 'peptide', 'vitamin c', 'retinol'],
}

const AVOID: Record<SkinType, string[]> = {
  Oily:        ['shea butter', 'mineral oil', 'lanolin', 'petrolatum'],
  Dry:         ['alcohol', 'salicylic', 'aha', 'glycolic'],
  Combination: [],
  Sensitive:   ['aha', 'bha', 'retinol', 'vitamin c', 'glycolic', 'salicylic', 'benzoyl'],
  Normal:      [],
}

// Skin type field values that match each skin type
const SKIN_TYPE_MATCH: Record<SkinType, string[]> = {
  Oily:        ['Oily', 'Combination&Normal'],
  Dry:         ['Dry', 'Sensitive'],
  Combination: ['Combination&Normal', 'Oily', 'Dry'],
  Sensitive:   ['Sensitive', 'Dry'],
  Normal:      ['Combination&Normal', 'Normal'],
}

// ─── Slot → preferred categories ─────────────────────────────────────────────

const SLOT_CATEGORIES: Record<keyof Routine, string[]> = {
  AM:     ['Cleansing Foams', 'Cleansing Water', 'Toner', 'Essence & Serum', 'Moisturizer (Lotion)', 'Sunscreen'],
  PM:     ['Cleansing Balms & Oils', 'Cleansing Foams', 'Toner', 'Essence & Serum', 'Cream', 'Face Oil', 'Spot Care'],
  Weekly: ['Exfoliators', 'Acne & Blemish Treatments', 'Face Mist'],
}

const WEEKLY_OILY = ['Exfoliators', 'Acne & Blemish Treatments', 'Spot Care']
const WEEKLY_DRY  = ['Exfoliators', 'Face Oil', 'Face Mist']

// ─── Conflict detection ───────────────────────────────────────────────────────

/**
 * Returns true if adding `product` to `slot` would trigger a warning rule.
 * Mirrors the logic in src/lib/rules.ts so recommendations are always clean.
 */
function wouldConflict(
  product: Product,
  slot: Product[],
  slotName: keyof Routine,
  skinType: SkinType
): boolean {
  // ── Slot-specific hard rules ──────────────────────────────────────────────

  // Retinoids never in AM (retinol-am → error)
  if (slotName === 'AM' && isRetinoid(product)) return true

  // Vitamin C never in PM (vitc-pm → tip)
  if (slotName === 'PM' && isVitaminC(product)) return true

  // Sensitive skin: never strong actives anywhere (sensitive-strong-actives → warning)
  if (skinType === 'Sensitive' && isStrongActive(product)) return true

  // ── Same-slot pair conflicts ──────────────────────────────────────────────
  const combined = [...slot, product]

  // Multiple exfoliants in one slot (multi-exfoliant → warning)
  if (combined.filter(isExfoliant).length >= 2) return true

  // Retinoid + acid together (retinol-plus-acid → warning)
  if (combined.some(isRetinoid) && combined.some(isAcid)) return true

  // Vitamin C + Niacinamide together (vitc-niacinamide → tip)
  if (combined.some(isVitaminC) && combined.some(isNiacinamide)) return true

  // Benzoyl peroxide + retinoid (bp-retinol → error)
  if (combined.some(isBenzoyl) && combined.some(isRetinoid)) return true

  return false
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scoreProduct(product: Product, skinType: SkinType): number {
  const ingredients = product.key_ingredients.map(i => norm(i))
  const productSkinTypes = product.skin_type.map(s => s.toLowerCase())
  let score = 0

  // Skin type field match
  const matches = SKIN_TYPE_MATCH[skinType].map(s => s.toLowerCase())
  if (productSkinTypes.some(t => matches.includes(t))) score += 3
  if (productSkinTypes.length === 0) score += 1

  // Beneficial ingredients
  for (const good of BENEFICIAL[skinType]) {
    if (ingredients.some(i => i.includes(good))) score += 2
  }

  // Avoid ingredients (penalise but not hard-block — wouldConflict handles hard blocks)
  for (const bad of AVOID[skinType]) {
    if (ingredients.some(i => i.includes(bad))) score -= 3
  }

  // Rating boost
  if (product.rating >= 4.8) score += 2
  else if (product.rating >= 4.5) score += 1

  return score
}

// ─── Safe picker ─────────────────────────────────────────────────────────────

function pickBest(
  products: Product[],
  category: string,
  skinType: SkinType,
  excluded: Set<string>,
  currentSlot: Product[],
  slotName: keyof Routine,
  /** For essential categories (e.g. Sunscreen), accept any score */
  allowNegativeScore = false
): Product | null {
  const candidates = products
    .filter(p => p.category === category && !excluded.has(p.id))
    .filter(p => !wouldConflict(p, currentSlot, slotName, skinType))
    .map(p => ({ product: p, score: scoreProduct(p, skinType) }))
    .filter(({ score }) => allowNegativeScore || score >= 0)
    .sort((a, b) => b.score - a.score)

  return candidates[0]?.product ?? null
}

// ─── Main recommend function ──────────────────────────────────────────────────

export function recommendRoutine(skinType: SkinType): Routine {
  const used = new Set<string>()

  function pick(
    category: string,
    currentSlot: Product[],
    slotName: keyof Routine,
    allowNegativeScore = false
  ): Product | null {
    const p = pickBest(singleProducts, category, skinType, used, currentSlot, slotName, allowNegativeScore)
    if (p) used.add(p.id)
    return p
  }

  // ── AM ──────────────────────────────────────────────────────────────────────
  const am: Product[] = []
  for (const cat of SLOT_CATEGORIES.AM) {
    // Sunscreen is essential — accept even a lower score if that's all we have
    const essential = cat === 'Sunscreen'
    const p = pick(cat, am, 'AM', essential)
    if (p) am.push(p)
  }

  // ── PM ──────────────────────────────────────────────────────────────────────
  const pm: Product[] = []
  for (const cat of SLOT_CATEGORIES.PM) {
    // Oily skin: skip heavy cream and face oil — they don't need occlusive night layers
    if (skinType === 'Oily' && (cat === 'Face Oil' || cat === 'Cream')) continue
    const p = pick(cat, pm, 'PM')
    if (p) pm.push(p)
  }

  // ── Weekly ──────────────────────────────────────────────────────────────────
  const weeklyCategories =
    skinType === 'Oily' || skinType === 'Combination' ? WEEKLY_OILY
    : skinType === 'Dry' || skinType === 'Sensitive'  ? WEEKLY_DRY
    : SLOT_CATEGORIES.Weekly

  // Sensitive skin: exfoliants are a strong active — skip the Exfoliators category
  const sensitiveWeekly = weeklyCategories.filter(cat =>
    skinType !== 'Sensitive' || cat !== 'Exfoliators'
  )

  const weekly: Product[] = []
  for (const cat of sensitiveWeekly) {
    const p = pick(cat, weekly, 'Weekly')
    if (p) weekly.push(p)
  }

  return { AM: am, PM: pm, Weekly: weekly }
}
