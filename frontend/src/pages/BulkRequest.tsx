import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, Loader2 } from 'lucide-react';
import { boardOptions, subjectOptions, classOptions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ngoApi } from '@/lib/api';

const BulkRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useUserProfile();
  const orgName = profile?.organization_name || 'Organization';
  
  const [subject, setSubject] = useState('');
  const [bookClass, setBookClass] = useState('');
  const [board, setBoard] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !bookClass || !board || !quantity) {
      toast({
        title: "Please fill all required fields",
        description: "Subject, Class, Board, and Quantity are required.",
        variant: "destructive",
      });
      return;
    }

    // If profile doesn't have city/area, we can't proceed
    // But let's check if they exist in the profile object
    const city = profile?.city || '';
    const area = profile?.area || '';

    if (!city || !area) {
      toast({
        title: "Organization location missing",
        description: "Your organization profile needs city and area. Please sign out and sign up again with location details, or contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const requestData = {
        subject,
        class_level: bookClass,
        board,
        quantity: parseInt(quantity, 10),
        city: city,
        area: area,
      };

      await ngoApi.createBulkRequest(requestData);
      
      setSubmitted(true);
      toast({
        title: "Bulk request submitted!",
        description: "We'll match your request with available donors.",
      });
    } catch (error: any) {
      console.error('Error submitting bulk request:', error);
      toast({
        title: "Failed to submit request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="ngo" userName={orgName} />
        <main className="flex-1 container py-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Request Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your bulk request for <strong>{quantity}</strong> {subject} books (Class {bookClass}) has been registered. 
              We'll notify you as books become available.
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/ngo-approval-status')}>
                View Request Status
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Request
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName={orgName} />
      
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Bulk Book Request</h1>
              <p className="text-muted-foreground">
                Request books for students in your program
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <div className="flex flex-wrap gap-2">
                    {subjectOptions.map(s => (
                      <Badge
                        key={s}
                        variant={subject === s ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSubject(s)}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class</label>
                    <div className="flex flex-wrap gap-2">
                      {classOptions.map(c => (
                        <Badge
                          key={c}
                          variant={bookClass === c ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setBookClass(c)}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Board</label>
                    <div className="flex flex-wrap gap-2">
                      {boardOptions.map(b => (
                        <Badge
                          key={b}
                          variant={board === b ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setBoard(b)}
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity Needed</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="E.g., 50"
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Submit Bulk Request
                </>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BulkRequest;
