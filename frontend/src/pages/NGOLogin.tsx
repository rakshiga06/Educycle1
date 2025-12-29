import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, ArrowLeft, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmail, signUpWithEmail, isFirebaseInitialized, getFirebaseInitError } from '@/lib/firebase';
import { authApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const NGOLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check Firebase initialization
    if (!isFirebaseInitialized()) {
      const errorMsg = getFirebaseInitError();
      toast({
        title: 'Firebase not configured',
        description: errorMsg || 'Please configure Firebase environment variables',
        variant: 'destructive',
      });
      return;
    }

    // Validation
    if (!email || !password) {
      toast({
        title: 'Please fill all fields',
        description: 'Email and password are required',
        variant: 'destructive',
      });
      return;
    }

    if (isSignUp && (!orgName || !city || !area)) {
      toast({
        title: 'Please fill all fields',
        description: 'Organization name, city, and area are required',
        variant: 'destructive',
      });
      return;
    }

    if (isSignUp && password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      let result;
      if (isSignUp) {
        // Sign up new NGO
        result = await signUpWithEmail(email, password);
      } else {
        // Sign in existing NGO
        result = await signInWithEmail(email, password);
      }

      // Bootstrap NGO in backend with metadata
      try {
        // Always send metadata if available (for sign-up or if user needs to update profile)
        const metadata = isSignUp ? {
          organization_name: orgName,
          city: city,
          area: area,
        } : undefined;
        
        await authApi.bootstrapNGO(metadata);
      } catch (error: any) {
        console.error('Bootstrap error:', error);
        // Continue even if bootstrap fails (user might already exist)
      }

      toast({
        title: isSignUp ? 'Account created!' : 'Welcome back!',
        description: `Signed in as ${email}`,
      });

      navigate('/ngo-dashboard');
    } catch (err: any) {
      console.error('NGO auth failed:', err);
      
      let errorMessage = isSignUp ? 'Failed to create account' : 'Failed to sign in';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found. Please sign up first.';
        setIsSignUp(true);
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
        setIsSignUp(false);
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: isSignUp ? 'Sign-up failed' : 'Sign-in failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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

          <Card variant="elevated">
            <CardHeader className="text-center">
              <Users className="mx-auto h-8 w-8 text-success" />
              <CardTitle>NGO / Institution Login</CardTitle>
              <CardDescription>Manage book distribution</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Organization Name</label>
                      <Input
                        placeholder="e.g., Hope Foundation"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">City</label>
                        <Input
                          placeholder="e.g., Mumbai"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={loading}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Area</label>
                        <Input
                          placeholder="e.g., Andheri West"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  {!isSignUp && <label className="text-sm font-medium mb-1 block">Email</label>}
                  <Input
                    type="email"
                    placeholder="Organization email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  {!isSignUp && <label className="text-sm font-medium mb-1 block">Password</label>}
                  <Input
                    type="password"
                    placeholder={isSignUp ? "Create password (min. 6 characters)" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="success"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isSignUp ? 'Creating account...' : 'Logging in...'}
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Login to Dashboard'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setPassword('');
                  }}
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NGOLogin;
