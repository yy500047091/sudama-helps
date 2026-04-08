import { AlertCircle, Package, Calendar, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'error' | 'empty' | 'no-results';
}

const defaultIcons = {
  error: <AlertCircle className="text-red-500" size={48} />,
  empty: <Package className="text-gray-400" size={48} />,
  'no-results': <Search className="text-gray-400" size={48} />,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  type = 'empty',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">
        {icon || defaultIcons[type]}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const NoBookingsState = ({ onBookNow }: { onBookNow: () => void }) => (
  <EmptyState
    icon={<Calendar className="text-blue-500" size={48} />}
    title="No Bookings Yet"
    description="Start by booking a service. Browse our services and schedule a professional today!"
    actionLabel="Browse Services"
    onAction={onBookNow}
    type="empty"
  />
);

export const NoServicesState = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    icon={<Package className="text-gray-400" size={48} />}
    title="No Services Available"
    description="Services are currently unavailable. Please try again later."
    actionLabel="Retry"
    onAction={onRetry}
    type="error"
  />
);
