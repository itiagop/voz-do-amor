'use client'

import { create } from 'zustand'
import type { UserPayload } from './auth'

interface UserState {
  user: UserPayload | null
  setUser: (user: UserPayload | null) => void
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}))

interface RecordingState {
  currentPage: number
  totalPages: number
  isRecording: boolean
  audioBlob: Blob | null
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  setIsRecording: (recording: boolean) => void
  setAudioBlob: (blob: Blob | null) => void
  reset: () => void
}

export const useRecordingStore = create<RecordingState>((set) => ({
  currentPage: 0,
  totalPages: 0,
  isRecording: false,
  audioBlob: null,
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setAudioBlob: (blob) => set({ audioBlob: blob }),
  reset: () => set({ currentPage: 0, totalPages: 0, isRecording: false, audioBlob: null }),
}))
