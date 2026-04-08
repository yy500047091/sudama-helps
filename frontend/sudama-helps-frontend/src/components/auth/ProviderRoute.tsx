import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@/types';

interface ProviderRouteProps {
  children: React.ReactNode;
}

export const ProviderRoute: React.FC<ProviderRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== UserRole.SERVICE_PROVIDER) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
