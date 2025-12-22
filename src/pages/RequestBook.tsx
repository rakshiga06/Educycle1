import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { mockBooks } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const pickupOptions = [
  { id: 'school', label: 'School Library', description: 'Meet at your school library' },
  { id: 'library', label: 'Public Library', description: 'Meet at a public library near you' },
  { id: 'ngo', label: 'NGO Center', description: 'Meet at a verified NGO center' },
];

const RequestBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reason, setReason] = useState('');
  const [pickupPreference, setPickupPreference] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const book = mockBooks.find(b => b.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim() || !pickupPreference) {
      toast({
        title: "Please fill all fields",
        description: "Tell us why you need this book and select a pickup location",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "Request submitted!",
      description: "We'll notify you once the donor responds.",
    });
  };

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" userName="Alex" />
        <main className="flex-1 container py-8 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Book not found</h1>
          <Link to="/search-books">
            <Button>Back to Search</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" userName="Alex" />
        <main className="flex-1 container py-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Request Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your request for <strong>{book.title}</strong> has been sent. 
              The donor will review it and get back to you soon.
            </p>
            
            <Card variant="stat" className="mb-8">
              <CardContent className="p-6">
                <Badge variant="pending" className="mb-3">Pending Approval</Badge>
                <p className="text-sm text-muted-foreground">
                  You'll receive a notification once your request is approved. 
                  Then you can chat with the donor to arrange the pickup.
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/request-status')}>
                View My Requests
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
        <Link to={`/book/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to book details
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-2">Request Book</h1>
          <p className="text-muted-foreground mb-8">
            Tell us why you need this book and where you'd like to pick it up
          </p>

          {/* Book Summary */}
          <Card variant="outlined" className="mb-8">
            <CardContent className="p-4 flex gap-4">
              <div className="w-16 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-display font-bold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {book.subject} • Class {book.class} • {book.board}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{book.distance} away</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why do you need this book?</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., I need this book for my board exams preparation..."
                  className="w-full h-24 px-4 py-3 rounded-lg border-2 border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
                />
              </CardContent>
            </Card>

            {/* Pickup Preference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Where would you like to pick up?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pickupOptions.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      pickupPreference === option.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pickup"
                      value={option.id}
                      checked={pickupPreference === option.id}
                      onChange={(e) => setPickupPreference(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      pickupPreference === option.id ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {pickupPreference === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Submit Request
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestBook;
