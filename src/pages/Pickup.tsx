import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, CheckCircle, Camera, Upload } from 'lucide-react';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Pickup = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmed, setConfirmed] = useState(false);

  const request = mockRequests.find(r => r.id === requestId);

  const handleConfirm = () => {
    setConfirmed(true);
    toast({
      title: "Book received!",
      description: "Thank you for confirming. Please leave feedback.",
    });
    setTimeout(() => {
      navigate(`/feedback/${requestId}`);
    }, 2000);
  };

  if (!request || request.status !== 'approved') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" userName="Alex" />
        <main className="flex-1 container py-8 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Request not found</h1>
          <Link to="/request-status">
            <Button>Back to Requests</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" userName="Alex" />
        <main className="flex-1 container py-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Book Received!</h1>
            <p className="text-muted-foreground mb-6">
              Congratulations! You've successfully received your book. 
              Redirecting you to leave feedback...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" userName="Alex" />
      
      <main className="flex-1 container py-8">
        <Link to="/request-status" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-2">Pickup Confirmation</h1>
          <p className="text-muted-foreground mb-8">
            Confirm when you've received the book
          </p>

          {/* Book Info */}
          <Card variant="stat" className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-lg mb-2">{request.bookTitle}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Requested on {new Date(request.requestDate).toLocaleDateString()}
              </p>
              
              <div className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
                <MapPin className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Verified Pickup Location</p>
                  <p className="text-sm text-muted-foreground">{request.pickupLocation}</p>
                  {request.pickupDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Scheduled: {new Date(request.pickupDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload (Optional) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload Photo (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Take a photo of the book you received
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This helps verify the transaction
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confirm Button */}
          <Button size="lg" className="w-full" onClick={handleConfirm}>
            <CheckCircle className="h-5 w-5 mr-2" />
            Mark Book as Received
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Only confirm after you've physically received the book
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pickup;
