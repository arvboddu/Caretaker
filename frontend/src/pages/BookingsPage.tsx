import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { bookingService, Booking } from '../services/booking.service'
import { format } from 'date-fns'

export default function BookingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getBookings
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={20} />
      case 'pending':
        return <AlertCircle className="text-yellow-500" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Clock className="text-gray-500" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading bookings. Please try again.</p>
      </div>
    )
  }

  const bookings: Booking[] = data || []

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-navy mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-6">Find a caretaker and book your first appointment.</p>
          <Link to="/search" className="btn-primary">
            Find a Caretaker
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: Booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                    {booking.caretaker?.fullName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{booking.caretaker?.fullName || 'Caretaker'}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.startTime}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.duration} hours · ${booking.totalAmount}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </span>
              </div>
              
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <Link
                  to={`/bookings/${booking.id}`}
                  className="btn-secondary text-sm py-2"
                >
                  View Details
                </Link>
                {booking.status === 'completed' && !booking.reviewed && (
                  <Link
                    to={`/bookings/${booking.id}/review`}
                    className="btn-primary text-sm py-2"
                  >
                    Leave Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
