import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, CheckCircle, Loader2, Search, Shield } from 'lucide-react';
import { booksApi, requestsApi, locationApi } from '@/lib/api';
import { Book } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const RequestBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && role === 'ngo') {
      navigate(`/ngo-request-book/${id}`);
    }
  }, [role, authLoading, navigate, id]);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pickup Location search state
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [searchingLocations, setSearchingLocations] = useState(false);
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  useEffect(() => {
    // Pre-fill user location if available
    if (user) {
      if ((user as any).city) setCity((user as any).city); // Access check needed if type definition is strict
      // We might need to fetch profile explicitly if user object in context lacks these details
    }
  }, [user]);

  const loadBook = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await booksApi.getById(id);
      setBook(data as Book);
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

  const handleSearchLocations = async () => {
    if (!city || !area) {
      toast({
        title: "Location required",
        description: "Please enter your city and area to find nearby safe pickup points",
        variant: "destructive"
      });
      return;
    }

    try {
      setSearchingLocations(true);
      const result = await locationApi.searchPickupPoints(city, area);
      setPickupPoints(result.pickup_points);
      if (result.pickup_points.length === 0) {
        toast({
          title: "No nearby points found",
          description: "Try increasing the search radius or double check your area name.",
          variant: 'destructive' // Or warning
        });
      }
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSearchingLocations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please tell us why you need this book",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPickupPoint) {
      toast({
        title: "Pickup location required",
        description: "Please search for and select a safe pickup location",
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
      // Construct a meaningful location string
      const locationStr = `NGO: ${selectedPickupPoint.name}, ${selectedPickupPoint.area}`;

      await requestsApi.create(book.id, book.donor_uid, locationStr, reason, quantity);
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
        <Header userType={role || 'student'} />
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
        <Header userType={role || 'student'} />
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
        <Header userType={role || 'student'} userName={user?.displayName || undefined} />
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
      <Header userType={role || 'student'} />

      <main className="flex-1 container py-8">
        <Link to={`/book/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to book details
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-2">Request Book</h1>
          <p className="text-muted-foreground mb-8">
            Tell us why you need this book and search for a safe pickup location.
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
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Quantity Input */}
            {role === 'ngo' && (
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
                </CardContent>
              </Card>
            )}

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

            {/* Safe Pickup Location Finder */}
            <Card className="overflow-hidden border-2 border-primary/20">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Find Safe Pickup Location (NGOs)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-2"
                      onClick={() => {
                        if (navigator.geolocation) {
                          setSearchingLocations(true);
                          navigator.geolocation.getCurrentPosition(async (position) => {
                            try {
                              const { latitude, longitude } = position.coords;
                              const result = await locationApi.searchPickupPoints(undefined, undefined, latitude, longitude);
                              const castedResult = result as any; // Allow accessing search_expanded

                              setPickupPoints(result.pickup_points);

                              // Auto-fill address if detected
                              const addr = (result.user_location as any)?.detected_address;

                              // Auto-fill address if detected
                              if (addr) {
                                if (addr.city) setCity(addr.city);
                                if (addr.area) setArea(addr.area);

                                toast({
                                  title: castedResult.search_expanded ? "Search Expanded" : "Location Detected",
                                  description: addr.display_name ? `Searching near: ${addr.display_name}` : `Searching near ${addr.area}, ${addr.city}`
                                });
                              } else {
                                toast({ title: "Location Detected", description: "Found nearby pickup points." });
                              }
                              if (result.pickup_points.length === 0) {
                                toast({ title: "No NGOs found nearby", description: "Try manually searching a wider area." });
                              }
                            } catch (e: any) {
                              toast({ title: "Location Error", description: e.message, variant: "destructive" });
                            } finally {
                              setSearchingLocations(false);
                            }
                          }, (e) => {
                            setSearchingLocations(false);
                            toast({ title: "Permission denied", description: "Please enter city/area manually or allow location access.", variant: "destructive" });
                          });
                        } else {
                          toast({ title: "Geolocation not supported", description: "Please enter location manually", variant: "destructive" });
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use My Current Location
                    </Button>
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-muted"></div>
                      <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase">Or search manually</span>
                      <div className="flex-grow border-t border-muted"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Area</label>
                    <Input
                      placeholder="e.g. Bandra"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSearchLocations}
                  disabled={searchingLocations}
                  variant="secondary"
                  className="w-full"
                >
                  {searchingLocations ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Find Verified NGOs Nearby
                </Button>

                {pickupPoints.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Select a location:</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {pickupPoints.map((point) => (
                        <div
                          key={point.uid}
                          onClick={() => setSelectedPickupPoint(point)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-colors flex items-center justify-between ${selectedPickupPoint?.uid === point.uid
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <div>
                            <p className="font-semibold">{point.name}</p>
                            <p className="text-xs text-muted-foreground">{point.area}, {point.city}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">{point.distance_km} km</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pickupPoints.length === 0 && !searchingLocations && city && area && (
                  <p className="text-sm text-muted-foreground text-center italic">
                    Click "Find" to see available safe locations in your area.
                  </p>
                )}

              </CardContent>
            </Card>


            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting Request...
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

export default RequestBook;
