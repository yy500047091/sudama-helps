import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Plus, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AddressSelector, AddressForm } from '@/components/common/AddressSelector';
import { Address } from '@/types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      streetAddress: 'Building A',
      landmark: 'Near City Mall',
    },
    {
      area: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      streetAddress: 'Apartment 42',
      landmark: 'Near Indiranagar Park',
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user) {
        updateUser({
          ...user,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        });
      }

      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = (address: Address) => {
    setAddresses([...addresses, address]);
    setShowAddressForm(false);
    toast.success('Address added successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          My Profile
        </h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="text-white" size={48} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.fullName}</h2>
            <p className="text-sm text-gray-600 mb-4">Customer</p>

            {user?.rating && (
              <div className="flex items-center justify-center gap-1 mb-4 text-sm">
                <span>⭐ {user.rating.toFixed(1)}</span>
                <span className="text-gray-600">
                  ({user.totalReviews || 0} reviews)
                </span>
              </div>
            )}

            {user?.totalCompletedBookings && (
              <div className="text-sm text-gray-600 mb-6">
                <strong>{user.totalCompletedBookings}</strong> bookings completed
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Profile & Address Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-primary-600 hover:text-primary-700 flex items-center gap-2 font-medium text-sm"
              >
                {isEditingProfile ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    Edit
                  </>
                )}
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{user?.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {user?.email}
                      {user?.emailVerified && (
                        <span className="ml-2 text-xs text-green-600">✓ Verified</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {user?.phoneNumber}
                      {user?.phoneVerified && (
                        <span className="ml-2 text-xs text-green-600">✓ Verified</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={20} />
                Saved Addresses
              </h3>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-2 font-medium text-sm"
                >
                  <Plus size={16} />
                  Add New
                </button>
              )}
            </div>

            {showAddressForm ? (
              <AddressForm
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddressForm(false)}
              />
            ) : (
              <AddressSelector
                addresses={addresses}
                onSelect={() => {}}
              />
            )}
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span className="text-gray-700 font-medium">Change Password</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span className="text-gray-700 font-medium">Notification Preferences</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span className="text-gray-700 font-medium">Payment Methods</span>
                <span className="text-gray-400">→</span>
              </button>

              <button className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between border-t">
                <span className="text-red-600 font-medium">Delete Account</span>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
