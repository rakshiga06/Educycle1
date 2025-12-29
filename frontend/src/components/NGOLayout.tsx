import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';

interface NGOLayoutProps {
  children: ReactNode;
}

export const NGOLayout = ({ children }: NGOLayoutProps) => {
  const { profile, loading } = useUserProfile();
  const orgName = profile?.organization_name || 'Organization';

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
      {children}
      <Footer />
    </div>
  );
};

