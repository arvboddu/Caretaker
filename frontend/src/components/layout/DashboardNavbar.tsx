import { Link } from 'react-router-dom'
import { Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/auth.store'
import toast from 'react-hot-toast'

export default function DashboardNavbar() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-navy hidden sm:block">CareTaker</span>
          </Link>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate hover:text-primary relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm text-slate hidden sm:block">{user?.fullName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate hover:text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
