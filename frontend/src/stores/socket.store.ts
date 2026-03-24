import { create } from 'zustand'

interface SocketState {
  socket: WebSocket | null
  connected: boolean
  setSocket: (socket: WebSocket | null) => void
  setConnected: (connected: boolean) => void
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connected: false,
  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ connected }),
}))
