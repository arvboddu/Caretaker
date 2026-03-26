import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Star, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { reviewService } from '../services/review.service'

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  const submitReviewMutation = useMutation({
    mutationFn: () => reviewService.createReview({
      bookingId: id!,
      rating,
      comment
    }),
    onSuccess: () => {
      toast.success('Review submitted successfully!')
      navigate('/bookings')
    },
    onError: () => {
      toast.error('Failed to submit review')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    submitReviewMutation.mutate()
  }

  return (
    <div className="max-w-md mx-auto">
      <Link to={`/bookings/${id}`} className="text-primary hover:underline mb-4 inline-flex items-center gap-1">
        <ArrowLeft size={16} />
        Back to Booking
      </Link>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-navy mb-6">Leave a Review</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              How was your experience?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your review (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="input"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || submitReviewMutation.isPending}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
