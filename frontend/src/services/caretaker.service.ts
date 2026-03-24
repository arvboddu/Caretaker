import api from './api'

export interface Caretaker {
  id: string
  fullName: string
  bio: string
  skills: string[]
  yearsExperience: number
  hourlyRate: number
  dailyRate: number
  rating: number
  reviewCount: number
  profilePhoto: string
  availability: Record<string, { start: string; end: string } | null>
}

export const caretakerService = {
  getProfile: async () => {
    const response = await api.get('/caretakers/profile')
    return response.data
  },

  updateProfile: async (data: Partial<Caretaker>) => {
    const response = await api.put('/caretakers/profile', data)
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/caretakers/${id}`)
    return response.data
  },

  updateAvailability: async (availability: Record<string, { start: string; end: string } | null>) => {
    const response = await api.put('/caretakers/availability', { availability })
    return response.data
  },
}
