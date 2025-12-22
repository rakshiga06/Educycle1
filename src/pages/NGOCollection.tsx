import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, CheckCircle, Calendar, BookOpen } from 'lucide-react';
import { mockCollections } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const NGOCollection = () => {
  const { toast } = useToast();
  const [collections, setCollections] = useState(mockCollections);

  const handleMarkCollected = (id: string) => {
    setCollections(collections.map(c => 
      c.id === id ? { ...c, collected: true } : c
    ));
    toast({
      title: "Books collected!",
      description: "The collection has been marked as complete.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName="Hope Foundation" />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Truck className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Book Collections</h1>
            <p className="text-muted-foreground">
              Manage pickups from donors
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Badge variant="default">All ({collections.length})</Badge>
          <Badge variant="outline">
            Pending ({collections.filter(c => !c.collected).length})
          </Badge>
          <Badge variant="outline">
            Completed ({collections.filter(c => c.collected).length})
          </Badge>
        </div>

        {/* Collection Cards */}
        <div className="space-y-4">
          {collections.map(collection => (
            <Card key={collection.id} variant="elevated">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    collection.collected ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {collection.collected ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <Truck className="h-6 w-6 text-warning" />
                    )}
                  </div>

                  {/* Collection Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-bold text-lg">{collection.donorName}</h3>
                      <Badge variant={collection.collected ? 'approved' : 'pending'}>
                        {collection.collected ? 'Collected' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{collection.booksCount} books</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{collection.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(collection.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {!collection.collected && (
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkCollected(collection.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Collected
                      </Button>
                    )}
                    {collection.collected && (
                      <Button variant="outline" size="sm" disabled>
                        Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">No pending collections</h3>
            <p className="text-muted-foreground">
              Collections will appear here when donors match your requests
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NGOCollection;
