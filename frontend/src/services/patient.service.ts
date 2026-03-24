import api from './api'

export interface PatientProfile {
  id: string
  userId: string
  fullName: string
  email: string
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
  medicalConditions?: string[]
  requiredServices?: string[]
  carePreferences?: string
  emergencyContact?: string
  profilePhoto?: string
  createdAt: string
  updatedAt: string
}

export interface UpdatePatientPayload {
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
  medicalConditions?: string[]
  requiredServices?: string[]
  carePreferences?: string
  emergencyContact?: string
}

export const patientService = {
  getProfile: async (): Promise<PatientProfile> => {
    const response = await api.get('/patients/profile')
    return response.data.data
  },

  updateProfile: async (payload: UpdatePatientPayload): Promise<void> => {
    await api.put('/patients/profile', payload)
  },

  getRecommendations: async (limit = 5) => {
    const response = await api.get('/patients/recommendations', { 
      params: { limit } 
    })
    return response.data.data
  },
}
