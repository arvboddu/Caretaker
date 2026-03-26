import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import toast from 'react-hot-toast'
import { User, Bell, Shield, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    bookings: true,
    messages: true
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
    toast.success('Settings updated')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-navy">Account</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Name</span>
              <span className="font-medium">{user?.name || 'User'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{user?.email || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Role</span>
              <span className="font-medium capitalize">{user?.role || 'Patient'}</span>
            </div>
          </div>
          <button className="btn-secondary w-full mt-4">
            Change Password
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-navy">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">Email notifications</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="w-5 h-5 text-primary rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">SMS notifications</span>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
                className="w-5 h-5 text-primary rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">Booking updates</span>
              <input
                type="checkbox"
                checked={notifications.bookings}
                onChange={() => handleNotificationChange('bookings')}
                className="w-5 h-5 text-primary rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">Message notifications</span>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={() => handleNotificationChange('messages')}
                className="w-5 h-5 text-primary rounded"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-navy">Privacy</h2>
          </div>
          <button className="btn-secondary w-full mb-3">
            Privacy Policy
          </button>
          <button className="btn-secondary w-full mb-3">
            Terms of Service
          </button>
          <button className="btn-secondary w-full">
            Delete Account
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-100 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  )
}
