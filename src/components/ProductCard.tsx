'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { Product, RoutineSlot } from '@/types'
import { getImageUrl } from '@/lib/products'
import { useRoutineStore } from '@/store/routineStore'
import { SunIcon, MoonIcon, CalendarIcon } from './Icons'

interface Props {
  product: Product
}

const SLOT_LABELS: { key: RoutineSlot; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { key: 'AM',     label: 'morning', Icon: SunIcon },
  { key: 'PM',     label: 'evening', Icon: MoonIcon },
  { key: 'Weekly', label: 'weekly',  Icon: CalendarIcon },
]

export default function ProductCard({ product }: Props) {
  const { routine, addProduct, removeProduct } = useRoutineStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const inSlots = SLOT_LABELS.filter(s => routine[s.key].some(p => p.id === product.id))
  const isAdded = inSlots.length > 0

  const handleAdd = (slot: RoutineSlot) => {
    addProduct(slot, product)
    setMenuOpen(false)
  }

  const handleRemove = (slot: RoutineSlot) => {
    removeProduct(slot, product.id)
    setMenuOpen(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('productId', product.id)
    e.dataTransfer.effectAllowed = 'copy'
  }

  // Simplified ingredient tags — always show something, always consistent
  const tags = product.key_ingredients.length > 0
    ? product.key_ingredients
        .slice(0, 2)
        .map(ing => ing.length > 18 ? ing.split(' ').slice(0, 2).join(' ') : ing)
    : [product.category]

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white rounded-2xl border overflow-visible transition-all flex flex-col relative cursor-grab active:cursor-grabbing active:opacity-60 active:scale-[0.98] ${
        isAdded
          ? 'border-olive-400 ring-2 ring-olive-300/60 shadow-sm hover:shadow-md'
          : 'border-cream-200 hover:border-cream-300 hover:shadow-md'
      }`}
    >
      {/* Image */}
      <div className="relative bg-cream-50 w-full aspect-square shrink-0 rounded-t-2xl overflow-hidden">
        <Image
          src={getImageUrl(product.image_path)}
          alt={product.name}
          fill
          className="object-contain p-4"
          unoptimized
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement
            img.src = `https://placehold.co/300x300/f7f0e8/c9b89f?text=${encodeURIComponent(product.brand)}`
          }}
        />
        {isAdded && (
          <div className="absolute top-2 right-2 bg-olive-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none tracking-wide">
            {inSlots.map(s => s.key).join('+')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-1">
        <p className="text-[10px] font-semibold text-olive-600 uppercase tracking-widest truncate shrink-0">
          {product.brand}
        </p>
        <p className="text-xs font-medium text-stone-700 line-clamp-2 leading-snug mt-1 h-8 shrink-0">
          {product.name}
        </p>

        {/* Ingredient tags — always renders consistently */}
        <div className="flex gap-1 overflow-hidden h-[18px] mt-1.5 shrink-0">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center h-[18px] text-[10px] bg-olive-50 text-olive-600 px-2 rounded-full whitespace-nowrap shrink-0 leading-none font-medium">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm font-semibold text-stone-800 mt-auto pt-2 shrink-0">
          ${product.price_usd.toFixed(2)}
        </p>
      </div>

      {/* Add button */}
      <div ref={menuRef} className="px-3 pb-3 shrink-0 relative">
        <button
          onClick={() => setMenuOpen(o => !o)}
          className={`w-full text-[11px] font-semibold rounded-full py-1.5 tracking-wide transition-all cursor-pointer ${
            isAdded
              ? 'bg-white text-olive-700 border border-olive-400 hover:bg-olive-50'
              : 'bg-olive-500 text-white hover:bg-olive-600 border border-olive-500'
          }`}
        >
          {isAdded
            ? `✓ in routine · ${inSlots.map(s => s.label).join(', ')}`
            : '+ add to routine'}
        </button>

        {menuOpen && (
          <div className="absolute bottom-full mb-1.5 left-3 right-3 bg-white rounded-xl shadow-xl border border-cream-200 overflow-hidden z-30">
            {SLOT_LABELS.map(({ key, label, Icon }) => {
              const inThisSlot = routine[key].some(p => p.id === product.id)
              return (
                <button
                  key={key}
                  onClick={() => inThisSlot ? handleRemove(key) : handleAdd(key)}
                  className={`w-full text-left px-3 py-2.5 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${inThisSlot ? 'bg-olive-50 text-olive-700 hover:bg-olive-100' : 'text-stone-600 hover:bg-cream-50'}`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={12} className={inThisSlot ? 'text-olive-500' : 'text-stone-400'} />
                    {label}
                  </span>
                  <span className={`text-[11px] font-semibold ${inThisSlot ? 'text-olive-500' : 'text-stone-300'}`}>
                    {inThisSlot ? '✓ remove' : '+ add'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
