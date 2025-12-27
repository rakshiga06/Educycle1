import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, BookOpen, Calendar, Shield } from 'lucide-react';
import { mockBooks } from '@/data/mockData';

const conditionVariant = {
  Good: 'good' as const,
  Usable: 'usable' as const,
  Damaged: 'damaged' as const,
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const book = mockBooks.find(b => b.id === id);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" userName="Alex" />
      
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
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            {book.insideImage && (
              <Card variant="outlined" className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src={book.insideImage} 
                    alt="Inside pages preview"
                    className="w-full h-full object-cover"
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
              <Badge variant={conditionVariant[book.condition]} className="mb-3">
                {book.condition} Condition
              </Badge>
              <h1 className="text-3xl font-display font-bold mb-2">{book.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>{book.subject}</span>
                <span>•</span>
                <span>Class {book.class}</span>
                <span>•</span>
                <span>{book.board}</span>
              </div>
            </div>

            <Card variant="stat">
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Edition</p>
                    <p className="font-medium">{book.edition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="font-medium">{book.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Donor Rating</p>
                    <p className="font-medium">{book.donorReputation} / 5.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium">{book.distance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donor Info */}
            <Card variant="outlined">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {book.donorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{book.donorName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span>{book.donorReputation} rating</span>
                      <span>•</span>
                      <span>Verified donor</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
