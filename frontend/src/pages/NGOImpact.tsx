import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Wallet, Leaf, TreeDeciduous, Recycle, TrendingUp, Loader2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useState, useEffect } from 'react';
import { impactApi } from '@/lib/api';

const NGOImpact = () => {
  const navigate = useNavigate();
  const { role, loading: authLoading, user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [impactData, setImpactData] = useState<any>(null);
  const [fetchingImpact, setFetchingImpact] = useState(true);

  useEffect(() => {
    if (!authLoading && role === 'student') {
      navigate('/student-impact');
    }
  }, [role, authLoading, navigate]);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        setFetchingImpact(true);
        const data = await impactApi.getUserImpact();
        setImpactData(data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setFetchingImpact(false);
      }
    };

    if (user) {
      fetchImpact();
    }
  }, [user]);

  const orgName = profile?.organization_name || 'Organization';
  const loading = authLoading || profileLoading || fetchingImpact;

  if (loading) {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName={orgName} />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Impact Report</h1>
          <p className="text-muted-foreground">
            Your organization's contribution to education and sustainability
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Students Helped"
            value={(impactData?.students_helped || 0).toLocaleString()}
            subtitle="Lives impacted"
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatCard
            title="Books Reused"
            value={(impactData?.total_reused || 0).toLocaleString()}
            subtitle="Given new homes"
            icon={BookOpen}
            iconColor="text-secondary"
            iconBgColor="bg-secondary/20"
          />
          <StatCard
            title="Cost Saved"
            value={`₹${((impactData?.money_saved_inr || 0) / 1000).toFixed(1)}K`}
            subtitle="For families"
            icon={Wallet}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatCard
            title="CO₂ Saved"
            value={`${impactData?.co2_saved_kg || 0} kg`}
            subtitle="Carbon footprint reduced"
            icon={Leaf}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
        </div>

        {/* Environmental Impact */}
        <Card variant="stat" className="mb-8 overflow-hidden">
          <div className="h-2 gradient-eco" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreeDeciduous className="h-5 w-5 text-success" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-success/5">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <TreeDeciduous className="h-7 w-7 text-success" />
                </div>
                <p className="text-2xl font-display font-bold text-success mb-1">
                  {impactData?.trees_protected || 0}
                </p>
                <p className="text-sm text-muted-foreground">Trees Protected</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-primary/5">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Recycle className="h-7 w-7 text-primary" />
                </div>
                <p className="text-2xl font-display font-bold text-primary mb-1">
                  {impactData?.total_reused || 0}
                </p>
                <p className="text-sm text-muted-foreground">Books Recycled</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-accent/5">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-7 w-7 text-accent" />
                </div>
                <p className="text-2xl font-display font-bold text-accent mb-1">
                  {impactData?.paper_saved_kg || 0} kg
                </p>
                <p className="text-sm text-muted-foreground">Paper Saved</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-warning/5">
                <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-7 w-7 text-warning" />
                </div>
                <p className="text-2xl font-display font-bold text-warning mb-1">
                  {((impactData?.total_reused || 0) > 0 ? 'Active' : 'Starting')}
                </p>
                <p className="text-sm text-muted-foreground">Growth Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>

      <Footer />
    </div>
  );
};

export default NGOImpact;
