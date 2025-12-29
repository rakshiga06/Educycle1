import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Upload, CheckCircle, Camera, Loader2 } from 'lucide-react';
import { boardOptions, subjectOptions, classOptions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { booksApi } from '@/lib/api';
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookName || !subject || !bookClass || !board || !condition || images.length === 0) {
      toast({
        title: "Please fill all fields",
        description: "All fields including at least one image are required",
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
      const bookData = {
        title: bookName,
        subject,
        class_level: bookClass,
        board,
        condition: condition.toLowerCase(),
        city: city || undefined,
        area: area || undefined,
        description: description || undefined,
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
              <h1 className="text-3xl font-display font-bold">Donate a Book</h1>
              <p className="text-muted-foreground">
                Help a fellow student by sharing books you no longer need
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Details */}
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class</label>
                    <div className="flex flex-wrap gap-2">
                      {classOptions.slice(6).map(c => (
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
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      condition === option.id 
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
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      condition === option.id ? 'border-primary' : 'border-muted-foreground/30'
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
                    <p className="text-sm text-muted-foreground">
                      Upload photos of the book cover and inside pages
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 5 photos • JPG, PNG up to 5MB each
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

            {/* Location (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Location (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="E.g., Mumbai"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Area</label>
                  <Input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="E.g., Andheri West"
                  />
                </div>
                <div>
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

            <Button type="submit" size="lg" className="w-full" variant="secondary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Gift className="h-5 w-5 mr-2" />
                  List Book for Donation
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
