import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/shared/BookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { classOptions, boardOptions, subjectOptions } from '@/data/mockData';
import { booksApi } from '@/lib/api';
import { Book } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

const SearchBooks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBooks();
  }, [selectedClass, selectedBoard, selectedSubject]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const filters: Record<string, string> = {};
      if (selectedClass) filters.class_level = selectedClass;
      if (selectedBoard) filters.board = selectedBoard;
      if (selectedSubject) filters.subject = selectedSubject;
      
      const data = await booksApi.search(filters);
      setBooks(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading books:', error);
      toast({
        title: 'Error loading books',
        description: error.message || 'Failed to fetch books',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return book.title.toLowerCase().includes(query) ||
           book.subject.toLowerCase().includes(query);
  });

  const clearFilters = () => {
    setSelectedClass('');
    setSelectedBoard('');
    setSelectedSubject('');
  };

  const hasActiveFilters = selectedClass || selectedBoard || selectedSubject;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />

      <main className="flex-1 container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Find Your Textbooks</h1>
          <p className="text-muted-foreground">
            Browse available books from students near you. All books are free!
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by book name, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                {[selectedClass, selectedBoard, selectedSubject].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-card rounded-xl border border-border animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold">Filter Books</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Class Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Class</label>
                <div className="flex flex-wrap gap-2">
                  {classOptions.slice(0, 6).map(cls => (
                    <Badge
                      key={cls}
                      variant={selectedClass === cls ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedClass(selectedClass === cls ? '' : cls)}
                    >
                      {cls}
                    </Badge>
                  ))}
                  {classOptions.slice(6).map(cls => (
                    <Badge
                      key={cls}
                      variant={selectedClass === cls ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedClass(selectedClass === cls ? '' : cls)}
                    >
                      {cls}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Board Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Board</label>
                <div className="flex flex-wrap gap-2">
                  {boardOptions.map(board => (
                    <Badge
                      key={board}
                      variant={selectedBoard === board ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedBoard(selectedBoard === board ? '' : board)}
                    >
                      {board}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.slice(0, 4).map(subject => (
                    <Badge
                      key={subject}
                      variant={selectedSubject === subject ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedSubject(selectedSubject === subject ? '' : subject)}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredBooks.length} books near you
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">No books found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search for something else
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchBooks;
