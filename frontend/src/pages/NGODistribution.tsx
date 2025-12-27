import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle, Users, BookOpen, Calendar, Upload } from 'lucide-react';
import { mockDistributions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const NGODistribution = () => {
  const { toast } = useToast();
  const [distributions, setDistributions] = useState(mockDistributions);

  const handleVerify = (id: string) => {
    setDistributions(distributions.map(d => 
      d.id === id ? { ...d, verified: true, booksDistributed: 50 } : d
    ));
    toast({
      title: "Distribution verified!",
      description: "The distribution has been recorded successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName="Hope Foundation" />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Send className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Book Distribution</h1>
            <p className="text-muted-foreground">
              Record and verify book distributions to students
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-primary">
                {distributions.filter(d => d.verified).reduce((acc, d) => acc + d.booksDistributed, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Books Distributed</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-success">
                {distributions.filter(d => d.verified).reduce((acc, d) => acc + d.studentsCount, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Students Reached</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-warning">
                {distributions.filter(d => !d.verified).length}
              </p>
              <p className="text-xs text-muted-foreground">Pending Verification</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Cards */}
        <div className="space-y-4">
          {distributions.map(distribution => (
            <Card key={distribution.id} variant="elevated">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    distribution.verified ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {distribution.verified ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <Send className="h-6 w-6 text-warning" />
                    )}
                  </div>

                  {/* Distribution Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-bold text-lg">{distribution.schoolName}</h3>
                      <Badge variant={distribution.verified ? 'approved' : 'pending'}>
                        {distribution.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{distribution.studentsCount} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{distribution.booksDistributed || 'TBD'} books</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(distribution.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex gap-2">
                    {!distribution.verified && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-4 w-4" />
                          Upload Proof
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleVerify(distribution.id)}
                          className="gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Verify
                        </Button>
                      </>
                    )}
                    {distribution.verified && (
                      <Button variant="outline" size="sm" disabled>
                        Verified ✓
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {distributions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">No distributions yet</h3>
            <p className="text-muted-foreground">
              Start distributing collected books to students
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NGODistribution;
