import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Award, BookOpen, Gift, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { impactApi, requestsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const StudentProfile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { toast } = useToast();
  
  const [impact, setImpact] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [impactData, requestsData] = await Promise.all([
          impactApi.getUserImpact().catch(() => null),
          requestsApi.list().catch(() => []),
        ]);
        setImpact(impactData);
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast({
          title: 'Error loading profile',
          description: 'Failed to load some profile data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, toast]);

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = user?.displayName || 'Student';
  const email = user?.email || profile?.email || 'Not available';
  const booksDonated = impact?.books_reused || 0;
  const booksReceived = requests.filter(r => r.status === 'completed').length;
  const eduCredits = booksDonated * 50 + requests.filter(r => r.status === 'completed').length * 25;

  const statusConfig: Record<string, { variant: any; icon: any; label: string; color: string }> = {
    pending: { variant: 'pending', icon: Clock, label: 'Pending', color: 'text-warning' },
    approved: { variant: 'approved', icon: CheckCircle, label: 'Approved', color: 'text-success' },
    rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected', color: 'text-destructive' },
    completed: { variant: 'approved', icon: CheckCircle, label: 'Completed', color: 'text-success' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

          {/* Profile Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold">{displayName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Books Donated</span>
                </div>
                <p className="text-3xl font-display font-bold">{booksDonated}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">Books Received</span>
                </div>
                <p className="text-3xl font-display font-bold">{booksReceived}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-warning" />
                  <span className="text-sm text-muted-foreground">EduCredits</span>
                </div>
                <p className="text-3xl font-display font-bold">{eduCredits}</p>
              </CardContent>
            </Card>
          </div>

          {/* Request History */}
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No requests yet. Start by searching for books!
                </p>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => {
                    const config = statusConfig[request.status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-5 w-5 ${config.color}`} />
                          <div>
                            <p className="font-medium">Book Request #{request.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfile;

