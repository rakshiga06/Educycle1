import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Wallet, Leaf, TreeDeciduous, Recycle, TrendingUp } from 'lucide-react';
import { mockNGOStats } from '@/data/mockData';

const NGOImpact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName="Hope Foundation" />
      
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
            value={mockNGOStats.studentsHelped.toLocaleString()}
            subtitle="Lives impacted"
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatCard
            title="Books Reused"
            value={mockNGOStats.booksReused.toLocaleString()}
            subtitle="Given new homes"
            icon={BookOpen}
            iconColor="text-secondary"
            iconBgColor="bg-secondary/20"
          />
          <StatCard
            title="Cost Saved"
            value={`₹${(mockNGOStats.costSaved / 1000).toFixed(0)}K`}
            subtitle="For families"
            icon={Wallet}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatCard
            title="CO₂ Saved"
            value={`${mockNGOStats.co2Saved} kg`}
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
                  175
                </p>
                <p className="text-sm text-muted-foreground">Trees Protected</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-primary/5">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Recycle className="h-7 w-7 text-primary" />
                </div>
                <p className="text-2xl font-display font-bold text-primary mb-1">
                  {mockNGOStats.booksReused}
                </p>
                <p className="text-sm text-muted-foreground">Books Recycled</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-accent/5">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-7 w-7 text-accent" />
                </div>
                <p className="text-2xl font-display font-bold text-accent mb-1">
                  8,400 kg
                </p>
                <p className="text-sm text-muted-foreground">Paper Saved</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-warning/5">
                <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-7 w-7 text-warning" />
                </div>
                <p className="text-2xl font-display font-bold text-warning mb-1">
                  42%
                </p>
                <p className="text-sm text-muted-foreground">Growth This Year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { subject: 'Mathematics', count: 850, color: 'bg-primary' },
                  { subject: 'Science', count: 720, color: 'bg-success' },
                  { subject: 'English', count: 580, color: 'bg-accent' },
                  { subject: 'Social Studies', count: 420, color: 'bg-secondary' },
                  { subject: 'Hindi', count: 350, color: 'bg-warning' },
                ].map(item => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.subject}</span>
                      <span className="font-medium">{item.count} books</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.count / 850) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: '1000+ Students Milestone', date: 'Dec 2024', icon: '🎉' },
                  { title: 'Zero Waste Month', date: 'Nov 2024', icon: '♻️' },
                  { title: 'Community Partner Award', date: 'Oct 2024', icon: '🏆' },
                  { title: '100 Trees Saved', date: 'Sep 2024', icon: '🌳' },
                ].map((achievement, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NGOImpact;
