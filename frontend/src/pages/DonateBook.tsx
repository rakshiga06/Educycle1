import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Upload, CheckCircle, Camera, Loader2, Shield, Search, MapPin } from 'lucide-react';
import { boardOptions, subjectOptions, classOptions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { booksApi, locationApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const conditionOptions = [
  { id: 'good', label: 'Good', description: 'No damage, clean pages' },
  { id: 'usable', label: 'Usable', description: 'Minor wear, still readable' },
  { id: 'damaged', label: 'Damaged', description: 'Some torn pages or marks' },
];

const DonateBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [donationType, setDonationType] = useState<'single' | 'set'>('single');
  const [bookName, setBookName] = useState('');
  const [subject, setSubject] = useState('');
  const [bookClass, setBookClass] = useState('');
  const [board, setBoard] = useState('');
  const [condition, setCondition] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Safe Location Search State
  const [searchingLocations, setSearchingLocations] = useState(false);
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
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

  const handleSelectPickup = (point: any) => {
    setSelectedPickupPoint(point);
    setCity(point.city);
    setArea(point.area);
    toast({
      title: "Safe Location Selected",
      description: `You can drop off the book at ${point.name}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((donationType === 'single' && !bookName) || !bookClass || !board || !condition || images.length === 0) {
      toast({
        title: "Please fill all required fields",
        description: "Class, Board, Condition and at least one image are mandatory.",
        variant: "destructive",
      });
      return;
    }

    if (donationType === 'single' && !subject) {
      toast({
        title: "Subject required",
        description: "Please select a subject for the single book.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to donate a book",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      let finalDescription = description;
      let pickupInfo = undefined;

      if (selectedPickupPoint) {
        pickupInfo = `Verified Drop-off Point: ${selectedPickupPoint.name}`;
        finalDescription = description ? `${description}\n\n${pickupInfo}` : pickupInfo;
      }

      const bookData = {
        title: donationType === 'set' ? `Complete Class ${bookClass} Book Set` : bookName,
        subject: donationType === 'set' ? 'Full Set' : subject,
        class_level: bookClass,
        board,
        condition: condition.toLowerCase(),
        city: city || undefined,
        area: area || undefined,
        description: finalDescription,
        pickup_location: selectedPickupPoint ? selectedPickupPoint.name : undefined,
        is_set: donationType === 'set',
      };

      await booksApi.donate(bookData, images);

      setSubmitted(true);
      toast({
        title: "Book listed for donation!",
        description: "Students in need can now see your book.",
      });
    } catch (error: any) {
      console.error('Error donating book:', error);
      toast({
        title: "Error donating book",
        description: error.message || 'Failed to donate book',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header userType="student" />
        <main className="flex-1 container py-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Book Listed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your generosity! Your book is now visible to students who need it.
              You'll earn <strong className="text-primary">50 EduCredits</strong> when someone receives it.
            </p>

            <Card variant="stat" className="mb-8">
              <CardContent className="p-6 text-left">
                <h3 className="font-display font-bold mb-2">{bookName}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{subject}</span>
                  <span>•</span>
                  <span>Class {bookClass}</span>
                  <span>•</span>
                  <span>{board}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSubmitted(false)}>
                <Gift className="h-4 w-4 mr-2" />
                Donate Another Book
              </Button>
              <Button variant="outline" onClick={() => navigate('/student-home')}>
                Back to Home
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
      <Header userType="student" />

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Gift className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Donate Books</h1>
              <p className="text-muted-foreground">
                Help fellow students by sharing books you no longer need
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setDonationType('single')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${donationType === 'single'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${donationType === 'single' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <Gift className="h-5 w-5" />
                </div>
                <span className="font-bold">Single Book</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                Donate one specific textbook or notebook
              </p>
            </button>
            <button
              onClick={() => setDonationType('set')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${donationType === 'set'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${donationType === 'set' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <Gift className="h-5 w-5" />
                </div>
                <span className="font-bold">Full Class Set</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                Donate all books for a specific grade/year
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Details */}
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {donationType === 'single' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Book Name</label>
                      <Input
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        placeholder="E.g., Mathematics for Class 10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <div className="flex flex-wrap gap-2">
                        {subjectOptions.slice(0, 6).map(s => (
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
                  </>
                )}

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
              </CardContent>
            </Card>

            {/* Condition */}
            <Card>
              <CardHeader>
                <CardTitle>Book Condition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {conditionOptions.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${condition === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                      }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={option.id}
                      checked={condition === option.id}
                      onChange={(e) => setCondition(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${condition === option.id ? 'border-primary' : 'border-muted-foreground/30'
                      }`}>
                      {condition === option.id && (
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

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Add Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">
                      {donationType === 'set' ? 'Upload photos of the entire set' : 'Upload photos of the book'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Show the covers and current condition
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Max 5 photos • JPG, PNG
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safe Drop-off Location */}
            <Card className="overflow-hidden border-2 border-primary/20">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Find Safe Drop-off Location (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select a nearby verified NGO to drop off your book safely.
                </p>
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
                              setPickupPoints(result.pickup_points);

                              // Auto-fill address if detected
                              if (result.user_location && (result.user_location as any).detected_address) {
                                const addr = (result.user_location as any).detected_address;
                                if (addr.city) setCity(addr.city);
                                if (addr.area) setArea(addr.area);
                                toast({ title: "Location Detected", description: `Searching near ${addr.area}, ${addr.city}` });
                              } else {
                                toast({ title: "Location Detected", description: "Found nearby pickup points." });
                              }

                              if (result.pickup_points.length === 0) {
                                toast({ title: "No NGOs found nearby", description: "Try increasing search radius" });
                              }
                            } catch (e: any) {
                              toast({ title: "Location Error", description: e.message, variant: "destructive" });
                            } finally {
                              setSearchingLocations(false);
                            }
                          }, async (error) => {
                            // On permission error, try IP fallback
                            setSearchingLocations(true);
                            try {
                              const result = await locationApi.searchPickupPoints();
                              setPickupPoints(result.pickup_points);
                              
                              if (result.user_location && (result.user_location as any).detected_address) {
                                const addr = (result.user_location as any).detected_address;
                                if (addr.city) setCity(addr.city);
                                if (addr.area) setArea(addr.area);
                                toast({ 
                                  title: "Location Detected via IP", 
                                  description: `Permission denied, but found location near ${addr.area || addr.city}.` 
                                });
                              }
                            } catch (fallbackError) {
                                setSearchingLocations(false);
                                let errorMessage = "Please enter city/area manually.";
                                let errorTitle = "Location Access Denied";
                                
                                switch(error.code) {
                                  case 1: // PERMISSION_DENIED
                                    errorTitle = "Permission Denied";
                                    errorMessage = "Please enable location access in settings or enter address manually.";
                                    break;
                                }
                                
                                toast({ 
                                  title: errorTitle, 
                                  description: errorMessage, 
                                  variant: "destructive" 
                                });
                            } finally {
                              setSearchingLocations(false);
                            }
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Area</label>
                    <Input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Bandra"
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
                    <p className="text-sm text-muted-foreground font-medium">Select a drop-off point:</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {pickupPoints.map((point) => (
                        <div
                          key={point.uid}
                          onClick={() => handleSelectPickup(point)}
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

                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details about the book..."
                    className="w-full h-24 px-4 py-3 rounded-lg border-2 border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
              By donating, you agree to our <Link to="/safety" className="text-primary font-bold hover:underline">Safety Guidelines</Link>.
              Always prioritize meeting at verified NGO locations or safe public spaces for the book handover.
            </div>

            <Button type="submit" size="lg" className="w-full" variant="secondary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  {donationType === 'set' ? 'List Book Set for Donation' : 'List Book for Donation'}
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

export default DonateBook;
