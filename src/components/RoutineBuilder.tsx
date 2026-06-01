'use client'

import { useRoutineStore } from '@/store/routineStore'
import { RoutineSlot } from '@/types'
import { getImageUrl } from '@/lib/products'
import Image from 'next/image'

const SLOTS: { key: RoutineSlot; label: string; emoji: string; desc: string; color: string }[] = [
  { key: 'AM', label: 'Morning', emoji: '☀️', desc: 'Daily morning routine', color: 'from-amber-50 to-orange-50 border-amber-200' },
  { key: 'PM', label: 'Evening', emoji: '🌙', desc: 'Daily night routine', color: 'from-indigo-50 to-purple-50 border-indigo-200' },
  { key: 'Weekly', label: 'Weekly', emoji: '📅', desc: '2–3× per week', color: 'from-teal-50 to-emerald-50 border-teal-200' },
]

export default function RoutineBuilder() {
  const { routine, removeProduct, moveProduct, clearSlot } = useRoutineStore()

  return (
    <div className="flex flex-col gap-4">
      {SLOTS.map(slot => {
        const products = routine[slot.key]
        return (
          <div key={slot.key} className={`rounded-2xl border bg-gradient-to-br ${slot.color} p-4`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{slot.emoji}</span>
                <div>
                  <h3 className="font-bold text-stone-800 text-sm">{slot.label}</h3>
                  <p className="text-[11px] text-stone-500">{slot.desc}</p>
                </div>
              </div>
              {products.length > 0 && (
                <button
                  onClick={() => clearSlot(slot.key)}
                  className="text-[11px] text-stone-400 hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Steps */}
            {products.length === 0 ? (
              <div className="border-2 border-dashed border-stone-200 rounded-xl py-8 text-center">
                <p className="text-stone-400 text-xs">No products added yet</p>
                <p className="text-stone-300 text-[11px] mt-1">Browse the catalog and add products here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 shadow-sm group"
                  >
                    {/* Step number */}
                    <span className="text-[11px] font-bold text-stone-400 w-5 shrink-0">
                      {idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 shrink-0 bg-stone-50 rounded-lg">
                      <Image
                        src={getImageUrl(product.image_path)}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement
                          img.src = `https://placehold.co/80x80/f5f0eb/a8a29e?text=${encodeURIComponent(product.brand.slice(0,2))}`
                        }}
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-rose-400 truncate">{product.brand}</p>
                      <p className="text-xs text-stone-700 font-medium truncate">{product.name}</p>
                      <p className="text-[10px] text-stone-400">{product.category}</p>
                    </div>

                    {/* Reorder + Remove */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => idx > 0 && moveProduct(slot.key, idx, idx - 1)}
                        disabled={idx === 0}
                        className="text-stone-300 hover:text-stone-600 disabled:opacity-20 text-xs leading-none"
                        title="Move up"
                      >▲</button>
                      <button
                        onClick={() => idx < products.length - 1 && moveProduct(slot.key, idx, idx + 1)}
                        disabled={idx === products.length - 1}
                        className="text-stone-300 hover:text-stone-600 disabled:opacity-20 text-xs leading-none"
                        title="Move down"
                      >▼</button>
                    </div>

                    <button
                      onClick={() => removeProduct(slot.key, product.id)}
                      className="text-stone-300 hover:text-red-400 transition-colors text-sm opacity-0 group-hover:opacity-100 ml-1"
                      title="Remove"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
