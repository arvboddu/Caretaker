import { Link } from 'react-router-dom'
import { Heart, Shield, Clock, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Care, Delivered to Your Door
            </h1>
            <p className="text-xl text-primary-light mb-8">
              Connect directly with verified, trusted caretakers. No middlemen,
              no markups—just quality care when you need it most.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Find a Caretaker
              </Link>
              <Link to="/register?role=caretaker" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Become a Caretaker
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-navy mb-12">
            Why Choose CareTaker?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">Trusted Care</h3>
              <p className="text-slate text-sm">
                Every caretaker is verified, background-checked, and certified.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">No Middlemen</h3>
              <p className="text-slate text-sm">
                Connect directly with caretakers at fair, transparent prices.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">Flexible Scheduling</h3>
              <p className="text-slate text-sm">
                Book hourly, daily, or weekly. Change plans anytime.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">Direct Chat</h3>
              <p className="text-slate text-sm">
                Message your caretaker anytime. No need to go through intermediaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">Choose How You Want to Join</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2 text-center">I Need Care</h3>
              <p className="text-slate mb-6 text-center">
                Find verified caretakers for yourself or your loved ones. Book appointments directly.
              </p>
              <Link to="/register" className="btn-primary w-full text-center block">
                Find a Caretaker
              </Link>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2 text-center">I'm a Caretaker</h3>
              <p className="text-slate mb-6 text-center">
                Share your care skills, set your own rates, and build your client base.
              </p>
              <Link to="/register?role=caretaker" className="btn-secondary w-full text-center block">
                Become a Caretaker
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
