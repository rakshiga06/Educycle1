import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const NGOLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/ngo-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card variant="elevated" className="overflow-hidden">
            <div className="h-2 gradient-eco" />
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl">NGO / Institution Login</CardTitle>
              <CardDescription>
                Access your coordinator dashboard to manage book distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Organization Email</label>
                  <Input type="email" placeholder="coordinator@organization.org" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button 
                  variant="success" 
                  className="w-full"
                  onClick={handleLogin}
                >
                  Login to Dashboard
                </Button>
              </div>
              
              <div className="text-center space-y-2 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  New organization?{' '}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Apply for registration
                  </a>
                </p>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot password?
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Are you a student?</strong>{' '}
              <Link to="/" className="text-primary hover:underline">Login here</Link> to find or donate books.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NGOLogin;
