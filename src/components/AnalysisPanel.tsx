'use client'

import { useRoutineStore } from '@/store/routineStore'
import { Warning } from '@/types'
import { ConflictIcon, WarningIcon, TipIcon, BottleIcon, CheckCircleIcon } from './Icons'

const SEVERITY_CONFIG = {
  error:   { Icon: ConflictIcon,  label: 'conflict', accent: 'border-l-red-300',   text: 'text-red-500',   badge: 'bg-red-50 text-red-400' },
  warning: { Icon: WarningIcon,   label: 'caution',  accent: 'border-l-amber-300', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-500' },
  tip:     { Icon: TipIcon,       label: 'tip',      accent: 'border-l-blue-300',  text: 'text-blue-500',  badge: 'bg-blue-50 text-blue-400'   },
}

function WarningCard({ warning }: { warning: Warning }) {
  const cfg = SEVERITY_CONFIG[warning.severity]
  const { Icon } = cfg
  return (
    <div className={`rounded-xl border border-cream-200 bg-white border-l-4 ${cfg.accent} p-3`}>
      <div className="flex items-start gap-2.5">
        <Icon size={13} className={`${cfg.text} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
          <p className="text-[11px] mt-1.5 leading-relaxed text-stone-500">{warning.message}</p>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisPanel() {
  const { routine, warnings } = useRoutineStore()
  const totalProducts = routine.AM.length + routine.PM.length + routine.Weekly.length
  const sorted = [
    ...warnings.filter(w => w.severity === 'error'),
    ...warnings.filter(w => w.severity === 'warning'),
    ...warnings.filter(w => w.severity === 'tip'),
  ]

  if (totalProducts === 0) {
    return (
      <div className="rounded-xl border border-cream-200 bg-white p-5 text-center">
        <BottleIcon size={22} className="text-stone-200 mx-auto mb-2" />
        <p className="text-stone-400 text-sm font-medium">no products yet</p>
        <p className="text-stone-300 text-[11px] mt-1 font-light">add products to get personalised analysis</p>
      </div>
    )
  }

  if (warnings.length === 0) {
    return (
      <div className="rounded-xl border border-cream-200 bg-white border-l-4 border-l-olive-300 p-3">
        <div className="flex items-start gap-2.5">
          <CheckCircleIcon size={13} className="text-olive-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-olive-50 text-olive-500">
              all clear
            </span>
            <p className="text-[11px] mt-1.5 leading-relaxed text-stone-500">your routine looks well-balanced — no conflicts detected</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((w, i) => (
        <WarningCard key={`${w.rule}-${i}`} warning={w} />
      ))}
    </div>
  )
}
