import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionCard from '@/components/shared/ActionCard';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Send, BarChart3, Users, BookOpen, Leaf, Loader2, Clock, CheckCircle } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ngoApi } from '@/lib/api';

const NGODashboard = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const orgName = profile?.organization_name || 'Organization';
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const data = await ngoApi.listBulkRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (profileLoading) {
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

  // Calculate stats from requests
  const totalBooksDistributed = requests.reduce((sum, r) => sum + (r.fulfilled || 0), 0);
  const totalBooksRequested = requests.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const pendingRequests = requests.filter(r => r.status === 'open').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName={orgName} />
      
      <main className="flex-1 container py-8">
        {/* Welcome */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Welcome, {orgName}! 🌱
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your book collection and distribution activities
          </p>
        </section>

        {/* Quick Stats */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold mb-6">Quick Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Requests"
              value={requests.length.toString()}
              subtitle="Bulk requests"
              icon={Package}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Books Distributed"
              value={totalBooksDistributed.toString()}
              subtitle="Total fulfilled"
              icon={BookOpen}
              iconColor="text-secondary"
              iconBgColor="bg-secondary/20"
            />
            <StatCard
              title="Pending Requests"
              value={pendingRequests.toString()}
              subtitle="Awaiting fulfillment"
              icon={Clock}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
            <StatCard
              title="Completed"
              value={completedRequests.toString()}
              subtitle="Fulfilled requests"
              icon={CheckCircle}
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-bold mb-6">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              title="Request Books"
              description="Bulk request books for your students"
              icon={Package}
              to="/bulk-request"
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <ActionCard
              title="Collect Books"
              description="View and manage pending collections"
              icon={Truck}
              to="/ngo-collection"
              iconColor="text-secondary"
              iconBgColor="bg-secondary/20"
            />
            <ActionCard
              title="Distribute Books"
              description="Record book distributions to students"
              icon={Send}
              to="/ngo-distribution"
              iconColor="text-accent"
              iconBgColor="bg-accent/10"
            />
            <ActionCard
              title="Impact Reports"
              description="View your organization's impact"
              icon={BarChart3}
              to="/ngo-impact"
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
          </div>
        </section>

        {/* Recent Requests */}
        {requests.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Recent Requests</h2>
              <Link to="/ngo-approval-status">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {requests.slice(0, 3).map(request => {
                const fulfilled = request.fulfilled || 0;
                const quantity = request.quantity || 0;
                const statusBadge = request.status === 'completed' 
                  ? <Badge variant="approved">Completed</Badge>
                  : request.status === 'open'
                  ? <Badge variant="pending">Pending</Badge>
                  : <Badge variant="approved">Partial</Badge>;
                
                return (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {request.subject} - Class {request.class_level} ({request.board})
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {fulfilled} / {quantity} books fulfilled
                          </p>
                        </div>
                        {statusBadge}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="bg-gradient-to-r from-success/5 to-primary/5 rounded-2xl p-6 md:p-8">
          <h3 className="font-display font-bold text-lg mb-4">💡 Coordinator Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Bulk Requests:</strong> You can request books for multiple students at once to streamline your operations.
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Safe Locations:</strong> Always use verified pickup points for collections to ensure safety.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NGODashboard;
