import productsData from '@/data/products.json'
import { Product } from '@/types'

export const products: Product[] = productsData as Product[]

export const IMAGE_BASE = 'https://cdn-image.oliveyoung.com/'

export function getImageUrl(imagePath: string): string {
  return `${IMAGE_BASE}${imagePath}?RS=400x400&AR=0&SF=webp&QT=80`
}

export function getUniqueCategories(): string[] {
  const cats = new Set(products.map(p => p.category))
  return Array.from(cats)
}

export function getUniqueParentCategories(): string[] {
  const cats = new Set(products.map(p => p.parent_category))
  return Array.from(cats)
}

// Filter out obvious bundles/gift sets
export function isBundle(product: Product): boolean {
  const lower = product.name.toLowerCase()
  return (
    lower.includes(' set') ||
    lower.includes(' pack') ||
    lower.includes('double pack') ||
    lower.includes('bundle') ||
    lower.includes('duo') ||
    lower.includes('trial kit') ||
    lower.includes('mini kit')
  )
}

export const singleProducts = products.filter(p => !isBundle(p))
