'use client'

import { useState, useRef, useEffect } from 'react'
import Catalog from '@/components/Catalog'
import RoutinePanel from '@/components/RoutinePanel'
import AnalysisPanel from '@/components/AnalysisPanel'
import RecommendModal from '@/components/RecommendModal'
import OlivePickLogo from '@/components/OlivePickLogo'
import { RecommendIcon, ChevronDownIcon, TrashIcon } from '@/components/Icons'
import IntroScreen from '@/components/IntroScreen'
import { useRoutineStore } from '@/store/routineStore'
import { RoutineSlot } from '@/types'

export default function Home() {
  const [showRecommend, setShowRecommend] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draggingFromRoutine, setDraggingFromRoutine] = useState<{ slot: RoutineSlot; productId: string } | null>(null)
  const asideRef = useRef<HTMLElement>(null)
  const { removeProduct } = useRoutineStore()

  // Listen for routine-card drag start/end to show the discard overlay
  useEffect(() => {
    const onStart = (e: Event) => {
      const { slot, productId } = (e as CustomEvent).detail
      setDraggingFromRoutine({ slot, productId })
    }
    const onEnd = () => setDraggingFromRoutine(null)
    window.addEventListener('routine-drag-start', onStart)
    window.addEventListener('routine-drag-end', onEnd)
    return () => {
      window.removeEventListener('routine-drag-start', onStart)
      window.removeEventListener('routine-drag-end', onEnd)
    }
  }, [])

  // Auto-collapse the sidebar on mobile once the user scrolls past it
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) return        // desktop: leave it alone
      if (!sidebarOpen || !asideRef.current) return
      const asideBottom = asideRef.current.getBoundingClientRect().bottom
      if (asideBottom < 110) setSidebarOpen(false) // 57px header + ~48px toggle
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen flex flex-col">
      <IntroScreen />

      {/* Discard overlay — outside isolate container so fixed positioning works correctly */}
      {draggingFromRoutine && (
        <div
          className="hidden md:flex fixed top-[57px] bottom-0 right-0 z-[200] bg-stone-200/60 backdrop-blur-[2px] items-center justify-center"
          style={{ left: 'calc((100vw - min(100vw, 80rem)) / 2 + 380px)' }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
          onDrop={(e) => {
            e.preventDefault()
            removeProduct(draggingFromRoutine.slot, draggingFromRoutine.productId)
            setDraggingFromRoutine(null)
            window.dispatchEvent(new CustomEvent('routine-drag-end'))
          }}
        >
          <div className="flex flex-col items-center gap-3 select-none pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-stone-400 flex items-center justify-center">
              <TrashIcon size={24} className="text-stone-400" />
            </div>
            <p className="text-sm font-semibold text-stone-600 tracking-wide">drop here to remove from routine</p>
          </div>
        </div>
      )}

      {/* Fixed header */}
      <header className="bg-white border-b border-cream-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <OlivePickLogo />
        </div>
      </header>

      {/* Fixed mobile toggle — sits just below the header, hidden on md+ */}
      <div className="fixed top-[57px] left-0 right-0 z-40 md:hidden bg-white border-b border-cream-200">
        <button
          className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
          onClick={() => setSidebarOpen(o => !o)}
        >
          <span className="font-body text-stone-700 text-xl font-semibold leading-none">
            my routine &amp; analysis
          </span>
          <ChevronDownIcon
            size={14}
            className={`text-stone-400 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Sidebar background bleed — extends cream bg from left edge to sidebar right border */}
      <div
        className="hidden md:block fixed top-[57px] bottom-0 left-0 bg-cream-50 border-r border-cream-200 -z-10"
        style={{ width: 'calc((100vw - min(100vw, 80rem)) / 2 + 380px)' }}
      />

      {/* Body
          Mobile:  pt = fixed header (57px) + fixed toggle (~48px) = 105px
          Desktop: pt = fixed header (57px) only                          */}
      <div className="flex flex-col md:flex-row flex-1 max-w-7xl w-full mx-auto isolate pt-[105px] md:pt-[57px]">

        {/* Sidebar */}
        <aside
          ref={asideRef}
          className={`w-full md:w-[380px] shrink-0 md:sticky md:top-[57px] md:h-[calc(100vh-57px)] md:overflow-y-auto bg-cream-50 md:border-r border-cream-200 ${sidebarOpen ? 'border-b' : ''}`}
        >
          <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
            <div className="p-4 md:p-5 flex flex-col gap-6">

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-body text-stone-700 text-xl font-semibold leading-none">my routine</h2>
                  <button
                    onClick={() => setShowRecommend(true)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-olive-500 hover:bg-olive-600 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    <RecommendIcon size={12} className="text-white" />
                    recommend
                  </button>
                </div>
                <RoutinePanel />
              </div>

              <div className="border-t border-cream-200 pt-5">
                <h2 className="font-body text-stone-700 text-xl font-semibold leading-none mb-3">analysis</h2>
                <AnalysisPanel />
              </div>

            </div>
          </div>
        </aside>

        {/* Catalog */}
        <main className="flex-1 min-w-0 relative z-0">
          {/* "olive young products" — sticky on mobile, no top padding so it sits flush under the toggle bar */}
          <div className="sticky top-[105px] md:static z-30 bg-white md:bg-transparent border-b border-cream-200 md:border-none px-4 pt-3 pb-3 md:px-6 md:pt-6 md:pb-0">
            <h2 className="font-body text-stone-700 text-xl font-semibold leading-none">olive young products</h2>
          </div>
          {/* pt-5 adds the gap between heading and search bar */}
          <div className="px-4 pt-5 pb-4 md:px-6 md:pt-4 md:pb-6">
            <Catalog />
          </div>
        </main>

      </div>

      {showRecommend && <RecommendModal onClose={() => setShowRecommend(false)} />}
    </div>
  )
}
