import { MapPin, Plus, Edit2 } from 'lucide-react';
import { Address } from '@/types';
import { clsx } from 'clsx';
import { useState } from 'react';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress?: Address;
  onSelect: (address: Address) => void;
  onAddNew?: () => void;
  onEdit?: (address: Address) => void;
}

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  onCancel: () => void;
  initialAddress?: Address;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddress,
  onSelect,
  onAddNew,
  onEdit,
}) => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <AddressForm onSubmit={(addr) => { onSelect(addr); setShowForm(false); }} onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin size={16} className="inline mr-2" />
          Service Address
        </label>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            Add New
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-2">No saved addresses</p>
          {onAddNew && (
            <button
              onClick={() => setShowForm(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Add your first address
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(addr)}
              className={clsx(
                'p-3 border-2 rounded-lg cursor-pointer transition-all',
                selectedAddress === addr
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {addr.area}, {addr.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.streetAddress && `${addr.streetAddress}, `}
                    {addr.state} {addr.pincode}
                  </p>
                  {addr.landmark && <p className="text-xs text-gray-500">Near: {addr.landmark}</p>}
                </div>
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(addr);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onCancel, initialAddress }) => {
  const [formData, setFormData] = useState<Address>(
    initialAddress || {
      streetAddress: '',
      area: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '',
      landmark: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.area && formData.pincode) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900">Add Service Address</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress || ''}
          onChange={handleChange}
          placeholder="House no, building name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Area/Locality *</label>
        <input
          type="text"
          name="area"
          value={formData.area || ''}
          onChange={handleChange}
          placeholder="e.g., Koramangala"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode || ''}
            onChange={handleChange}
            placeholder="e.g., 560034"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark || ''}
          onChange={handleChange}
          placeholder="e.g., Near City Mall"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
