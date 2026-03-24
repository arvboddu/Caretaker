import api from './api'

export interface Review {
  id: string
  rating: number
  comment: string
  patient: {
    id: string
    fullName: string
    profilePhoto?: string
  }
  createdAt: string
}

export interface CreateReviewPayload {
  bookingId: string
  rating: number
  comment: string
}

export interface ReviewsResponse {
  reviews: Review[]
  averageRating: number
  total: number
  limit: number
  offset: number
}

export const reviewService = {
  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const response = await api.post('/reviews', payload)
    return response.data.data
  },

  getCaretakerReviews: async (
    caretakerId: string, 
    limit = 10, 
    offset = 0
  ): Promise<ReviewsResponse> => {
    const response = await api.get(`/reviews/caretaker/${caretakerId}`, {
      params: { limit, offset }
    })
    return response.data.data
  },
}
