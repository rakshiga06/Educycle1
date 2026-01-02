import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { booksApi, requestsApi } from '@/lib/api';
import { Book } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';


const NGORequestBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && role === 'student') {
      navigate(`/request-book/${id}`);
    }
  }, [role, authLoading, navigate, id]);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [pickupPreference, setPickupPreference] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await booksApi.getById(id) as Book;
      setBook(data);
      // Automatically set pickup preference to donor's preferred location if available
      if (data.pickup_location) {
        setPickupPreference(data.pickup_location);
      } else {
        setPickupPreference(data.area || data.city || 'Donor Location');
      }
    } catch (error: any) {
      console.error('Error loading book:', error);
      toast({
        title: 'Error loading book',
        description: error.message || 'Failed to fetch book details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Tell us why you need this book",
        variant: "destructive",
      });
      return;
    }

    if (!book || !user) {
      toast({
        title: "Error",
        description: "Please log in to request a book",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await requestsApi.create(book.id, book.donor_uid, pickupPreference, reason, quantity);
      setSubmitted(true);
      toast({
        title: "Request submitted!",
        description: "We'll notify you once the donor responds.",
      });
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error submitting request",
        description: error.message || 'Failed to submit request',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="ngo" />
        <main className="flex-1 container py-8 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Book not found</h1>
          <Link to="/ngo-find-books">
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
        <Header userType="ngo" userName={user?.displayName || undefined} />
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
              <Button onClick={() => navigate('/ngo-my-requests')}>
                View My Requests
              </Button>
              <Button variant="outline" onClick={() => navigate('/ngo-find-books')}>
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
      <Header userType="ngo" />

      <main className="flex-1 container py-8">
        <Link to={`/ngo-books/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to book details
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-2">Request Book</h1>
          <p className="text-muted-foreground mb-8">
            Tell us why you need this book for your organization
          </p>

          {/* Book Summary */}
          <Card variant="outlined" className="mb-8">
            <CardContent className="p-4 flex gap-4">
              <div className="w-16 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                <img
                  src={book.image_urls?.[0] || '/placeholder.svg'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div>
                <h3 className="font-display font-bold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {book.subject} • Class {book.class_level} • {book.board}
                </p>
                {(book.area || book.city) && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{book.area || ''}{book.city ? (book.area ? `, ${book.city}` : book.city) : ''}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NGO Quantity Input (Always show on this NGO page) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quantity Required</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="max-w-[200px]"
                  placeholder="Number of copies"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Specify the number of copies you need for your students.
                </p>
              </CardContent>
            </Card>

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

            {/* Pickup Location Display (Donor's Choice) */}
            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-secondary" />
                  Pickup Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-lg">
                  {book.pickup_location || `${book.area}${book.area && book.city ? ', ' : ''}${book.city}` || 'To be coordinated with donor'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {book.pickup_location
                    ? "The donor has selected this verified safe pickup location."
                    : "This is the donor's general location. You can coordinate the exact meeting point after approval."}
                </p>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NGORequestBook;
