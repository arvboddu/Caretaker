import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, MessageSquare, Star, ChevronRight, Search } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'
import api from '../services/api'

interface UpcomingBooking {
  id: string
  date: string
  startTime: string
  caretaker?: { fullName: string; profilePhoto: string }
  status: string
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

  const { data: scheduleData } = useQuery({
    queryKey: ['schedule'],
    queryFn: async () => {
      const response = await api.get('/bookings', { params: { role: 'caretaker', limit: 5 } })
      return response.data.data
    },
    enabled: !isPatient,
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-navy">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-slate mt-1">
          {isPatient ? 'Find the perfect caretaker for your needs' : "Here's your schedule for today"}
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
                {bookingsData.bookings.map((booking: UpcomingBooking) => (
                  <div key={booking.id} className="card flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-navy">{booking.caretaker?.fullName}</div>
                      <div className="text-sm text-slate">
                        {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.startTime}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
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
          {scheduleData?.bookings?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-navy mb-3">Today's Schedule</h2>
              <div className="space-y-3">
                {scheduleData.bookings.map((booking: UpcomingBooking) => (
                  <div key={booking.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-navy">{booking.patient?.fullName}</div>
                      <span className="text-primary font-semibold">${booking.totalAmount}</span>
                    </div>
                    <div className="text-sm text-slate">
                      {booking.startTime} - {booking.endTime} ({booking.duration}h)
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <Link
              to="/caretaker/profile"
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
            <p className="text-sm text-slate">Chat with your caretakers</p>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Link>
      </section>
    </div>
  )
}
