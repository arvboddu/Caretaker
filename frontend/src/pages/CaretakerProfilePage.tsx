import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, MapPin, Clock, MessageSquare, Calendar } from 'lucide-react'
import { caretakerService } from '../services/caretaker.service'
import { useAuthStore } from '../stores/auth.store'
import toast from 'react-hot-toast'

export default function CaretakerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isPatient = user?.role === 'patient'

  const { data, isLoading, error } = useQuery({
    queryKey: ['caretaker', id],
    queryFn: () => caretakerService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate">Caretaker not found</p>
      </div>
    )
  }

  const caretaker = data.data

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary to-primary-dark" />
        <div className="px-4 -mt-12">
          <img
            src={caretaker.profilePhoto || 'https://via.placeholder.com/96'}
            alt={caretaker.fullName}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-navy">{caretaker.fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(caretaker.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-slate">({caretaker.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">${caretaker.hourlyRate}</div>
            <div className="text-sm text-slate">per hour</div>
          </div>
          <div className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{caretaker.yearsExperience}</div>
            <div className="text-sm text-slate">years experience</div>
          </div>
        </div>

        {isPatient && (
          <div className="flex gap-3">
            <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              Message
            </button>
            <button
              onClick={() => navigate(`/book/${id}`)}
              className="btn-primary flex-1"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-navy mb-3">About</h2>
        <p className="text-slate leading-relaxed">{caretaker.bio || 'No bio available'}</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-navy mb-3">Skills & Certifications</h2>
        <div className="flex flex-wrap gap-2">
          {caretaker.skills?.map((skill: string) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium"
            >
              {skill.replace('_', ' ')}
            </span>
          ))}
          {caretaker.certifications?.map((cert: any) => (
            <span
              key={cert.id}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
            >
              {cert.name}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-navy mb-3">Availability</h2>
        <div className="space-y-2">
          {Object.entries(caretaker.availability || {}).map(([day, hours]) => (
            <div key={day} className="flex justify-between text-sm">
              <span className="text-slate capitalize">{day}</span>
              <span className={hours ? 'text-navy' : 'text-gray-400'}>
                {hours ? `${hours.start} - ${hours.end}` : 'Not available'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-navy mb-3">Reviews</h2>
        {caretaker.reviews?.length > 0 ? (
          <div className="space-y-4">
            {caretaker.reviews.slice(0, 5).map((review: any) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate">{review.patientName}</span>
                </div>
                <p className="text-sm text-slate">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate text-sm">No reviews yet</p>
        )}
      </div>
    </div>
  )
}
