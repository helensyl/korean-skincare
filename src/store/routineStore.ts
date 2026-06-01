'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Routine, RoutineSlot, SkinType, Warning } from '@/types'
import { analyzeRoutine } from '@/lib/rules'

interface RoutineStore {
  routine: Routine
  warnings: Warning[]
  skinType: SkinType | null
  setSkinType: (type: SkinType | null) => void
  addProduct: (slot: RoutineSlot, product: Product) => void
  removeProduct: (slot: RoutineSlot, productId: string) => void
  moveProduct: (slot: RoutineSlot, fromIndex: number, toIndex: number) => void
  clearSlot: (slot: RoutineSlot) => void
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routine: { AM: [], PM: [], Weekly: [] },
      warnings: [],
      skinType: null,

      setSkinType: (type) => {
        set(state => ({
          skinType: type,
          warnings: analyzeRoutine(state.routine, type),
        }))
      },

      addProduct: (slot, product) => {
        set(state => {
          if (state.routine[slot].find(p => p.id === product.id)) return state
          const newRoutine = {
            ...state.routine,
            [slot]: [...state.routine[slot], product],
          }
          return { routine: newRoutine, warnings: analyzeRoutine(newRoutine, state.skinType) }
        })
      },

      removeProduct: (slot, productId) => {
        set(state => {
          const newRoutine = {
            ...state.routine,
            [slot]: state.routine[slot].filter(p => p.id !== productId),
          }
          return { routine: newRoutine, warnings: analyzeRoutine(newRoutine, state.skinType) }
        })
      },

      moveProduct: (slot, fromIndex, toIndex) => {
        set(state => {
          const items = [...state.routine[slot]]
          const [moved] = items.splice(fromIndex, 1)
          items.splice(toIndex, 0, moved)
          const newRoutine = { ...state.routine, [slot]: items }
          return { routine: newRoutine, warnings: analyzeRoutine(newRoutine, state.skinType) }
        })
      },

      clearSlot: (slot) => {
        set(state => {
          const newRoutine = { ...state.routine, [slot]: [] }
          return { routine: newRoutine, warnings: analyzeRoutine(newRoutine, state.skinType) }
        })
      },
    }),
    { name: 'skincare-routine' }
  )
)
