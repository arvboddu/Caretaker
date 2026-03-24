import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import { useAuthStore } from '../stores/auth.store'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  status: string
}

interface Thread {
  id: string
  otherUser: { id: string; fullName: string; profilePhoto: string }
  lastMessage: { content: string; createdAt: string }
  unreadCount: number
}

export default function ChatPage() {
  const { threadId } = useParams<{ threadId?: string }>()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessage, setNewMessage] = useState('')

  const { data: threadsData } = useQuery({
    queryKey: ['chat-threads'],
    queryFn: async () => {
      const response = await api.get('/chat/threads')
      return response.data.data
    },
  })

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', threadId],
    queryFn: async () => {
      const response = await api.get(`/chat/threads/${threadId}/messages`)
      return response.data.data
    },
    enabled: !!threadId,
    refetchInterval: 5000,
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/chat/threads/${threadId}/messages`, { content })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', threadId] })
      queryClient.invalidateQueries({ queryKey: ['chat-threads'] })
      setNewMessage('')
    },
    onError: () => {
      toast.error('Failed to send message')
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesData?.messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    sendMessageMutation.mutate(newMessage)
  }

  if (!threadId) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-navy">Messages</h1>
        {threadsData?.threads?.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {threadsData.threads.map((thread: Thread) => (
              <a
                key={thread.id}
                href={`/chat/${thread.id}`}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition"
              >
                <img
                  src={thread.otherUser.profilePhoto || 'https://via.placeholder.com/48'}
                  alt={thread.otherUser.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-navy truncate">
                      {thread.otherUser.fullName}
                    </span>
                    <span className="text-xs text-slate">
                      {format(new Date(thread.lastMessage.createdAt), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-slate truncate">{thread.lastMessage.content}</p>
                </div>
                {thread.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{thread.unreadCount}</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-slate">No conversations yet</p>
            <p className="text-sm text-slate mt-1">Book a caretaker to start chatting</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center gap-3 mb-4">
        <a href="/chat" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="text-slate" size={20} />
        </a>
        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
          <span className="text-primary font-semibold">
            {threadsData?.threads?.find((t: Thread) => t.id === threadId)?.otherUser.fullName?.charAt(0) || 'U'}
          </span>
        </div>
        <span className="font-semibold text-navy">
          {threadsData?.threads?.find((t: Thread) => t.id === threadId)?.otherUser.fullName || 'Chat'}
        </span>
      </div>

      <div className="flex-1 bg-white rounded-xl p-4 overflow-y-auto mb-4">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate">Loading messages...</p>
          </div>
        ) : messagesData?.messages?.length > 0 ? (
          <div className="space-y-3">
            {messagesData.messages.map((message: Message) => {
              const isOwn = message.senderId === user?.id || message.senderId === user?.userId
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      isOwn
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 text-navy rounded-bl-md'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${isOwn ? 'text-primary-light' : 'text-slate'}`}>
                      {format(new Date(message.createdAt), 'h:mm a')}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate">No messages yet. Say hello!</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
          className="btn-primary px-4"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
