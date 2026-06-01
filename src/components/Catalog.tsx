'use client'

import { useState, useMemo } from 'react'
import { singleProducts } from '@/lib/products'
import { PARENT_CATEGORIES, SUB_CATEGORIES } from '@/types'
import ProductCard from './ProductCard'
import { SearchIcon } from './Icons'

export default function Catalog() {
  const [parentFilter, setParentFilter] = useState<string>('All')
  const [subFilter, setSubFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  const subCategories = parentFilter === 'All' ? [] : SUB_CATEGORIES[parentFilter] ?? []

  const filtered = useMemo(() => {
    return singleProducts.filter(p => {
      const matchesParent = parentFilter === 'All' || p.parent_category === parentFilter
      const matchesSub = subFilter === 'All' || p.category === subFilter
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.key_ingredients.some(i => i.toLowerCase().includes(search.toLowerCase()))
      return matchesParent && matchesSub && matchesSearch
    })
  }, [parentFilter, subFilter, search])

  const handleParentChange = (cat: string) => {
    setParentFilter(cat)
    setSubFilter('All')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <SearchIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" />
        <input
          type="text"
          placeholder="search products, brands, ingredients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-full border border-cream-200 bg-white text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-olive-200 focus:border-olive-300 transition-all"
        />
      </div>

      {/* Parent category tabs + clear all */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          {PARENT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleParentChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
                parentFilter === cat
                  ? 'bg-olive-500 text-white border border-olive-500'
                  : 'bg-white text-stone-500 border border-cream-200 hover:border-olive-300 hover:text-olive-700'
              }`}
            >
              {cat.toLowerCase()}
            </button>
          ))}
        </div>
        {(search !== '' || parentFilter !== 'All') && (
          <button
            onClick={() => { setSearch(''); handleParentChange('All') }}
            className="text-[11px] text-stone-400 hover:text-red-400 transition-colors cursor-pointer font-medium shrink-0"
          >
            clear all ✕
          </button>
        )}
      </div>

      {/* Sub-category pills */}
      {subCategories.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setSubFilter('All')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              subFilter === 'All'
                ? 'bg-olive-500 text-white'
                : 'bg-white text-stone-400 border border-cream-200 hover:text-olive-600 hover:border-olive-200'
            }`}
          >
            all
          </button>
          {subCategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSubFilter(sub)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                subFilter === sub
                  ? 'bg-olive-500 text-white'
                  : 'bg-white text-stone-400 border border-cream-200 hover:text-olive-600 hover:border-olive-200'
              }`}
            >
              {sub.toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-[11px] text-stone-400 font-medium tracking-wide">{filtered.length} products</p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-stone-300 py-12 text-sm font-light">No products found.</p>
        )}
      </div>
    </div>
  )
}
