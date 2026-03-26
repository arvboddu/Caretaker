import { NavLink } from 'react-router-dom'
import { Home, Calendar, MessageSquare, Star, User } from 'lucide-react'
import clsx from 'clsx'

interface BottomNavProps {
  userRole: 'patient' | 'caretaker' | 'admin'
}

const patientNavItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/reviews', icon: Star, label: 'Reviews' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const caretakerNavItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/earnings', icon: Star, label: 'Earnings' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav({ userRole }: BottomNavProps) {
  const navItems = userRole === 'caretaker' ? caretakerNavItems : patientNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center py-2 px-3 text-xs',
                isActive ? 'text-primary' : 'text-gray-400'
              )
            }
          >
            <item.icon size={20} />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
