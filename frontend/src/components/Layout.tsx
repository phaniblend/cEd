import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Top Navigation Bar */}
      <nav className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-2xl font-bold text-accent-purple">
                cEd
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link
                  to="/projects"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/projects')
                      ? 'bg-accent-purple text-white'
                      : 'text-gray-300 hover:bg-dark-hover'
                  }`}
                >
                  Projects
                </Link>
                {user?.role === UserRole.LEARNER && (
                  <Link
                    to="/learner/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/learner/dashboard')
                        ? 'bg-accent-purple text-white'
                        : 'text-gray-300 hover:bg-dark-hover'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === UserRole.RECRUITER && (
                  <Link
                    to="/recruiter/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/recruiter/dashboard')
                        ? 'bg-accent-purple text-white'
                        : 'text-gray-300 hover:bg-dark-hover'
                    }`}
                  >
                    Talent Explorer
                  </Link>
                )}
                {user?.role === UserRole.BUYER && (
                  <Link
                    to="/apps"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/apps')
                        ? 'bg-accent-purple text-white'
                        : 'text-gray-300 hover:bg-dark-hover'
                    }`}
                  >
                    App Catalog
                  </Link>
                )}
                {user?.role === UserRole.ADMIN && (
                  <Link
                    to="/admin/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/admin/dashboard')
                        ? 'bg-accent-purple text-white'
                        : 'text-gray-300 hover:bg-dark-hover'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/apps"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/apps')
                      ? 'bg-accent-purple text-white'
                      : 'text-gray-300 hover:bg-dark-hover'
                  }`}
                >
                  Apps
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/auth/login"
                    className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
