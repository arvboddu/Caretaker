import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authService } from '../../services/auth.service'
import { useAuthStore } from '../../stores/auth.store'
import { User, Heart, Shield, Clock, DollarSign, Star, ArrowRight, Check } from 'lucide-react'
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

const caretakerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number is required'),
  role: z.enum(['patient', 'caretaker']),
  bio: z.string().min(20, 'Please tell us about yourself (min 20 characters)'),
  hourlyRate: z.coerce.number().min(5, 'Minimum rate is $5/hour'),
  yearsExperience: z.coerce.number().min(0, 'Years of experience required'),
})

type RegisterForm = z.infer<typeof registerSchema>
type CaretakerForm = z.infer<typeof caretakerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const defaultRole = (searchParams.get('role') as 'patient' | 'caretaker') || 'patient'

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm | CaretakerForm>({
    resolver: zodResolver(defaultRole === 'caretaker' ? caretakerSchema : registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterForm | CaretakerForm) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      setAuth(response.data.user, response.data.token)
      
      if (data.role === 'caretaker') {
        toast.success('Welcome! Complete your profile to start receiving bookings.')
      } else {
        toast.success('Account created successfully!')
      }
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-white">CareTaker</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          {selectedRole === 'patient' ? (
            <>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Find the Perfect<br />Caretaker for Your Loved One
              </h1>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-white/90">
                  <Shield className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Verified Caretakers</div>
                    <div className="text-sm text-white/70">All caretakers are background-checked and certified</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Flexible Scheduling</div>
                    <div className="text-sm text-white/70">Book hourly, daily, or weekly based on your needs</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <Heart className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Quality Care</div>
                    <div className="text-sm text-white/70">Direct communication with vetted caretakers</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Earn Money Sharing<br />Your Care Skills
              </h1>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-white/90">
                  <DollarSign className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Set Your Own Rates</div>
                    <div className="text-sm text-white/70">You decide how much you earn per hour</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Flexible Schedule</div>
                    <div className="text-sm text-white/70">Work when it suits you</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <Star className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Build Your Reputation</div>
                    <div className="text-sm text-white/70">Earn reviews and grow your client base</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-white/60 text-sm relative z-10">
          Join thousands of families and caretakers
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-navy">CareTaker</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-navy">
              {selectedRole === 'patient' ? 'Find Your Perfect Caretaker' : 'Become a Caretaker'}
            </h1>
            <p className="text-slate mt-2">
              {selectedRole === 'patient' 
                ? 'Create an account to book caretakers' 
                : 'Share your skills and earn money'}
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => register('role').onChange({ target: { value: 'patient' } })}
              className={clsx(
                'flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2',
                selectedRole === 'patient'
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-gray-200 hover:border-primary/50 text-gray-600'
              )}
            >
              <Heart size={18} />
              <span className="font-medium">Find Care</span>
            </button>
            <button
              type="button"
              onClick={() => register('role').onChange({ target: { value: 'caretaker' } })}
              className={clsx(
                'flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2',
                selectedRole === 'caretaker'
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-gray-200 hover:border-primary/50 text-gray-600'
              )}
            >
              <User size={18} />
              <span className="font-medium">Give Care</span>
            </button>
          </div>
          <input type="hidden" {...register('role')} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">Full Name</label>
              <input
                {...register('fullName')}
                type="text"
                className="input"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message as string}</p>
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
                <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
              )}
            </div>

            {selectedRole === 'caretaker' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">Phone Number</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">Hourly Rate ($)</label>
                    <input
                      {...register('hourlyRate')}
                      type="number"
                      className="input"
                      placeholder="25"
                      min="5"
                    />
                    {errors.hourlyRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.hourlyRate.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">Experience (years)</label>
                    <input
                      {...register('yearsExperience')}
                      type="number"
                      className="input"
                      placeholder="2"
                      min="0"
                    />
                    {errors.yearsExperience && (
                      <p className="text-red-500 text-sm mt-1">{errors.yearsExperience.message as string}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate mb-1">About You</label>
                  <textarea
                    {...register('bio')}
                    className="input"
                    rows={3}
                    placeholder="Tell patients about your experience and skills..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio.message as string}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className="input"
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLoading ? 'Creating account...' : (
                <>
                  {selectedRole === 'patient' ? 'Find Caretakers' : 'Start Earning'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate mt-6 text-sm">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
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
    </div>
  )
}
