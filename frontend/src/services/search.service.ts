import api from './api'

export interface CaretakerSearchResult {
  id: string
  fullName: string
  bio: string
  rating: number
  reviewCount: number
  hourlyRate: number
  profilePhoto: string
  skills: string[]
  distance?: number
}

export interface SearchFilters {
  q?: string
  skills?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: 'rating' | 'price_low' | 'price_high'
}

export interface SearchResponse {
  caretakers: CaretakerSearchResult[]
  total: number
  filters: SearchFilters
}

export const searchService = {
  searchCaretakers: async (params: SearchFilters): Promise<SearchResponse> => {
    const response = await api.get('/search/caretakers', { params })
    return response.data.data
  },

  getRecommendations: async (limit = 5): Promise<SearchResponse> => {
    const response = await api.get('/patients/recommendations', { 
      params: { limit } 
    })
    return response.data.data
  },
}
