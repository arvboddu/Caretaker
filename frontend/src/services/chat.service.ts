import api from './api'

export interface ChatThread {
  id: string
  participant_id: string
  participant_name: string
  participant_avatar?: string
  last_message: string
  last_message_time: string
  unread_count: number
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

export interface SendMessagePayload {
  receiver_id: string
  content: string
}

export const chatService = {
  getThreads: async (): Promise<ChatThread[]> => {
    const response = await api.get('/chat/threads')
    return response.data.data
  },

  getMessages: async (threadId: string): Promise<Message[]> => {
    const response = await api.get(`/chat/messages/${threadId}`)
    return response.data.data
  },

  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    const response = await api.post('/chat/message', payload)
    return response.data.data
  },

  markAsRead: async (threadId: string): Promise<void> => {
    await api.put(`/chat/thread/${threadId}/read`)
  },

  startConversation: async (caretakerId: string): Promise<ChatThread> => {
    const response = await api.post('/chat/start', { caretaker_id: caretakerId })
    return response.data.data
  },
}
