import { Star, Clock } from 'lucide-react';
import { Service } from '@/types';
import { clsx } from 'clsx';

interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: number) => void;
  isLoading?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">{service.category === 'CLEANING' ? '🧹' : '🔧'}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{service.name}</h3>
          {service.isPopular && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
              Popular
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {service.description}
        </p>

        {/* Rating */}
        {service.averageRating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={clsx(
                    i < Math.round(service.averageRating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {service.averageRating.toFixed(1)} ({service.totalBookings})
            </span>
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{service.durationMinutes} min</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ₹{service.basePrice}
            </span>
            <p className="text-xs text-gray-500">Starting price</p>
          </div>
          <button
            onClick={() => onBook(service.id)}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
