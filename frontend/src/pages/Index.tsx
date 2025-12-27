import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Leaf, Mail, Recycle, GraduationCap, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/student-home');
  };

  const handleNGOLogin = () => {
    navigate('/ngo-login');
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
                <div className="space-y-3">
                  <Input type="email" placeholder="Enter your email" />
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={handleStudentLogin}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={handleStudentLogin}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Continue with Email
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>
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
                <div className="space-y-3">
                  <Input type="email" placeholder="Organization email" />
                  <Input type="password" placeholder="Password" />
                  <Button 
                    variant="success" 
                    className="w-full"
                    onClick={handleNGOLogin}
                  >
                    Login as NGO Coordinator
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  New organization? <a href="#" className="text-primary hover:underline">Register here</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="container py-16">
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
