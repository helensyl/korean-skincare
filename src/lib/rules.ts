import { Product, Routine, SkinType, Warning } from '@/types'

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

const hasIngredient = (product: Product, ...terms: string[]) =>
  terms.some(t => product.key_ingredients.some(i => norm(i).includes(norm(t))))

const hasCat = (product: Product, ...cats: string[]) =>
  cats.some(c => norm(product.category).includes(norm(c)))

// ─── Rule definitions ─────────────────────────────────────────────────────────

interface Rule {
  id: string
  check: (
    am: Product[],
    pm: Product[],
    weekly: Product[],
    all: Product[],
    skinType: SkinType | null
  ) => Warning | null
}

const rules: Rule[] = [
  // SPF missing in AM
  {
    id: 'no-spf-am',
    check: (am) => {
      const hasSPF = am.some(p =>
        hasIngredient(p, 'SPF', 'sunscreen', 'UV') ||
        norm(p.category).includes('suncare') ||
        norm(p.category).includes('sunscreen') ||
        norm(p.name).includes('spf') ||
        norm(p.name).includes('sunscreen') ||
        norm(p.name).includes('sun')
      )
      if (am.length > 0 && !hasSPF) {
        return {
          severity: 'tip',
          message: 'No SPF in your morning routine — UV protection is essential every day, even indoors.',
          affected: [],
          rule: 'no-spf-am',
        }
      }
      return null
    },
  },

  // Retinol in AM
  {
    id: 'retinol-am',
    check: (am) => {
      const products = am.filter(p =>
        hasIngredient(p, 'retinol', 'retinal', 'retinoid', 'tretinoin', 'retinoic')
      )
      if (products.length > 0) {
        return {
          severity: 'error',
          message: 'Retinol/retinoid should only be used at night — it breaks down in sunlight and can cause irritation. Move to PM.',
          affected: products.map(p => p.id),
          rule: 'retinol-am',
        }
      }
      return null
    },
  },

  // AHA/BHA in AM without SPF
  {
    id: 'exfoliant-no-spf',
    check: (am) => {
      const hasSPF = am.some(p =>
        norm(p.name).includes('spf') || norm(p.name).includes('sun') || norm(p.name).includes('sunscreen')
      )
      const exfoliants = am.filter(p =>
        hasIngredient(p, 'AHA', 'BHA', 'PHA', 'LHA', 'glycolic', 'salicylic', 'lactic')
      )
      if (exfoliants.length > 0 && !hasSPF) {
        return {
          severity: 'warning',
          message: 'AHA/BHA exfoliants increase sun sensitivity — make sure to apply SPF every morning when using these.',
          affected: exfoliants.map(p => p.id),
          rule: 'exfoliant-no-spf',
        }
      }
      return null
    },
  },

  // Retinol + AHA/BHA in same slot
  {
    id: 'retinol-plus-acid',
    check: (am, pm, weekly) => {
      for (const slot of [am, pm, weekly]) {
        const retinol = slot.filter(p => hasIngredient(p, 'retinol', 'retinal', 'retinoid'))
        const acids = slot.filter(p => hasIngredient(p, 'AHA', 'BHA', 'PHA', 'glycolic', 'salicylic', 'lactic'))
        if (retinol.length > 0 && acids.length > 0) {
          return {
            severity: 'warning',
            message: 'Using retinol with AHA/BHA in the same session can cause significant irritation. Alternate nights instead.',
            affected: [...retinol, ...acids].map(p => p.id),
            rule: 'retinol-plus-acid',
          }
        }
      }
      return null
    },
  },

  // Vitamin C + Niacinamide
  {
    id: 'vitc-niacinamide',
    check: (am, pm, weekly) => {
      for (const slot of [am, pm, weekly]) {
        const vitC = slot.filter(p => hasIngredient(p, 'vitamin c', 'ascorbic', 'naa', 'MAP'))
        const niacin = slot.filter(p => hasIngredient(p, 'niacinamide'))
        if (vitC.length > 0 && niacin.length > 0) {
          return {
            severity: 'tip',
            message: 'Vitamin C and Niacinamide used together may reduce Vitamin C efficacy. Consider using them at different times.',
            affected: [...vitC, ...niacin].map(p => p.id),
            rule: 'vitc-niacinamide',
          }
        }
      }
      return null
    },
  },

  // Multiple exfoliants in same slot
  {
    id: 'multi-exfoliant',
    check: (am, pm, weekly) => {
      for (const slot of [am, pm, weekly]) {
        const exfoliants = slot.filter(p =>
          hasIngredient(p, 'AHA', 'BHA', 'PHA', 'LHA', 'glycolic', 'salicylic', 'lactic') ||
          hasCat(p, 'exfoliat')
        )
        if (exfoliants.length >= 2) {
          return {
            severity: 'warning',
            message: 'Using multiple exfoliants at once can over-exfoliate and damage your skin barrier.',
            affected: exfoliants.map(p => p.id),
            rule: 'multi-exfoliant',
          }
        }
      }
      return null
    },
  },

  // Benzoyl peroxide + Retinol
  {
    id: 'bp-retinol',
    check: (am, pm, weekly) => {
      for (const slot of [am, pm, weekly]) {
        const bp = slot.filter(p => hasIngredient(p, 'benzoyl peroxide', 'benzoyl'))
        const retinol = slot.filter(p => hasIngredient(p, 'retinol', 'retinoid', 'retinal'))
        if (bp.length > 0 && retinol.length > 0) {
          return {
            severity: 'error',
            message: 'Benzoyl peroxide deactivates retinol — never use them together.',
            affected: [...bp, ...retinol].map(p => p.id),
            rule: 'bp-retinol',
          }
        }
      }
      return null
    },
  },

  // Vitamin C better in AM
  {
    id: 'vitc-pm',
    check: (_, pm) => {
      const vitC = pm.filter(p => hasIngredient(p, 'vitamin c', 'ascorbic acid'))
      if (vitC.length > 0) {
        return {
          severity: 'tip',
          message: 'Vitamin C is most effective in the morning — it protects against free radicals from UV and pollution throughout the day.',
          affected: vitC.map(p => p.id),
          rule: 'vitc-pm',
        }
      }
      return null
    },
  },

  // ─── Skin-type-aware rules ─────────────────────────────────────────────────

  // Oily: heavy occlusives
  {
    id: 'oily-heavy-cream',
    check: (am, pm, weekly, all, skinType) => {
      if (skinType !== 'Oily') return null
      const heavyProducts = all.filter(p =>
        hasIngredient(p, 'petrolatum', 'shea butter', 'mineral oil', 'lanolin') ||
        (norm(p.formulation.join(' ')).includes('cream') && norm(p.category).includes('cream'))
      )
      if (heavyProducts.length > 0) {
        return {
          severity: 'tip',
          message: 'For oily skin, heavy creams and occlusives can clog pores. Look for gel or water-based moisturisers instead.',
          affected: heavyProducts.map(p => p.id),
          rule: 'oily-heavy-cream',
        }
      }
      return null
    },
  },

  // Dry: no moisturiser in PM
  {
    id: 'dry-no-moisturiser',
    check: (am, pm, weekly, all, skinType) => {
      if (skinType !== 'Dry') return null
      const totalProducts = am.length + pm.length + weekly.length
      if (totalProducts === 0) return null
      const hasMoisturiser = all.some(p =>
        hasCat(p, 'cream', 'moisturizer', 'lotion') ||
        hasIngredient(p, 'ceramide', 'hyaluronic acid', 'glycerin', 'squalane')
      )
      if (!hasMoisturiser) {
        return {
          severity: 'warning',
          message: 'For dry skin, a moisturiser is essential. Consider adding a cream or lotion rich in ceramides or hyaluronic acid.',
          affected: [],
          rule: 'dry-no-moisturiser',
        }
      }
      return null
    },
  },

  // Sensitive: avoid strong actives
  {
    id: 'sensitive-strong-actives',
    check: (am, pm, weekly, all, skinType) => {
      if (skinType !== 'Sensitive') return null
      const strongActives = all.filter(p =>
        hasIngredient(p, 'AHA', 'BHA', 'retinol', 'retinoid', 'benzoyl', 'glycolic')
      )
      if (strongActives.length > 0) {
        return {
          severity: 'warning',
          message: 'Sensitive skin can react strongly to AHAs, BHAs, and retinoids. Introduce these slowly and patch-test first.',
          affected: strongActives.map(p => p.id),
          rule: 'sensitive-strong-actives',
        }
      }
      return null
    },
  },

  // Combination: no AM exfoliant without SPF (stricter)
  {
    id: 'combination-balance',
    check: (am, pm, weekly, all, skinType) => {
      if (skinType !== 'Combination') return null
      const oilyTargets = all.filter(p => hasIngredient(p, 'BHA', 'salicylic', 'niacinamide'))
      const dryTargets = all.filter(p => hasIngredient(p, 'ceramide', 'hyaluronic acid', 'squalane'))
      if (oilyTargets.length > 0 && dryTargets.length === 0) {
        return {
          severity: 'tip',
          message: 'For combination skin, balance oil-control actives (BHA, niacinamide) with hydrating ingredients (ceramides, hyaluronic acid).',
          affected: [],
          rule: 'combination-balance',
        }
      }
      return null
    },
  },
]

// ─── Main analyser ────────────────────────────────────────────────────────────

export function analyzeRoutine(routine: Routine, skinType: SkinType | null = null): Warning[] {
  const { AM, PM, Weekly } = routine
  const all = [...AM, ...PM, ...Weekly]
  const warnings: Warning[] = []

  for (const rule of rules) {
    const result = rule.check(AM, PM, Weekly, all, skinType)
    if (result) warnings.push(result)
  }

  return warnings
}
