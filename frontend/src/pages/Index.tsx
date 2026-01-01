import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { BookOpen, Leaf, Recycle, GraduationCap, Users, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { signInWithGoogle, isFirebaseInitialized, getFirebaseInitError, signInWithEmail, signUpWithEmail } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // NGO Auth State
  const [ngoEmail, setNgoEmail] = useState('');
  const [ngoPassword, setNgoPassword] = useState('');
  const [ngoOrgName, setNgoOrgName] = useState('');
  const [ngoCity, setNgoCity] = useState('');
  const [ngoArea, setNgoArea] = useState('');
  const [ngoOtp, setNgoOtp] = useState('');
  const [ngoOtpSent, setNgoOtpSent] = useState(false);
  const [isNgoSignUpMode, setIsNgoSignUpMode] = useState(false);
  const [isNgoLoading, setIsNgoLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to send Student OTP to:', email);
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email', variant: 'destructive' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      setIsEmailLoading(true);
      await authApi.sendOtp(normalizedEmail);
      console.log('Student OTP sent successfully');
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Please check your email for the 6-digit verification code.',
      });
    } catch (error: any) {
      console.error('Student OTP Send Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleVerifyAndAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to verify Student OTP for:', email);
    if (!otp) {
      toast({ title: 'Error', description: 'Please enter the OTP', variant: 'destructive' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setIsEmailLoading(true);
      let customToken;

      if (isSignUpMode) {
        if (!password || !fullName || !city || !area) {
          toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
          return;
        }

        const result = (await authApi.registerWithOtp({
          email: normalizedEmail,
          otp,
          password,
          role: 'student',
          metadata: { fullName, city, area }
        })) as any;
        customToken = result.custom_token;
      } else {
        const result = (await authApi.loginWithOtp(normalizedEmail, otp)) as any;
        customToken = result.custom_token;
      }

      if (customToken) {
        const { signInWithCustomToken } = await import('@/lib/firebase');
        await signInWithCustomToken(customToken);

        toast({
          title: isSignUpMode ? 'Account Created' : 'Welcome Back',
          description: `Signed in as ${email}`,
        });
        navigate('/student-home');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Authentication Failed',
        description: error.message || 'Verification failed. Please check your OTP.',
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleNGOSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to send NGO OTP to:', ngoEmail);
    if (!ngoEmail) {
      toast({ title: 'Error', description: 'Please enter organization email', variant: 'destructive' });
      return;
    }

    const normalizedEmail = ngoEmail.trim().toLowerCase();
    try {
      setIsNgoLoading(true);
      await authApi.sendOtp(normalizedEmail);
      console.log('NGO OTP sent successfully');
      setNgoOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Verification code sent to organization email.',
      });
    } catch (error: any) {
      console.error('NGO OTP Send Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsNgoLoading(false);
    }
  };

  const handleNGOVerifyAndAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to verify NGO OTP for:', ngoEmail);
    if (!ngoOtp) {
      toast({ title: 'Error', description: 'Please enter the OTP', variant: 'destructive' });
      return;
    }

    const normalizedEmail = ngoEmail.trim().toLowerCase();
    try {
      setIsNgoLoading(true);
      let customToken;

      if (isNgoSignUpMode) {
        if (!ngoPassword || !ngoOrgName || !ngoCity || !ngoArea) {
          toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
          return;
        }

        const result = (await authApi.registerWithOtp({
          email: normalizedEmail,
          otp: ngoOtp,
          password: ngoPassword,
          role: 'ngo',
          metadata: { organization_name: ngoOrgName, city: ngoCity, area: ngoArea }
        })) as any;
        customToken = result.custom_token;
      } else {
        const result = (await authApi.loginWithOtp(normalizedEmail, ngoOtp)) as any;
        customToken = result.custom_token;
      }

      if (customToken) {
        const { signInWithCustomToken } = await import('@/lib/firebase');
        await signInWithCustomToken(customToken);

        toast({
          title: isNgoSignUpMode ? 'NGO Account Created' : 'Welcome Back',
          description: `Signed in as ${ngoEmail}`,
        });
        navigate('/ngo-dashboard');
      }
    } catch (error: any) {
      console.error('NGO Auth error:', error);
      toast({
        title: 'Authentication Failed',
        description: error.message || 'Verification failed.',
        variant: 'destructive',
      });
    } finally {
      setIsNgoLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Check Firebase initialization first
    if (!isFirebaseInitialized()) {
      const errorMsg = getFirebaseInitError();
      toast({
        title: 'Firebase not configured',
        description: errorMsg || 'Please configure Firebase environment variables in .env file',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsGoogleLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;

      try {
        await authApi.bootstrap('student');
      } catch (error) {
        console.error('Bootstrap error:', error);
      }

      toast({
        title: 'Welcome!',
        description: `Signed in as ${user.email}`,
      });

      navigate('/student-home');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      let errorMessage = error.message || 'Failed to sign in with Google';
      if (error.code === 'auth/popup-closed-by-user') errorMessage = 'Sign-in was cancelled.';
      toast({ title: 'Sign-in failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsGoogleLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

          <div className="container relative py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium animate-fade-in">
                <Leaf className="h-4 w-4" />
                <span>Join 10,000+ students saving books & the planet</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight animate-slide-up">
                Give Your Books a{' '}
                <span className="text-primary">Second Life</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                EduCycle connects students who need textbooks with those who can share.
                <span className="text-success font-medium"> Free books. Zero waste. Endless learning.</span>
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Recycle className="h-5 w-5 text-success" />
                  <span>50,000+ Books Reused</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>15,000+ Students Helped</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login Cards */}
        <section className="container py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Login */}
            <Card variant="elevated" className="overflow-hidden">
              <div className="h-2 gradient-hero" />
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">I'm a Student</CardTitle>
                <CardDescription>
                  Find free textbooks or share yours with others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-primary/20 hover:bg-primary/5"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isEmailLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or with Email</span></div>
                </div>

                <form onSubmit={otpSent ? handleVerifyAndAuth : handleSendOtp} className="space-y-3">
                  {!otpSent ? (
                    <>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isEmailLoading || isGoogleLoading}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isEmailLoading || isGoogleLoading}
                      >
                        {isEmailLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Send OTP'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary/5 p-3 rounded-lg mb-2">
                        <p className="text-xs text-center text-muted-foreground">
                          OTP sent to <span className="font-medium text-foreground">{email}</span>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="ml-2 text-primary hover:underline"
                          >
                            Change
                          </button>
                        </p>
                      </div>

                      <Input
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        disabled={isEmailLoading || isGoogleLoading}
                        className="text-center text-lg tracking-widest font-bold"
                      />

                      {isSignUpMode && (
                        <>
                          <Input
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={isEmailLoading || isGoogleLoading}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="City"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              disabled={isEmailLoading || isGoogleLoading}
                            />
                            <Input
                              placeholder="Area"
                              value={area}
                              onChange={(e) => setArea(e.target.value)}
                              required
                              disabled={isEmailLoading || isGoogleLoading}
                            />
                          </div>
                          <Input
                            type="password"
                            placeholder="Create Password (min 6 chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isEmailLoading || isGoogleLoading}
                          />
                        </>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isEmailLoading || isGoogleLoading}
                      >
                        {isEmailLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          isSignUpMode ? 'Verify & Sign Up' : 'Verify & Login'
                        )}
                      </Button>
                    </>
                  )}
                </form>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">{isSignUpMode ? 'Already have an account? ' : 'New to EduCycle? '}</span>
                  <button
                    onClick={() => {
                      setIsSignUpMode(!isSignUpMode);
                      setOtpSent(false); // Reset OTP if switching modes
                    }}
                    className="text-primary hover:underline font-medium"
                    type="button"
                  >
                    {isSignUpMode ? 'Login' : 'Create Account'}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* NGO Login */}
            <Card variant="elevated" className="overflow-hidden">
              <div className="h-2 gradient-eco" />
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl">NGO / Institution</CardTitle>
                <CardDescription>
                  Help distribute books to students in need
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={ngoOtpSent ? handleNGOVerifyAndAuth : handleNGOSendOtp} className="space-y-3">
                  {!ngoOtpSent ? (
                    <>
                      <Input
                        type="email"
                        placeholder="Organization Email"
                        value={ngoEmail}
                        onChange={(e) => setNgoEmail(e.target.value)}
                        required
                        disabled={isNgoLoading}
                      />
                      <Button
                        type="submit"
                        variant="success"
                        className="w-full"
                        disabled={isNgoLoading}
                      >
                        {isNgoLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Send NGO Verification OTP'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-success/5 p-3 rounded-lg mb-2">
                        <p className="text-xs text-center text-muted-foreground">
                          OTP sent to <span className="font-medium text-foreground">{ngoEmail}</span>
                          <button
                            type="button"
                            onClick={() => setNgoOtpSent(false)}
                            className="ml-2 text-success hover:underline"
                          >
                            Change
                          </button>
                        </p>
                      </div>

                      <Input
                        placeholder="6-digit OTP"
                        value={ngoOtp}
                        onChange={(e) => setNgoOtp(e.target.value)}
                        required
                        maxLength={6}
                        disabled={isNgoLoading}
                        className="text-center text-lg tracking-widest font-bold"
                      />

                      {isNgoSignUpMode && (
                        <>
                          <Input
                            placeholder="Organization Name"
                            value={ngoOrgName}
                            onChange={(e) => setNgoOrgName(e.target.value)}
                            required
                            disabled={isNgoLoading}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="City"
                              value={ngoCity}
                              onChange={(e) => setNgoCity(e.target.value)}
                              required
                              disabled={isNgoLoading}
                            />
                            <Input
                              placeholder="Area"
                              value={ngoArea}
                              onChange={(e) => setNgoArea(e.target.value)}
                              required
                              disabled={isNgoLoading}
                            />
                          </div>
                          <Input
                            type="password"
                            placeholder="Dashboard Password"
                            value={ngoPassword}
                            onChange={(e) => setNgoPassword(e.target.value)}
                            required
                            disabled={isNgoLoading}
                          />
                        </>
                      )}

                      <Button
                        type="submit"
                        variant="success"
                        className="w-full"
                        disabled={isNgoLoading}
                      >
                        {isNgoLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          isNgoSignUpMode ? 'Verify & Create NGO Account' : 'Verify & Login'
                        )}
                      </Button>
                    </>
                  )}
                </form>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">{isNgoSignUpMode ? 'Already registered? ' : 'Register your NGO? '}</span>
                  <button
                    onClick={() => {
                      setIsNgoSignUpMode(!isNgoSignUpMode);
                      setNgoOtpSent(false);
                    }}
                    className="text-success font-medium hover:underline"
                    type="button"
                  >
                    {isNgoSignUpMode ? 'Login' : 'Register'}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Detailed Access</span></div>
                </div>

                <Link to="/ngo-login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-success"
                  >
                    Legacy Login / Full Registration Page
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        < section className="container py-16" >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">How EduCycle Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, safe, and sustainable. Here's how you can be part of the book sharing movement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg">Find or Share Books</h3>
              <p className="text-sm text-muted-foreground">
                Search for textbooks you need or list books you no longer use. It's completely free!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-secondary/20 flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-lg">Safe Pickup</h3>
              <p className="text-sm text-muted-foreground">
                Meet at verified locations like schools, libraries, or NGO centers. No home visits!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-success/10 flex items-center justify-center mx-auto">
                <Leaf className="h-10 w-10 text-success" />
              </div>
              <h3 className="font-display font-bold text-lg">Make an Impact</h3>
              <p className="text-sm text-muted-foreground">
                Every book shared saves money and protects trees. Track your positive impact!
              </p>
            </div>
          </div>
        </section >
      </main >

      <Footer />
    </div >
  );
};

export default Index;
