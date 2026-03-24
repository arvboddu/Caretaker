import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth.store'

export default function AuthLayout() {
  const { token } = useAuthStore()
  return token ? <Navigate to="/dashboard" /> : <Outlet />
}
