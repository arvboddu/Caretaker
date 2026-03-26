import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { User, Phone, MapPin, Heart, FileText } from 'lucide-react'
import { patientService, PatientProfile, UpdatePatientPayload } from '../services/patient.service'

export default function PatientProfilePage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdatePatientPayload>({})

  const { data: profile, isLoading } = useQuery({
    queryKey: ['patientProfile'],
    queryFn: patientService.getProfile
  })

  const updateMutation = useMutation({
    mutationFn: patientService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['patientProfile'] })
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
                  profile.fullName?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-navy">{profile.fullName}</h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={14} className="inline mr-1" /> Phone
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone ?? profile.phone ?? ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin size={14} className="inline mr-1" /> Address
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.address ?? profile.address ?? ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Heart size={14} className="inline mr-1" /> Medical Conditions
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Comma separated"
                    value={formData.medicalConditions?.join(', ') ?? profile.medicalConditions?.join(', ') ?? ''}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText size={14} className="inline mr-1" /> Care Preferences
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.carePreferences ?? profile.carePreferences ?? ''}
                    onChange={(e) => setFormData({ ...formData, carePreferences: e.target.value })}
                  />
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
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} />
                  <span>{profile.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} />
                  <span>{profile.address || 'Not set'}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Medical Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalConditions?.length ? (
                      profile.medicalConditions.map((condition, i) => (
                        <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Care Preferences</h3>
                  <p className="text-gray-600">{profile.carePreferences || 'None specified'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Emergency Contact</h3>
                  <p className="text-gray-600">{profile.emergencyContact || 'Not set'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
