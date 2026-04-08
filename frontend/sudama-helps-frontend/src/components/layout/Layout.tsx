import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Home, Wrench, Calendar, User, LogOut, Menu, X, Shield, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/services', label: 'Services', icon: Wrench },
    { path: '/bookings', label: 'Bookings', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
  ];

  const providerNavItems = [
    { path: '/provider/dashboard', label: 'My Tasks', icon: CheckSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 md:pb-0">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-xl md:text-2xl font-display font-bold text-primary-600">
                  🏠Sudama
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all',
                    isActive(path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
              {user?.role === UserRole.ADMIN && (
                adminNavItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={clsx(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ml-2',
                      isActive(path)
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-amber-700 hover:text-amber-600 hover:bg-amber-50 border border-amber-200'
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                ))
              )}
              {user?.role === UserRole.SERVICE_PROVIDER && (
                providerNavItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={clsx(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ml-2',
                      isActive(path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-blue-700 hover:text-blue-600 hover:bg-blue-50 border border-blue-200'
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                ))
              )}
            </div>

            {/* Desktop Logout */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName?.split(' ')[0]}</p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all',
                    isActive(path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
              {user?.role === UserRole.ADMIN && (
                <>
                  <hr className="my-2" />
                  {adminNavItems.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={clsx(
                        'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all',
                        isActive(path)
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-amber-700 hover:text-amber-600 hover:bg-amber-50 border border-amber-200'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </>
              )}
              {user?.role === UserRole.SERVICE_PROVIDER && (
                <>
                  <hr className="my-2" />
                  {providerNavItems.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={clsx(
                        'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all',
                        isActive(path)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-blue-700 hover:text-blue-600 hover:bg-blue-50 border border-blue-200'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </>
              )}
              <hr className="my-2" />
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center justify-center py-3 px-2 flex-1 transition-all',
                isActive(path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
