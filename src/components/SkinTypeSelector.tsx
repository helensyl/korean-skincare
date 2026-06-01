'use client'

import { useRoutineStore } from '@/store/routineStore'
import { SKIN_TYPES, SkinType } from '@/types'

const SKIN_META: Record<SkinType, { emoji: string; desc: string }> = {
  Oily:        { emoji: '💧', desc: 'Shiny, enlarged pores' },
  Dry:         { emoji: '🌵', desc: 'Tight, flaky, dull' },
  Combination: { emoji: '⚖️', desc: 'Oily T-zone, dry cheeks' },
  Normal:      { emoji: '✨', desc: 'Balanced, few issues' },
  Sensitive:   { emoji: '🌸', desc: 'Reacts easily, redness' },
}

export default function SkinTypeSelector() {
  const { skinType, setSkinType } = useRoutineStore()

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-stone-700 text-sm">My Skin Type</h3>
        {skinType && (
          <button
            onClick={() => setSkinType(null)}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-stone-400 mb-3">Select your skin type for personalised routine advice.</p>
      <div className="grid grid-cols-5 gap-2">
        {SKIN_TYPES.map(type => {
          const meta = SKIN_META[type]
          const isSelected = skinType === type
          return (
            <button
              key={type}
              onClick={() => setSkinType(isSelected ? null : type)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2.5 px-1 border text-center transition-all ${
                isSelected
                  ? 'bg-rose-50 border-rose-300 shadow-sm'
                  : 'border-stone-100 bg-stone-50 hover:border-stone-300'
              }`}
            >
              <span className="text-xl">{meta.emoji}</span>
              <span className={`text-[11px] font-semibold leading-none ${isSelected ? 'text-rose-600' : 'text-stone-600'}`}>
                {type}
              </span>
              <span className="text-[9px] text-stone-400 leading-tight hidden sm:block">{meta.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
