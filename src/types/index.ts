export interface Product {
  id: string
  brand: string
  name: string
  category: string
  parent_category: string
  rating: number
  review_count: number
  image_path: string
  skin_type: string[]
  key_ingredients: string[]
  formulation: string[]
  url: string
}

export type RoutineSlot = 'AM' | 'PM' | 'Weekly'

export interface Routine {
  AM: Product[]
  PM: Product[]
  Weekly: Product[]
}

export interface Warning {
  severity: 'error' | 'warning' | 'tip'
  message: string
  affected: string[] // product ids
  rule: string
}

export const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'] as const
export type SkinType = typeof SKIN_TYPES[number]

export const PARENT_CATEGORIES = ['All', 'Moisturizers', 'Cleansers', 'Acne & Blemish', 'Sun Care'] as const
export type ParentCategory = typeof PARENT_CATEGORIES[number]

export const SUB_CATEGORIES: Record<string, string[]> = {
  Moisturizers: ['Toner', 'Essence & Serum', 'Cream', 'Moisturizer (Lotion)', 'Face Mist', 'Face Oil', 'Spot Care'],
  Cleansers: ['Cleansing Foams', 'Cleansing Balms & Oils', 'Cleansing Water', 'Cleansing Milk', 'Cleansing Wipes', 'Makeup Remover', 'Exfoliators'],
  'Acne & Blemish': ['Acne & Blemish Treatments'],
  'Sun Care': ['Sunscreen'],
}
