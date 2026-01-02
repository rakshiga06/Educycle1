import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Wallet, Leaf, Award, TreeDeciduous, Recycle, Gift, Loader2 } from 'lucide-react';
import { impactApi } from '@/lib/api';

const StudentImpact = () => {
  const [impactData, setImpactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const data = await impactApi.getUserImpact();
        setImpactData(data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const { eduCredits } = useAuth();
  
  const data = impactData ? {
    ...impactData,
    edu_credits: (impactData.edu_credits === 0 && eduCredits > 0) ? eduCredits : impactData.edu_credits
  } : {
    books_shared: 0,
    books_received: 0,
    money_saved_inr: 0,
    paper_saved_kg: 0,
    edu_credits: eduCredits || 0,
    trees_protected: 0,
    co2_saved_kg: 0
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Your Impact Dashboard</h1>
          <p className="text-muted-foreground">
            See how you're making a difference for students and the planet
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Books Shared"
            value={data.books_shared}
            subtitle="Given to others"
            icon={Gift}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatCard
            title="Money Saved"
            value={`₹${data.money_saved_inr.toLocaleString()}`}
            subtitle="In book costs"
            icon={Wallet}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatCard
            title="Paper Saved"
            value={`${data.paper_saved_kg.toFixed(1)} kg`}
            subtitle="Less waste"
            icon={Leaf}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatCard
            title="EduCredits"
            value={data.edu_credits}
            subtitle="Points earned"
            icon={Award}
            iconColor="text-warning"
            iconBgColor="bg-warning/10"
          />
        </div>

        {/* Environmental Impact */}
        <Card variant="stat" className="mb-8 overflow-hidden">
          <div className="h-2 gradient-eco" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreeDeciduous className="h-5 w-5 text-success" />
              Your Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-success/5">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <TreeDeciduous className="h-8 w-8 text-success" />
                </div>
                <p className="text-3xl font-display font-bold text-success mb-1">
                  {data.trees_protected}
                </p>
                <p className="text-sm text-muted-foreground">Trees Protected</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-primary/5">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-primary mb-1">
                  {data.books_shared + data.books_received}
                </p>
                <p className="text-sm text-muted-foreground">Books Reused</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-accent/5">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-8 w-8 text-accent" />
                </div>
                <p className="text-3xl font-display font-bold text-accent mb-1">
                  {data.co2_saved_kg.toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EduCredits Info */}
        <Card className="overflow-hidden">
          <div className="h-2 gradient-warm" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" />
              About EduCredits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Earn EduCredits by participating in the EduCycle community.
              Use them to unlock exclusive study materials and features!
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-bold text-lg text-primary mb-1">+50 credits</p>
                <p className="text-muted-foreground">Donate a book</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-bold text-lg text-primary mb-1">+25 credits</p>
                <p className="text-muted-foreground">Leave feedback</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-bold text-lg text-primary mb-1">+10 credits</p>
                <p className="text-muted-foreground">Complete profile</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default StudentImpact;
