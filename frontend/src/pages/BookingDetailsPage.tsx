import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Calendar, Clock, MapPin, MessageSquare, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { bookingService, Booking } from '../services/booking.service'

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBookingById(id!)
  })

  const cancelMutation = useMutation({
    mutationFn: () => bookingService.cancelBooking(id!),
    onSuccess: () => {
      toast.success('Booking cancelled')
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: () => {
      toast.error('Failed to cancel booking')
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="text-green-500" size={20} />
      case 'pending': return <AlertCircle className="text-yellow-500" size={20} />
      case 'cancelled': return <XCircle className="text-red-500" size={20} />
      default: return <Clock className="text-gray-500" size={20} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Booking not found.</p>
        <Link to="/bookings" className="btn-primary mt-4 inline-block">
          Back to Bookings
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/bookings" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Bookings
      </Link>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy">Booking Details</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)}
            {booking.status}
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold">
              {booking.caretaker?.fullName?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-navy">{booking.caretaker?.fullName || 'Caretaker'}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span>rating</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar size={18} />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{format(new Date(booking.date), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={18} />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={18} />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{booking.address || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={18} />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{booking.duration} hours</p>
              </div>
            </div>
          </div>

          <div className="py-4 border-b">
            <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
            <p className="text-gray-600">{booking.serviceNotes || 'No notes added'}</p>
          </div>

          <div className="flex justify-between items-center py-4">
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-2xl font-bold text-primary">${booking.totalAmount}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              to={`/chat?caretaker=${booking.caretakerId}`}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Message
            </Link>
          </div>

          {booking.status === 'pending' || booking.status === 'accepted' ? (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this booking?')) {
                  cancelMutation.mutate()
                }
              }}
              disabled={cancelMutation.isPending}
              className="w-full bg-red-50 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-100 transition mt-3"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          ) : null}

          {booking.status === 'completed' && (
            <Link
              to={`/bookings/${booking.id}/review`}
              className="btn-primary w-full text-center block mt-3"
            >
              Leave a Review
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
