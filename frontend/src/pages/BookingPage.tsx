import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { bookingService } from '../services/booking.service'
import toast from 'react-hot-toast'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

const bookingSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time'),
  duration: z.number().min(1).max(12),
  serviceNotes: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  specialInstructions: z.string().optional(),
})

type BookingForm = z.infer<typeof bookingSchema>

export default function BookingPage() {
  const { caretakerId } = useParams<{ caretakerId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [duration, setDuration] = useState(2)
  const [step, setStep] = useState(1)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const { data: availabilityData } = useQuery({
    queryKey: ['availability', caretakerId, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => {
      const from = format(selectedDate, 'yyyy-MM-dd')
      const to = format(addDays(selectedDate, 6), 'yyyy-MM-dd')
      return bookingService.getAvailability(caretakerId!, from, to)
    },
    enabled: !!caretakerId,
  })

  const bookingMutation = useMutation({
    mutationFn: (data: BookingForm) => bookingService.create({
      caretakerId: caretakerId!,
      ...data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking request sent!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Booking failed')
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { duration: 2 },
  })

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const onSubmit = (data: BookingForm) => {
    setValue('date', format(selectedDate, 'yyyy-MM-dd'))
    setValue('startTime', selectedTime!)
    setValue('duration', duration)
    bookingMutation.mutate(data)
  }

  const handleNext = () => {
    if (!selectedTime) {
      toast.error('Please select a time slot')
      return
    }
    setStep(2)
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy">Book Appointment</h1>
        <span className="text-sm text-slate">Step {step} of 2</span>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex gap-1 mb-4">
          <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
                <ChevronLeft className="text-slate" />
              </button>
              <span className="font-semibold text-navy">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </span>
              <button onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
                <ChevronRight className="text-slate" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => {
                    setSelectedDate(day)
                    setSelectedTime(null)
                  }}
                  className={`p-2 text-center rounded-lg transition ${
                    isSameDay(day, selectedDate)
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs text-slate">{format(day, 'EEE')}</div>
                  <div className="font-semibold">{format(day, 'd')}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <h3 className="font-semibold text-navy mb-3">Select Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    selectedTime === time
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-slate hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <h3 className="font-semibold text-navy mb-3">Duration</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 6, 8].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setDuration(hours)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    duration === hours
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-slate hover:bg-gray-200'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleNext} className="btn-primary w-full">
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-navy mb-3">Service Details</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate mb-1">Address</label>
              <input
                {...register('address')}
                type="text"
                className="input"
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate mb-1">Service Notes</label>
              <textarea
                {...register('serviceNotes')}
                className="input min-h-[100px]"
                placeholder="Describe what you need help with..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">Special Instructions</label>
              <input
                {...register('specialInstructions')}
                type="text"
                className="input"
                placeholder="Any special instructions..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-navy mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate">Date</span>
                <span className="text-navy">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Time</span>
                <span className="text-navy">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Duration</span>
                <span className="text-navy">{duration} hours</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Estimated Total</span>
                <span className="text-primary">${25 * duration}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
              Back
            </button>
            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="btn-primary flex-1"
            >
              {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
