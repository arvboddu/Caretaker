import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, MessageSquare, Star, ChevronRight, Search, Check, X } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'
import api from '../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  totalAmount: number
  status: string
  patient?: { fullName: string; profilePhoto: string }
  caretaker?: { fullName: string; profilePhoto: string }
}

interface RecommendedCaretaker {
  id: string
  fullName: string
  photo: string
  rating: number
  hourlyRate: number
  skills: string[]
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isPatient = user?.role === 'patient'

  const { data: bookingsData } = useQuery({
    queryKey: ['bookings', 'upcoming'],
    queryFn: async () => {
      const response = await api.get('/bookings', { params: { limit: 5 } })
      return response.data.data
    },
    enabled: isPatient,
  })

  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await api.get('/patients/recommendations', { params: { limit: 5 } })
      return response.data.data
    },
    enabled: isPatient,
  })

  const { data: caretakerBookingsData } = useQuery({
    queryKey: ['caretaker-bookings'],
    queryFn: async () => {
      const response = await api.get('/bookings', { params: { role: 'caretaker', limit: 10 } })
      return response.data.data
    },
    enabled: !isPatient,
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/bookings/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      toast.success('Booking updated')
      queryClient.invalidateQueries({ queryKey: ['caretaker-bookings'] })
    },
    onError: () => {
      toast.error('Failed to update booking')
    },
  })

  const handleAccept = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'accepted' })
  }

  const handleDecline = (id: string) => {
    if (window.confirm('Are you sure you want to decline this booking?')) {
      updateStatusMutation.mutate({ id, status: 'declined' })
    }
  }

  const pendingBookings = caretakerBookingsData?.bookings?.filter(
    (b: Booking) => b.status === 'pending'
  ) || []

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-navy">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-slate mt-1">
          {isPatient ? 'Find the perfect caretaker for your needs' : "Here's your schedule"}
        </p>
      </div>

      {isPatient ? (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Link
              to="/search"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Search className="text-slate" size={20} />
              <span className="text-slate">Search caretakers...</span>
            </Link>
          </div>

          {bookingsData?.bookings?.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-navy">Upcoming Bookings</h2>
                <Link to="/bookings" className="text-primary text-sm font-medium flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {bookingsData.bookings.map((booking: Booking) => (
                  <Link
                    key={booking.id}
                    to={`/bookings/${booking.id}`}
                    className="card flex items-center gap-4 hover:shadow-md transition"
                  >
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-navy">{booking.caretaker?.fullName}</div>
                      <div className="text-sm text-slate">
                        {format(new Date(booking.date), 'MMM d, yyyy')} at {booking.startTime}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'confirmed' || booking.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'declined' || booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {recommendationsData?.caretakers?.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-navy">Recommended for You</h2>
              </div>
              <div className="space-y-3">
                {recommendationsData.caretakers.map((caretaker: RecommendedCaretaker) => (
                  <Link
                    key={caretaker.id}
                    to={`/caretaker/${caretaker.id}`}
                    className="card flex items-center gap-4 hover:shadow-md transition"
                  >
                    <img
                      src={caretaker.photo || 'https://via.placeholder.com/64'}
                      alt={caretaker.fullName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-navy">{caretaker.fullName}</div>
                      <div className="flex items-center gap-2 text-sm text-slate">
                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                        {caretaker.rating} • ${caretaker.hourlyRate}/hr
                      </div>
                      <div className="text-xs text-slate mt-1">
                        {caretaker.skills?.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          {pendingBookings.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-navy mb-3">Pending Requests</h2>
              <div className="space-y-3">
                {pendingBookings.map((booking: Booking) => (
                  <div key={booking.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-navy">{booking.patient?.fullName}</div>
                        <div className="text-sm text-slate">
                          {format(new Date(booking.date), 'MMM d, yyyy')} at {booking.startTime}
                        </div>
                        <div className="text-sm text-slate">
                          Duration: {booking.duration}h • ${booking.totalAmount}
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Check size={18} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(booking.id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <X size={18} />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {caretakerBookingsData?.bookings?.filter((b: Booking) => b.status !== 'pending').length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-navy">Your Bookings</h2>
                <Link to="/bookings" className="text-primary text-sm font-medium flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {caretakerBookingsData.bookings
                  .filter((b: Booking) => b.status !== 'pending')
                  .slice(0, 5)
                  .map((booking: Booking) => (
                    <Link
                      key={booking.id}
                      to={`/bookings/${booking.id}`}
                      className="card flex items-center gap-4 hover:shadow-md transition"
                    >
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                        <Calendar className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-navy">{booking.patient?.fullName}</div>
                        <div className="text-sm text-slate">
                          {format(new Date(booking.date), 'MMM d, yyyy')} at {booking.startTime}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.status === 'accepted' || booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </Link>
                  ))}
              </div>
            </section>
          )}

          <section>
            <Link
              to="/caretaker-edit"
              className="card flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <h3 className="font-medium text-navy">Manage Your Profile</h3>
                <p className="text-sm text-slate">Update availability, pricing, and skills</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
          </section>
        </>
      )}

      <section>
        <Link
          to="/chat"
          className="card flex items-center gap-4 hover:shadow-md transition"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <MessageSquare className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-navy">Messages</h3>
            <p className="text-sm text-slate">Chat with your {isPatient ? 'caretakers' : 'patients'}</p>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Link>
      </section>
    </div>
  )
}
