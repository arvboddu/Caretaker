import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { DollarSign, Clock, MapPin, FileText, Briefcase } from 'lucide-react'
import { caretakerService, Caretaker } from '../services/caretaker.service'

const SKILLS = [
  { id: 'elderly-care', name: 'Elderly Care' },
  { id: 'medical', name: 'Medical Care' },
  { id: 'post-surgery', name: 'Post Surgery' },
  { id: 'companionship', name: 'Companionship' },
  { id: 'physical-therapy', name: 'Physical Therapy' },
  { id: 'dementia-care', name: 'Dementia Care' },
  { id: 'palliative', name: 'Palliative Care' },
  { id: 'child-care', name: 'Child Care' }
]

export default function CaretakerProfileEditPage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Caretaker>>({})

  const { data: profile, isLoading } = useQuery({
    queryKey: ['caretakerProfile'],
    queryFn: caretakerService.getProfile
  })

  const updateMutation = useMutation({
    mutationFn: caretakerService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['caretakerProfile'] })
    },
    onError: () => {
      toast.error('Failed to update profile')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {profile && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={profile.fullName} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  profile.fullName?.charAt(0) || 'C'
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy">{profile.fullName}</h2>
                <p className="text-gray-500">{profile.email}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
                  profile.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile.status || 'pending'}
                </span>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText size={14} className="inline mr-1" /> Bio
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    value={formData.bio ?? profile.bio ?? ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell patients about your experience..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Briefcase size={14} className="inline mr-1" /> Years of Experience
                    </label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      value={formData.yearsExperience ?? profile.yearsExperience ?? ''}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin size={14} className="inline mr-1" /> Service Radius (miles)
                    </label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      value={formData.serviceRadius ?? ''}
                      onChange={(e) => setFormData({ ...formData, serviceRadius: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign size={14} className="inline mr-1" /> Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      value={formData.hourlyRate ?? profile.hourlyRate ?? ''}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign size={14} className="inline mr-1" /> Daily Rate ($)
                    </label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      value={formData.dailyRate ?? profile.dailyRate ?? ''}
                      onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">About</h3>
                  <p className="text-gray-600">{profile.bio || 'No bio added yet'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Experience</h3>
                    <p className="text-gray-600">{profile.yearsExperience || 0} years</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Service Area</h3>
                    <p className="text-gray-600">{profile.serviceRadius || 0} miles</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Hourly Rate</h3>
                    <p className="text-primary font-semibold">${profile.hourlyRate || 0}/hr</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Daily Rate</h3>
                    <p className="text-primary font-semibold">${profile.dailyRate || 0}/day</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.length ? (
                      profile.skills.map((skill, i) => (
                        <span key={i} className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm">
                          {typeof skill === 'string' ? skill : skill.name || skill.slug}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No skills added</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Availability</h3>
                  <div className="space-y-2">
                    {profile.availability && Object.entries(profile.availability).map(([day, time]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize text-gray-600">{day}</span>
                        <span className="text-gray-900">
                          {time ? `${time.start} - ${time.end}` : 'Not available'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Rating</h3>
                  <p className="text-gray-600">
                    {profile.rating?.toFixed(1) || '0.0'} ({profile.reviewCount || 0} reviews)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
