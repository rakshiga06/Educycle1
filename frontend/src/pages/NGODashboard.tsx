import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionCard from '@/components/shared/ActionCard';
import StatCard from '@/components/shared/StatCard';
import { Package, Truck, Send, BarChart3, Users, BookOpen, Leaf } from 'lucide-react';
import { mockNGOStats } from '@/data/mockData';

const NGODashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName="Hope Foundation" />
      
      <main className="flex-1 container py-8">
        {/* Welcome */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Welcome, Hope Foundation! 🌱
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
              title="Students Helped"
              value={mockNGOStats.studentsHelped.toLocaleString()}
              subtitle="This year"
              icon={Users}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatCard
              title="Books Distributed"
              value={mockNGOStats.booksReused.toLocaleString()}
              subtitle="Total reused"
              icon={BookOpen}
              iconColor="text-secondary"
              iconBgColor="bg-secondary/20"
            />
            <StatCard
              title="Cost Saved"
              value={`₹${(mockNGOStats.costSaved / 1000).toFixed(0)}K`}
              subtitle="For students"
              icon={Leaf}
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
            <StatCard
              title="CO₂ Saved"
              value={`${mockNGOStats.co2Saved} kg`}
              subtitle="Environmental impact"
              icon={Leaf}
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
