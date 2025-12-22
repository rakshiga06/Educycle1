import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye } from 'lucide-react';
import { Book } from '@/data/mockData';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const conditionVariant = {
  Good: 'good' as const,
  Usable: 'usable' as const,
  Damaged: 'damaged' as const,
};

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Card variant="elevated" className="overflow-hidden group">
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge 
          variant={conditionVariant[book.condition]}
          className="absolute top-3 right-3"
        >
          {book.condition}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-bold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{book.subject} • Class {book.class}</span>
            <span>{book.board}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{book.edition}</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{book.distance}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 pt-1">
            <Star className="h-3 w-3 text-warning fill-warning" />
            <span className="font-medium text-foreground">{book.donorReputation}</span>
            <span className="text-muted-foreground">• {book.donorName}</span>
          </div>
        </div>
        <Link to={`/book/${book.id}`}>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BookCard;
