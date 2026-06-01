'use client'

import Image from 'next/image'
import { useRoutineStore } from '@/store/routineStore'
import { RoutineSlot } from '@/types'
import { getImageUrl } from '@/lib/products'

const SLOTS: {
  key: RoutineSlot
  label: string
  emoji: string
  border: string
  headerBg: string
  bodyBg: string
  emptyBorder: string
}[] = [
  {
    key: 'AM',
    label: 'Morning',
    emoji: '☀️',
    border: 'border-amber-200',
    headerBg: 'bg-amber-50',
    bodyBg: 'bg-amber-50/40',
    emptyBorder: 'border-amber-200',
  },
  {
    key: 'PM',
    label: 'Evening',
    emoji: '🌙',
    border: 'border-indigo-200',
    headerBg: 'bg-indigo-50',
    bodyBg: 'bg-indigo-50/40',
    emptyBorder: 'border-indigo-200',
  },
  {
    key: 'Weekly',
    label: 'Weekly',
    emoji: '📅',
    border: 'border-teal-200',
    headerBg: 'bg-teal-50',
    bodyBg: 'bg-teal-50/40',
    emptyBorder: 'border-teal-200',
  },
]

export default function RoutineBar() {
  const { routine, warnings, removeProduct, moveProduct, clearSlot } = useRoutineStore()
  const errorCount = warnings.filter(w => w.severity === 'error').length
  const warnCount = warnings.filter(w => w.severity === 'warning').length

  return (
    <div className="sticky top-[57px] z-30 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-3 gap-3">
          {SLOTS.map(slot => {
            const products = routine[slot.key]

            return (
              <div
                key={slot.key}
                className={`rounded-xl border ${slot.border} overflow-hidden`}
              >
                {/* Slot header */}
                <div className={`flex items-center justify-between px-3 py-2 ${slot.headerBg}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{slot.emoji}</span>
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">{slot.label}</span>
                    {products.length > 0 && (
                      <span className="text-[10px] text-stone-400 font-medium">{products.length} step{products.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                  {products.length > 0 && (
                    <button
                      onClick={() => clearSlot(slot.key)}
                      className="text-[10px] text-stone-400 hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Slot body */}
                <div className={`px-2 py-2 ${slot.bodyBg}`}>
                  {products.length === 0 ? (
                    <div className={`border border-dashed ${slot.emptyBorder} rounded-lg py-3 text-center`}>
                      <p className="text-[11px] text-stone-400">Empty — add from catalog</p>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                      {products.map((product, idx) => (
                        <div
                          key={product.id}
                          className="flex-shrink-0 flex flex-col items-center gap-1 bg-white rounded-lg p-1.5 w-[72px] group relative border border-stone-100"
                        >
                          {/* Step number */}
                          <span className="absolute top-1 left-1 text-[9px] font-bold text-stone-400 bg-stone-50 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-stone-200 leading-none">
                            {idx + 1}
                          </span>

                          {/* Remove button */}
                          <button
                            onClick={() => removeProduct(slot.key, product.id)}
                            className="absolute top-1 right-1 text-[9px] text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center border border-stone-200 leading-none"
                          >
                            ✕
                          </button>

                          {/* Product image */}
                          <div className="relative w-10 h-10 bg-stone-50 rounded-md mt-1">
                            <Image
                              src={getImageUrl(product.image_path)}
                              alt={product.name}
                              fill
                              className="object-contain p-0.5"
                              unoptimized
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  `https://placehold.co/60x60/f5f0eb/a8a29e?text=${product.brand.slice(0, 1)}`
                              }}
                            />
                          </div>

                          {/* Brand + name */}
                          <p className="text-[9px] font-bold text-rose-400 text-center truncate w-full leading-none">{product.brand}</p>
                          <p className="text-[9px] text-stone-600 text-center line-clamp-2 leading-tight">{product.name}</p>

                          {/* Reorder arrows — show on hover */}
                          <div className="flex gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => idx > 0 && moveProduct(slot.key, idx, idx - 1)}
                              disabled={idx === 0}
                              className="text-[10px] text-stone-400 hover:text-stone-700 disabled:opacity-20 leading-none"
                            >◀</button>
                            <button
                              onClick={() => idx < products.length - 1 && moveProduct(slot.key, idx, idx + 1)}
                              disabled={idx === products.length - 1}
                              className="text-[10px] text-stone-400 hover:text-stone-700 disabled:opacity-20 leading-none"
                            >▶</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Global warning badge */}
        {(errorCount > 0 || warnCount > 0) && (
          <div className={`mt-2 text-center text-xs font-semibold py-1 rounded-lg ${errorCount > 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            {errorCount > 0
              ? `🚫 ${errorCount} conflict${errorCount > 1 ? 's' : ''} detected — see Analysis`
              : `⚠️ ${warnCount} warning${warnCount > 1 ? 's' : ''} — see Analysis`}
          </div>
        )}
      </div>
    </div>
  )
}
