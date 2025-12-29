import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, MapPin, Award, Package, Send, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ngoApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const NGOProfile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { toast } = useToast();
  
  const [bulkRequests, setBulkRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const requests = await ngoApi.listBulkRequests().catch(() => []);
        setBulkRequests(requests || []);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast({
          title: 'Error loading profile',
          description: 'Failed to load profile data',
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
        <Header userType="ngo" />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const orgName = profile?.organization_name || 'Organization';
  const email = user?.email || profile?.email || 'Not available';
  const city = profile?.city || 'Not specified';
  const area = profile?.area || 'Not specified';
  
  const totalBooksDistributed = bulkRequests.reduce((sum, r) => sum + (r.fulfilled || 0), 0);
  const totalBooksCollected = bulkRequests.filter(r => r.status === 'fulfilled').length;
  const impactScore = totalBooksDistributed * 10 + totalBooksCollected * 5;

  const statusConfig: Record<string, { variant: any; icon: any; label: string; color: string }> = {
    pending: { variant: 'pending', icon: Clock, label: 'Pending', color: 'text-warning' },
    partial: { variant: 'approved', icon: Package, label: 'Partial', color: 'text-accent' },
    fulfilled: { variant: 'approved', icon: CheckCircle, label: 'Fulfilled', color: 'text-success' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName={orgName} />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-8">Organization Profile</h1>

          {/* Profile Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-display font-bold">{orgName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{city}, {area}</span>
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
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Books Collected</span>
                </div>
                <p className="text-3xl font-display font-bold">{totalBooksCollected}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Send className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">Books Distributed</span>
                </div>
                <p className="text-3xl font-display font-bold">{totalBooksDistributed}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-warning" />
                  <span className="text-sm text-muted-foreground">Impact Score</span>
                </div>
                <p className="text-3xl font-display font-bold">{impactScore}</p>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Request History */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Request Status</CardTitle>
            </CardHeader>
            <CardContent>
              {bulkRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No bulk requests yet. Create your first bulk request to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {bulkRequests.map((request) => {
                    const config = statusConfig[request.status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <StatusIcon className={`h-5 w-5 ${config.color}`} />
                          <div className="flex-1">
                            <p className="font-medium">
                              {request.subject} - Class {request.class_level} ({request.board})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.fulfilled || 0} / {request.quantity} books fulfilled • {' '}
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

export default NGOProfile;

