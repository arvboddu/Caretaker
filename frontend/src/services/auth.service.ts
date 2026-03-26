import api from './api'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  fullName: string
  role: 'patient' | 'caretaker'
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },
}
