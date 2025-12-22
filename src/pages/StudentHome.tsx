import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionCard from '@/components/shared/ActionCard';
import { Search, Gift, FileText, BarChart3, Sparkles } from 'lucide-react';

const StudentHome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" userName="Alex" />
      
      <main className="flex-1 container py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Hey, Alex! 👋
            </h1>
            <Sparkles className="h-6 w-6 text-warning animate-pulse-soft" />
          </div>
          <p className="text-lg text-muted-foreground">
            Ready to find your next textbook or share one with a fellow student?
          </p>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-bold mb-6">What would you like to do?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              title="Request a Book"
              description="Find textbooks you need for free"
              icon={Search}
              to="/search-books"
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <ActionCard
              title="Donate a Book"
              description="Share books with students who need them"
              icon={Gift}
              to="/donate-book"
              iconColor="text-secondary"
              iconBgColor="bg-secondary/20"
            />
            <ActionCard
              title="Notes & PDFs"
              description="Download study materials for free"
              icon={FileText}
              to="/notes"
              iconColor="text-accent"
              iconBgColor="bg-accent/10"
            />
            <ActionCard
              title="Impact Dashboard"
              description="See how you're making a difference"
              icon={BarChart3}
              to="/student-impact"
              iconColor="text-success"
              iconBgColor="bg-success/10"
            />
          </div>
        </section>

        {/* Tips Section */}
        <section className="bg-gradient-to-r from-primary/5 to-success/5 rounded-2xl p-6 md:p-8">
          <h3 className="font-display font-bold text-lg mb-4">💡 Did you know?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Every book you share</strong> saves about 24 sheets of paper and helps protect our forests!
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Safe pickups only!</strong> Always meet at verified locations like schools or libraries.
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Earn EduCredits</strong> by donating books and unlock exclusive study materials!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentHome;
