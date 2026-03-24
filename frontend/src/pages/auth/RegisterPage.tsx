import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authService } from '../../services/auth.service'
import { useAuthStore } from '../../stores/auth.store'
import { User, Heart } from 'lucide-react'
import clsx from 'clsx'

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['patient', 'caretaker']),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: (searchParams.get('role') as 'patient' | 'caretaker') || 'patient',
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      setAuth(response.data.user, response.data.token)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-navy">CareTaker</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Create Your Account</h1>
          <p className="text-slate mt-2">Join CareTaker today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => register('role').onChange({ target: { value: 'patient' } })}
              className={clsx(
                'p-4 rounded-xl border-2 transition-all text-left',
                selectedRole === 'patient'
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-200 hover:border-primary/50'
              )}
            >
              <Heart className={clsx('mb-2', selectedRole === 'patient' ? 'text-primary' : 'text-gray-400')} size={24} />
              <div className="font-semibold text-navy">I Need Care</div>
              <div className="text-sm text-slate">Find a caretaker</div>
            </button>
            <button
              type="button"
              onClick={() => register('role').onChange({ target: { value: 'caretaker' } })}
              className={clsx(
                'p-4 rounded-xl border-2 transition-all text-left',
                selectedRole === 'caretaker'
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-200 hover:border-primary/50'
              )}
            >
              <User className={clsx('mb-2', selectedRole === 'caretaker' ? 'text-primary' : 'text-gray-400')} size={24} />
              <div className="font-semibold text-navy">I'm a Caretaker</div>
              <div className="text-sm text-slate">Offer services</div>
            </button>
          </div>
          <input type="hidden" {...register('role')} />

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Full Name</label>
            <input
              {...register('fullName')}
              type="text"
              className="input"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="input"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="input"
              placeholder="Create a strong password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate mt-6 text-sm">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>

        <p className="text-center text-slate mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
