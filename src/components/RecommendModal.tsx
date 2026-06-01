'use client'

import { useState } from 'react'
import { SKIN_TYPES, SkinType } from '@/types'
import { useRoutineStore } from '@/store/routineStore'
import { recommendRoutine } from '@/lib/recommend'
import {
  DropletIcon, LeafIcon, BalanceIcon, SparkleIcon, FlowerIcon,
  SunIcon, MoonIcon, CalendarIcon,
  CheckCircleIcon, WarningIcon,
} from './Icons'

const SKIN_META: Record<SkinType, {
  Icon: React.FC<{ size?: number; className?: string }>
  desc: string
}> = {
  Oily:        { Icon: DropletIcon,  desc: 'Shiny, enlarged pores' },
  Dry:         { Icon: LeafIcon,     desc: 'Tight, flaky texture' },
  Combination: { Icon: BalanceIcon,  desc: 'Oily T-zone, dry cheeks' },
  Normal:      { Icon: SparkleIcon,  desc: 'Balanced, few issues' },
  Sensitive:   { Icon: FlowerIcon,   desc: 'Reacts easily, redness' },
}

const SLOT_CONFIG = [
  { key: 'AM'     as const, label: 'morning', Icon: SunIcon      },
  { key: 'PM'     as const, label: 'evening', Icon: MoonIcon     },
  { key: 'Weekly' as const, label: 'weekly',  Icon: CalendarIcon },
]

interface Props { onClose: () => void }

export default function RecommendModal({ onClose }: Props) {
  const { setSkinType, routine } = useRoutineStore()
  const [selected, setSelected] = useState<SkinType | null>(null)
  const [preview, setPreview] = useState<ReturnType<typeof recommendRoutine> | null>(null)
  const [applied, setApplied] = useState(false)

  const hasExisting = routine.AM.length + routine.PM.length + routine.Weekly.length > 0

  const handleSelect = (type: SkinType) => {
    setSelected(type)
    setPreview(recommendRoutine(type))
    setApplied(false)
  }

  const handleApply = () => {
    if (!selected || !preview) return
    setSkinType(selected)
    const store = useRoutineStore.getState()
    store.clearSlot('AM')
    store.clearSlot('PM')
    store.clearSlot('Weekly')
    preview.AM.forEach(p => store.addProduct('AM', p))
    preview.PM.forEach(p => store.addProduct('PM', p))
    preview.Weekly.forEach(p => store.addProduct('Weekly', p))
    setApplied(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1814]/60" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto mx-2 border border-cream-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div>
            <h2 className="font-body font-semibold text-stone-700 text-xl leading-none">recommend a routine</h2>
            <p className="text-[11px] text-stone-400 mt-1.5 font-light">select your skin type to get a personalised routine</p>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-500 text-lg leading-none cursor-pointer transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Skin type picker */}
          <div className="grid grid-cols-5 gap-1.5">
            {SKIN_TYPES.map(type => {
              const { Icon, desc } = SKIN_META[type]
              const isSelected = selected === type
              return (
                <button
                  key={type}
                  onClick={() => handleSelect(type)}
                  className={`flex flex-col items-center gap-1 rounded-xl py-3 px-1 border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'border-olive-400 bg-white ring-2 ring-olive-200'
                      : 'border-cream-200 bg-white hover:border-olive-300 hover:ring-1 hover:ring-olive-100'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-olive-500' : 'text-stone-300'} />
                  <span className={`text-[10px] font-semibold leading-none tracking-wide ${isSelected ? 'text-olive-700' : 'text-stone-500'}`}>
                    {type.toLowerCase()}
                  </span>
                  <span className="text-[9px] text-stone-300 leading-tight hidden sm:block">{desc}</span>
                </button>
              )
            })}
          </div>

          {/* Preview */}
          {preview && selected && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                suggested for {selected.toLowerCase()} skin
              </p>
              {SLOT_CONFIG.map(slot => {
                const products = preview[slot.key]
                if (products.length === 0) return null
                const { Icon: SlotIcon } = slot
                return (
                  <div key={slot.key} className="rounded-xl border border-cream-200 bg-cream-50 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-cream-200">
                      <SlotIcon size={11} className="text-olive-400" />
                      <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest">
                        {slot.label}
                      </p>
                      <span className="text-[10px] text-stone-300">({products.length} steps)</span>
                    </div>
                    <div className="flex flex-col divide-y divide-cream-100">
                      {products.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-2.5 px-3 py-2">
                          <span className="text-[10px] text-stone-300 font-semibold w-4 shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-olive-500 truncate uppercase tracking-wide">{p.brand}</p>
                            <p className="text-[11px] text-stone-600 truncate">{p.name}</p>
                          </div>
                          <span className="text-[10px] text-stone-300 shrink-0 font-light text-stone-300">{p.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Existing routine warning */}
          {hasExisting && !applied && preview && (
            <div className="flex items-center gap-2.5 bg-white border border-cream-200 border-l-4 border-l-amber-300 rounded-xl px-3 py-2.5">
              <WarningIcon size={13} className="text-amber-400 shrink-0" />
              <p className="text-[11px] text-stone-500">this will replace your current routine</p>
            </div>
          )}

          {/* Actions */}
          {preview && (
            applied ? (
              <div className="flex flex-col gap-2">
                <div className="bg-white border border-cream-200 border-l-4 border-l-olive-300 rounded-xl px-3 py-3 flex items-start gap-2.5">
                  <CheckCircleIcon size={13} className="text-olive-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-olive-50 text-olive-500">applied</span>
                    <p className="text-[11px] mt-1.5 leading-relaxed text-stone-500">swap out individual products from the catalog</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-full py-2.5 rounded-full bg-olive-500 text-white text-sm font-semibold hover:bg-olive-600 transition-colors cursor-pointer tracking-wide">
                  done
                </button>
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="w-full py-3 rounded-full bg-olive-500 text-white text-sm font-semibold hover:bg-olive-600 transition-colors cursor-pointer tracking-wide"
              >
                apply this routine →
              </button>
            )
          )}

          {!preview && (
            <p className="text-center text-[11px] text-stone-300 py-2 font-body font-light">select a skin type above to see your recommendation</p>
          )}
        </div>
      </div>
    </div>
  )
}
