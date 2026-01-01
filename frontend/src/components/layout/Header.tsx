import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Leaf, Menu, X, User, LogOut, Star } from 'lucide-react';
import { useState } from 'react';
import { auth, signOut } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';

interface HeaderProps {
  userType?: 'student' | 'ngo' | null;
  userName?: string; // NGO name will be passed here
}

const Header = ({ userType: propUserType, userName: propUserName }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: firebaseUser, role, organizationName, eduCredits } = useAuth();

  const userType = propUserType || role;
  const userName = propUserName || organizationName;

  const isLoginPage =
    location.pathname === '/' || location.pathname === '/ngo-login';

  // ✅ Name resolution logic (IMPORTANT)
  // Student → Google displayName from Firebase
  // NGO → organization name from AuthContext or props
  // Fallback → "User"
  const displayName = userType === 'student'
    ? (firebaseUser?.displayName || 'User')
    : (userName || 'User');

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate anyway
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          to={
            userType === 'ngo'
              ? '/ngo-dashboard'
              : userType === 'student'
                ? '/student-home'
                : '/'
          }
          className="flex items-center gap-2 group"
        >
          <div className="relative">
            <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <Leaf className="h-4 w-4 text-success absolute -bottom-1 -right-1 animate-bounce-soft" />
          </div>
          <span className="font-display text-2xl font-bold">
            Edu<span className="text-primary">Cycle</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isLoginPage && userType && (
          <nav className="hidden md:flex items-center gap-6">
            {userType === 'student' && (
              <>
                <Link to="/student-home" className="nav-link">Home</Link>
                <Link to="/search-books" className="nav-link">Find Books</Link>
                <Link to="/notes" className="nav-link">Notes & PDFs</Link>
                <Link to="/request-status" className="nav-link">My Requests</Link>
                <Link to="/student-impact" className="nav-link">My Impact</Link>
              </>
            )}

            {userType === 'ngo' && (
              <>
                <Link to="/ngo-dashboard" className="nav-link">Dashboard</Link>
                <Link to="/ngo-find-books" className="nav-link">Find Books</Link>
                <Link to="/ngo-my-requests" className="nav-link">My Requests</Link>
                <Link to="/ngo-distribution" className="nav-link">Distribution</Link>
                <Link to="/ngo-impact" className="nav-link">Impact</Link>
                <Link to="/ngo-profile" className="nav-link">Profile</Link>
              </>
            )}
          </nav>
        )}

        {/* User / Login */}
        <div className="flex items-center gap-4">
          {userType ? (
            <div className="hidden md:flex items-center gap-3">
              <NotificationBell />
              {userType === 'student' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-bold text-primary">{eduCredits}</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : !isLoginPage ? (
            <Link to="/">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          ) : null}

          {/* Mobile Notification & menu button */}
          {!isLoginPage && userType && (
            <div className="flex items-center gap-1 md:hidden">
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && !isLoginPage && userType && (
        <div className="md:hidden border-t bg-card">
          <nav className="container py-4 flex flex-col gap-2">
            {userType === 'student' && (
              <>
                <Link to="/student-home" className="mobile-link">Home</Link>
                <Link to="/search-books" className="mobile-link">Find Books</Link>
                <Link to="/notes" className="mobile-link">Notes</Link>
                <Link to="/request-status" className="mobile-link">My Requests</Link>
                <Link to="/student-impact" className="mobile-link">My Impact</Link>
              </>
            )}

            {userType === 'ngo' && (
              <>
                <Link to="/ngo-dashboard" className="mobile-link">Dashboard</Link>
                <Link to="/ngo-find-books" className="mobile-link">Find Books</Link>
                <Link to="/ngo-my-requests" className="mobile-link">My Requests</Link>
                <Link to="/ngo-distribution" className="mobile-link">Distribution</Link>
                <Link to="/ngo-impact" className="mobile-link">Impact</Link>
                <Link to="/ngo-profile" className="mobile-link">Profile</Link>
              </>
            )}

            <div className="border-t mt-2 pt-2">
              <div className="px-4 py-2 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg text-left flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
