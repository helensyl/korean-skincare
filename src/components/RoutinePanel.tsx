'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRoutineStore } from '@/store/routineStore'
import { RoutineSlot } from '@/types'
import { getImageUrl, singleProducts } from '@/lib/products'
import { SunIcon, MoonIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons'

const SEVERITY_RANK = { error: 2, warning: 1, tip: 0 } as const

const HIGHLIGHT: Record<'error' | 'warning' | 'tip', string> = {
  error:   'border-red-300 ring-1 ring-red-200',
  warning: 'border-amber-300 ring-1 ring-amber-200',
  tip:     'border-blue-300 ring-1 ring-blue-200',
}

const SLOTS: { key: RoutineSlot; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { key: 'AM',     label: 'morning', Icon: SunIcon      },
  { key: 'PM',     label: 'evening', Icon: MoonIcon     },
  { key: 'Weekly', label: 'weekly',  Icon: CalendarIcon },
]

export default function RoutinePanel() {
  const { routine, warnings, addProduct, removeProduct, moveProduct, clearSlot } = useRoutineStore()

  const [dragOver, setDragOver] = useState<RoutineSlot | null>(null)
  const [dragging, setDragging] = useState<{ slot: RoutineSlot; idx: number; productId: string } | null>(null)
  const [insertBefore, setInsertBefore] = useState<{ slot: RoutineSlot; idx: number } | null>(null)

  const handleSlotDragOver = (e: React.DragEvent, slot: RoutineSlot) => {
    if (e.dataTransfer.types.includes('routineproductid')) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOver(slot)
  }

  const handleSlotDrop = (e: React.DragEvent, slot: RoutineSlot) => {
    e.preventDefault()
    setDragOver(null)
    const productId = e.dataTransfer.getData('productId')
    const product = singleProducts.find(p => p.id === productId)
    if (product) addProduct(slot, product)
  }

  const productHighlight = new Map<string, 'error' | 'warning' | 'tip'>()
  for (const w of warnings) {
    for (const id of w.affected) {
      const current = productHighlight.get(id)
      if (current === undefined || SEVERITY_RANK[w.severity] > SEVERITY_RANK[current]) {
        productHighlight.set(id, w.severity)
      }
    }
  }

  const getInsertionIdx = (e: React.DragEvent, cardIdx: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    return e.clientX < rect.left + rect.width / 2 ? cardIdx : cardIdx + 1
  }

  return (
    <div className="flex flex-col gap-2.5">

{SLOTS.map(slot => {
        const products = routine[slot.key]
        const { Icon } = slot
        const isReordering = dragging?.slot === slot.key

        return (
          <div key={slot.key} className="rounded-xl border border-cream-200 overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-cream-100">
              <div className="flex items-center gap-1.5">
                <Icon size={12} className="text-olive-400" />
                <span className="text-[11px] font-semibold text-stone-500 tracking-widest uppercase">{slot.label}</span>
                {products.length > 0 && (
                  <span className="text-[10px] text-stone-400 font-medium">
                    {products.length} step{products.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {products.length > 0 && (
                <button
                  onClick={() => clearSlot(slot.key)}
                  className="text-[10px] font-medium text-stone-400 hover:text-red-400 transition-colors cursor-pointer tracking-wide"
                >
                  clear
                </button>
              )}
            </div>

            {/* Body */}
            <div
              className={`px-2 py-2 rounded-b-xl transition-colors ${dragOver === slot.key ? 'bg-olive-100' : 'bg-olive-50/60'}`}
              onDragOver={e => handleSlotDragOver(e, slot.key)}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleSlotDrop(e, slot.key)}
            >
              {products.length === 0 ? (
                <div className={`border border-dashed border-cream-300 rounded-lg py-3 text-center transition-all ${dragOver === slot.key ? 'bg-white/60' : ''}`}>
                  <p className="text-[11px] text-stone-300">
                    {dragOver === slot.key ? 'drop to add' : 'empty — drag or add from catalog'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-0 overflow-x-auto pb-0.5 items-stretch">
                    {products.map((product, idx) => {
                      const severity = productHighlight.get(product.id)
                      const isBeingDragged = dragging?.slot === slot.key && dragging?.idx === idx
                      const showInsertBefore = insertBefore?.slot === slot.key && insertBefore?.idx === idx
                      const showInsertAfter = idx === products.length - 1 && insertBefore?.slot === slot.key && insertBefore?.idx === products.length

                      return (
                        <div key={product.id} className="flex items-stretch flex-shrink-0">
                          {/* Insertion line before */}
                          <div className={`w-0.5 rounded-full mx-0.5 my-1 transition-all ${showInsertBefore ? 'bg-olive-400 opacity-100' : 'opacity-0'}`} />

                          <div
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('routineProductId', product.id)
                              e.dataTransfer.setData('routineProductSlot', slot.key)
                              e.dataTransfer.effectAllowed = 'move'
                              setDragging({ slot: slot.key, idx, productId: product.id })
                              window.dispatchEvent(new CustomEvent('routine-drag-start', {
                                detail: { slot: slot.key, productId: product.id }
                              }))
                            }}
                            onDragEnd={(e) => {
                              if (e.dataTransfer.dropEffect === 'none' && window.innerWidth >= 768) {
                                removeProduct(slot.key, product.id)
                              }
                              setDragging(null)
                              setInsertBefore(null)
                              window.dispatchEvent(new CustomEvent('routine-drag-end'))
                            }}
                            onDragOver={(e) => {
                              if (!dragging || dragging.slot !== slot.key || dragging.idx === idx) return
                              e.preventDefault()
                              e.stopPropagation()
                              e.dataTransfer.dropEffect = 'move'
                              setInsertBefore({ slot: slot.key, idx: getInsertionIdx(e, idx) })
                            }}
                            onDragLeave={(e) => {
                              if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
                                setInsertBefore(null)
                              }
                            }}
                            onDrop={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (dragging && dragging.slot === slot.key && insertBefore) {
                                let to = insertBefore.idx
                                if (to > dragging.idx) to -= 1
                                if (to !== dragging.idx) moveProduct(slot.key, dragging.idx, to)
                              }
                              setInsertBefore(null)
                            }}
                            className={`flex-shrink-0 flex flex-col items-center gap-1 bg-white rounded-xl p-1.5 w-[72px] group relative border transition-all mx-0.5
                              ${isBeingDragged ? 'opacity-30 cursor-grabbing' : 'cursor-grab'}
                              ${severity ? HIGHLIGHT[severity] : 'border-cream-200'}
                            `}
                          >
                            <span className="absolute top-1 left-1 text-[9px] font-bold text-stone-300 bg-cream-50 rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                              {idx + 1}
                            </span>

                            <button
                              onClick={() => removeProduct(slot.key, product.id)}
                              className="absolute top-1 right-1 text-[9px] text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none cursor-pointer z-10"
                            >✕</button>

                            <div className="relative w-10 h-10 bg-cream-50 rounded-lg mt-1">
                              <Image
                                src={getImageUrl(product.image_path)}
                                alt={product.name}
                                fill
                                className="object-contain p-0.5"
                                unoptimized
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    `https://placehold.co/60x60/f7f0e8/c9b89f?text=${product.brand.slice(0, 1)}`
                                }}
                              />
                            </div>

                            <p className="text-[9px] font-bold text-olive-500 text-center truncate w-full leading-none">{product.brand}</p>
                            <p className="text-[9px] text-stone-400 text-center line-clamp-2 leading-tight">{product.name}</p>

                            {/* Arrow reorder buttons */}
                            {!isReordering && (
                              <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between px-0.5 pb-0.5 pointer-events-none group-hover:pointer-events-auto">
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (idx > 0) moveProduct(slot.key, idx, idx - 1) }}
                                  disabled={idx === 0}
                                  className="w-5 h-5 flex items-center justify-center rounded-full bg-white/90 border border-cream-200 text-stone-400 hover:text-olive-600 hover:border-olive-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
                                  title="move earlier"
                                >
                                  <ChevronLeftIcon size={10} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (idx < products.length - 1) moveProduct(slot.key, idx, idx + 1) }}
                                  disabled={idx === products.length - 1}
                                  className="w-5 h-5 flex items-center justify-center rounded-full bg-white/90 border border-cream-200 text-stone-400 hover:text-olive-600 hover:border-olive-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
                                  title="move later"
                                >
                                  <ChevronRightIcon size={10} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Insertion line after last card */}
                          {showInsertAfter && (
                            <div className="w-0.5 rounded-full mx-0.5 my-1 bg-olive-400" />
                          )}
                        </div>
                      )
                    })}

                    {dragOver === slot.key && (
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-[72px] rounded-xl border-2 border-dashed border-cream-300 bg-white/70 min-h-[96px] gap-1.5 mx-0.5">
                        <Icon size={14} className="text-olive-300" />
                        <span className="text-[9px] text-stone-300 text-center leading-tight px-1">drop here</span>
                      </div>
                    )}
                  </div>

                  {isReordering && (
                    <p className="text-[10px] text-olive-400 text-center leading-none pb-0.5 font-medium">
                      drop to reorder
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
