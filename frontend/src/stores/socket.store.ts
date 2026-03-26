import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface SocketState {
  socket: Socket | null
  connected: boolean
  typingUsers: Record<string, boolean>
  connect: (token: string) => void
  disconnect: () => void
  joinThread: (threadId: string) => void
  leaveThread: (threadId: string) => void
  sendTyping: (threadId: string, isTyping: boolean) => void
  setTyping: (threadId: string, isTyping: boolean) => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,
  typingUsers: {},

  connect: (token: string) => {
    const socket = io(window.location.origin, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      set({ connected: true })
      socket.emit('authenticate', token)
    })

    socket.on('disconnect', () => {
      set({ connected: false })
    })

    socket.on('authenticated', () => {
      console.log('Socket authenticated')
    })

    socket.on('user_typing', ({ threadId, isTyping }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [threadId]: isTyping },
      }))
    })

    socket.on('new_message', (message) => {
      window.dispatchEvent(new CustomEvent('socket_message', { detail: message }))
    })

    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, connected: false })
    }
  },

  joinThread: (threadId: string) => {
    const { socket } = get()
    if (socket) {
      socket.emit('join_thread', threadId)
    }
  },

  leaveThread: (threadId: string) => {
    const { socket } = get()
    if (socket) {
      socket.emit('leave_thread', threadId)
    }
  },

  sendTyping: (threadId: string, isTyping: boolean) => {
    const { socket } = get()
    if (socket) {
      socket.emit('typing', { threadId, isTyping })
    }
  },

  setTyping: (threadId: string, isTyping: boolean) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [threadId]: isTyping },
    }))
  },
}))
