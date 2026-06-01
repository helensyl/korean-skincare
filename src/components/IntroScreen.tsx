'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function IntroScreen() {
  const [phase, setPhase] = useState<'idle' | 'exit' | 'gone'>('idle')
  const triggered = useRef(false)

  const dismiss = () => {
    if (triggered.current) return
    triggered.current = true
    document.body.style.overflow = ''
    setPhase('exit')
    setTimeout(() => setPhase('gone'), 750)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (phase === 'gone') return null

  const exiting = phase === 'exit'

  return (
    <div
      className={`fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center gap-2 select-none px-6
        transition-transform duration-700 ease-in-out ${exiting ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* OLIVE [image] PICK */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <span
          className="font-body font-semibold italic uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#3d3d3d' }}
        >
          olive
        </span>

        <Image
          src="/olive-pick.png"
          alt="olive on a pick"
          width={300}
          height={400}
          className="object-contain"
          style={{ height: 'clamp(5rem, 14vw, 10rem)', width: 'auto', transform: 'rotate(12deg)' }}
          unoptimized
        />

        <span
          className="font-body font-semibold italic uppercase leading-none tracking-tight -ml-5"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#3d3d3d' }}
        >
          pick
        </span>
      </div>

      {/* Subtitle */}
      <p className="font-body text-stone-400 text-center text-base sm:text-xl">
        korean skincare routine builder
      </p>

      {/* Get started button */}
      <button
        onClick={dismiss}
        className="mt-6 font-body font-medium text-sm px-10 py-2 rounded-full tracking-wide cursor-pointer transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, rgba(191,211,110,0.45) 0%, rgba(148,170,58,0.3) 50%, rgba(118,136,45,0.4) 100%)',
          color: '#3d5010',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(191,211,110,0.5)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.05)',
          animation: 'glow-pulse 2s ease-in-out infinite',
        }}
      >
        get started
      </button>
    </div>
  )
}
