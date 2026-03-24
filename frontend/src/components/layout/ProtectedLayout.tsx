import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth.store'
import DashboardNavbar from './DashboardNavbar'
import BottomNav from './BottomNav'

export default function ProtectedLayout() {
  const { token, user } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 py-4">
        <Outlet />
      </main>
      <BottomNav userRole={user?.role || 'patient'} />
    </div>
  )
}
