import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, BookOpen, Shield, Loader2 } from 'lucide-react';
import { booksApi } from '@/lib/api';
import { Book } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

const conditionVariant: Record<string, 'good' | 'usable' | 'damaged'> = {
  good: 'good',
  usable: 'usable',
  damaged: 'damaged',
  Good: 'good',
  Usable: 'usable',
  Damaged: 'damaged',
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await booksApi.getById(id);
      setBook(data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" />
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
        <Header userType="student" />
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />
      
      <main className="flex-1 container py-8">
        <Link to="/search-books" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <Card variant="elevated" className="overflow-hidden">
              <div className="aspect-[4/5] bg-muted">
                <img 
                  src={book.image_urls?.[0] || '/placeholder.svg'} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </Card>
            {book.image_urls && book.image_urls.length > 1 && (
              <Card variant="outlined" className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src={book.image_urls[1]} 
                    alt="Inside pages preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Inside pages preview
                </div>
              </Card>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge variant={conditionVariant[book.condition] || 'usable'} className="mb-3">
                {book.condition} Condition
              </Badge>
              <h1 className="text-3xl font-display font-bold mb-2">{book.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>{book.subject}</span>
                <span>•</span>
                <span>Class {book.class_level}</span>
                <span>•</span>
                <span>{book.board}</span>
              </div>
            </div>

            {book.description && (
              <Card variant="stat">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{book.description}</p>
                </CardContent>
              </Card>
            )}

            {(book.area || book.city) && (
              <Card variant="stat">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{book.area || ''}{book.city ? (book.area ? `, ${book.city}` : book.city) : ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safety Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
              <Shield className="h-5 w-5 text-success mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Safe Pickup Only</p>
                <p className="text-muted-foreground">
                  All pickups happen at verified locations like schools, libraries, or NGO centers. 
                  Your safety is our priority!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={() => navigate(`/request-book/${book.id}`)}
              >
                Request This Book
              </Button>
              <Button variant="outline" size="lg">
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetails;
