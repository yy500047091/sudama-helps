import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Your Trusted{' '}
            <span className="text-primary-600">Home Services</span>
            <br />
            Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book professional home services with just a few clicks. From cleaning to repairs,
            we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-soft">
            <CheckCircle className="text-green-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">
              All service providers are verified and rated by customers
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-soft">
            <CheckCircle className="text-green-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
            <p className="text-gray-600">
              Book services instantly with real-time availability
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-soft">
            <CheckCircle className="text-green-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">
              Multiple payment options with secure transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
