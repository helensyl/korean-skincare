'use client'

import { create } from 'zustand'
import { RoutineSlot } from '@/types'

interface DragStore {
  draggingFromRoutine: { slot: RoutineSlot; idx: number } | null
  setDraggingFromRoutine: (val: { slot: RoutineSlot; idx: number } | null) => void
}

export const useDragStore = create<DragStore>((set) => ({
  draggingFromRoutine: null,
  setDraggingFromRoutine: (val) => set({ draggingFromRoutine: val }),
}))
