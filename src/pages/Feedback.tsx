import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import StarRating from '@/components/shared/StarRating';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const request = mockRequests.find(r => r.id === requestId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Please rate your experience",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: "Your feedback helps improve EduCycle for everyone.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" userName="Alex" />
        <main className="flex-1 container py-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
              <Heart className="h-10 w-10 text-success fill-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your feedback helps us build a better community. 
              You've earned <strong className="text-primary">25 EduCredits</strong> for sharing your experience!
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/student-impact')}>
                View My Impact
              </Button>
              <Button variant="outline" onClick={() => navigate('/search-books')}>
                Find More Books
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
      <Header userType="student" userName="Alex" />
      
      <main className="flex-1 container py-8">
        <Link to="/request-status" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-display font-bold mb-2">Share Your Experience</h1>
          <p className="text-muted-foreground mb-8">
            Help others by rating your book exchange experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Info */}
            <Card variant="outlined">
              <CardContent className="p-4">
                <h3 className="font-display font-bold">{request?.bookTitle || 'Book'}</h3>
                <p className="text-sm text-muted-foreground">Your book exchange is complete!</p>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How was your experience?</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              </CardContent>
            </Card>

            {/* Feedback Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Any comments? (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share what went well or what could be improved..."
                  className="w-full h-24 px-4 py-3 rounded-lg border-2 border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
                />
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Submit Feedback
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
