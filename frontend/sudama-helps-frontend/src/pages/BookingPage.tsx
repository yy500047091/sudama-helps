import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DateTimePicker } from '@/components/common/DateTimePicker';
import { AddressSelector } from '@/components/common/AddressSelector';
import { Service, Address } from '@/types';
import { motion } from 'framer-motion';

// Mock service data
const MOCK_SERVICES: Record<string, Service> = {
  '1': {
    id: 1,
    name: 'Professional Home Cleaning',
    description: 'Thorough cleaning of your entire home with eco-friendly products',
    category: 'CLEANING' as any,
    basePrice: 500,
    durationMinutes: 120,
    status: 'ACTIVE',
    totalBookings: 1250,
    averageRating: 4.8,
    isPopular: true,
    displayOrder: 1,
  },
  '2': {
    id: 2,
    name: 'Emergency Plumbing',
    description: 'Fix leaks, unclog pipes, and repair bathroom fixtures',
    category: 'PLUMBING' as any,
    basePrice: 800,
    durationMinutes: 60,
    status: 'ACTIVE',
    totalBookings: 890,
    averageRating: 4.6,
    isPopular: true,
    displayOrder: 2,
  },
};

export default function BookingPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = serviceId ? MOCK_SERVICES[serviceId] : null;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: DateTime, 2: Address, 3: Review
  const [dateTime, setDateTime] = useState<{ date: Date; time: string } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      streetAddress: 'Building A',
      landmark: 'Near City Mall',
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0] || null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          Back to Services
        </button>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Service not found</p>
        </div>
      </div>
    );
  }

  const handleAddAddress = (address: Address) => {
    setAddresses([...addresses, address]);
    setSelectedAddress(address);
  };

  const handleSubmitBooking = async () => {
    if (!dateTime || !selectedAddress) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Booking confirmed! Check your bookings for details.');
      navigate('/bookings');
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = service.basePrice;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Services
        </button>
        <h1 className="text-3xl font-display font-bold text-gray-900">{service.name}</h1>
        <p className="text-gray-600 mt-2">{service.description}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {/* Stepper */}
          <div className="flex gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-8 h-1 transition-all ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Date & Time</h2>
              <DateTimePicker value={dateTime || undefined} onChange={setDateTime} />

              <button
                disabled={!dateTime}
                onClick={() => setStep(2)}
                className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Address
              </button>
            </motion.div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Location</h2>

              <AddressSelector
                addresses={addresses}
                selectedAddress={selectedAddress || undefined}
                onSelect={setSelectedAddress}
                onAddNew={() => {
                  // Open add address form
                  // Mock addition for now
                  handleAddAddress({
                    area: 'New Area',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '000000',
                  });
                }}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={!selectedAddress}
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Booking
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Special Instructions */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Confirm</h2>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold text-gray-900">{service.name}</span>
                  </div>
                  {dateTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-semibold text-gray-900">
                        {dateTime.date.toLocaleDateString()} at {dateTime.time}
                      </span>
                    </div>
                  )}
                  {selectedAddress && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-semibold text-gray-900">
                        {selectedAddress.area}, {selectedAddress.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Tell the professional about any specific requirements or preferences..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={4}
                />
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={loading}
                  onClick={handleSubmitBooking}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar: Price Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-gray-600">
                <span>Service Price</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax & Charges (10%)</span>
                <span>₹{tax}</span>
              </div>
              {/* Discount can be added here */}
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total Amount</span>
              <span className="text-primary-600">₹{total}</span>
            </div>

            {/* Service Info Card */}
            <div className="bg-primary-50 rounded-lg p-4 text-sm text-primary-800 space-y-2">
              <p className="font-semibold">ℹ️ Booking Info</p>
              <ul className="space-y-1 text-xs">
                <li>✓ Duration: {service.durationMinutes} mins</li>
                <li>✓ Verified Professional</li>
                <li>✓ Money-back guarantee</li>
                <li>✓ Free cancellation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
