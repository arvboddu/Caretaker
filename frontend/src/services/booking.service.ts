import api from './api'

export interface Booking {
  id: string
  patientId: string
  caretakerId: string
  date: string
  startTime: string
  endTime: string
  duration: number
  hourlyRate: number
  totalAmount: number
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  serviceNotes: string
  address: string
  caretaker?: { id: string; fullName: string; profilePhoto: string }
  patient?: { id: string; fullName: string; profilePhoto: string }
}

interface CreateBookingData {
  caretakerId: string
  date: string
  startTime: string
  duration: number
  serviceNotes: string
  address: string
  specialInstructions?: string
}

export const bookingService = {
  create: async (data: CreateBookingData) => {
    const response = await api.post('/bookings', data)
    return response.data
  },

  getBookings: async () => {
    const response = await api.get('/bookings')
    return response.data.data
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`)
    return response.data.data
  },

  cancelBooking: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status: 'cancelled' })
    return response.data
  },

  getAll: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const response = await api.get('/bookings', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  updateStatus: async (id: string, status: string, reason?: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status, reason })
    return response.data
  },

  getAvailability: async (caretakerId: string, fromDate: string, toDate: string) => {
    const response = await api.get(`/bookings/availability/${caretakerId}`, {
      params: { fromDate, toDate },
    })
    return response.data
  },
}
