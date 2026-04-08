import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  count?: number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  count = 1, 
  circle = false 
}) => {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={clsx(
            'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse',
            circle ? 'rounded-full' : 'rounded-lg',
            className
          )}
        />
      ))}
    </>
  );
};

export const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <Skeleton className="w-full h-48 mb-4 rounded-lg" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const BookingCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <Skeleton className="h-6 w-1/2 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-3" />
    <Skeleton className="h-10 w-24" />
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <Skeleton className="h-4 w-1/3 mb-3" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);
