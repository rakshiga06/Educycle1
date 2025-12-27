import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Leaf, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  userType?: 'student' | 'ngo' | null;
  userName?: string;
}

const Header = ({ userType, userName }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/' || location.pathname === '/ngo-login';

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={userType === 'ngo' ? '/ngo-dashboard' : userType === 'student' ? '/student-home' : '/'} className="flex items-center gap-2 group">
          <div className="relative">
            <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <Leaf className="h-4 w-4 text-success absolute -bottom-1 -right-1 animate-bounce-soft" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Edu<span className="text-primary">Cycle</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isLoginPage && userType && (
          <nav className="hidden md:flex items-center gap-6">
            {userType === 'student' && (
              <>
                <Link to="/student-home" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/search-books" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Find Books
                </Link>
                <Link to="/notes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Notes & PDFs
                </Link>
                <Link to="/request-status" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  My Requests
                </Link>
                <Link to="/student-impact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  My Impact
                </Link>
              </>
            )}
            {userType === 'ngo' && (
              <>
                <Link to="/ngo-dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/bulk-request" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Request Books
                </Link>
                <Link to="/ngo-collection" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Collections
                </Link>
                <Link to="/ngo-distribution" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Distribution
                </Link>
                <Link to="/ngo-impact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Impact Report
                </Link>
              </>
            )}
          </nav>
        )}

        {/* User Menu / Login */}
        <div className="flex items-center gap-4">
          {userType && userName ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{userName}</span>
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

          {/* Mobile Menu Button */}
          {!isLoginPage && userType && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && !isLoginPage && userType && (
        <div className="md:hidden border-t border-border bg-card animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {userType === 'student' && (
              <>
                <Link to="/student-home" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/search-books" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Find Books
                </Link>
                <Link to="/notes" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Notes & PDFs
                </Link>
                <Link to="/request-status" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  My Requests
                </Link>
                <Link to="/student-impact" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  My Impact
                </Link>
              </>
            )}
            {userType === 'ngo' && (
              <>
                <Link to="/ngo-dashboard" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/bulk-request" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Request Books
                </Link>
                <Link to="/ngo-collection" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Collections
                </Link>
                <Link to="/ngo-distribution" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Distribution
                </Link>
                <Link to="/ngo-impact" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Impact Report
                </Link>
              </>
            )}
            <div className="border-t border-border mt-2 pt-2">
              <div className="px-4 py-2 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg text-left flex items-center gap-2"
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
