import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/auth.store'
import { useSocketStore } from './stores/socket.store'
import PublicLayout from './components/layout/PublicLayout'
import AuthLayout from './components/layout/AuthLayout'
import ProtectedLayout from './components/layout/ProtectedLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import CaretakerProfilePage from './pages/CaretakerProfilePage'
import CaretakerProfileEditPage from './pages/CaretakerProfileEditPage'
import BookingPage from './pages/BookingPage'
import BookingsPage from './pages/BookingsPage'
import BookingDetailsPage from './pages/BookingDetailsPage'
import ReviewPage from './pages/ReviewPage'
import ChatPage from './pages/ChatPage'
import SearchPage from './pages/SearchPage'
import PatientProfilePage from './pages/PatientProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { user, token } = useAuthStore()
  const { connect, disconnect } = useSocketStore()

  useEffect(() => {
    if (token) {
      connect(token)
    } else {
      disconnect()
    }
    return () => disconnect()
  }, [token, connect, disconnect])

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={!token ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={!token ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/caretaker/:id" element={<CaretakerProfilePage />} />
          <Route path="/caretaker-edit" element={<CaretakerProfileEditPage />} />
          <Route path="/patient-profile" element={<PatientProfilePage />} />
          <Route path="/book/:caretakerId" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/bookings/:id/review" element={<ReviewPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:threadId" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
