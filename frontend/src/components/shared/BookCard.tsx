import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye } from 'lucide-react';
import { Book } from '@/types/api';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  linkPrefix?: string;
}

const conditionVariant: Record<string, 'good' | 'usable' | 'damaged'> = {
  good: 'good',
  usable: 'usable',
  damaged: 'damaged',
  Good: 'good',
  Usable: 'usable',
  Damaged: 'damaged',
};

const BookCard = ({ book, linkPrefix = '/book' }: BookCardProps) => {
  const coverImage = book.image_urls?.[0] || '/placeholder.svg';
  const condition = book.condition || 'usable';
  const conditionKey = conditionVariant[condition] || 'usable';

  return (
    <Card variant="elevated" className="overflow-hidden group">
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        <img
          src={coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-3 inset-x-3 flex justify-between items-start">
          {book.is_set && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground border-none shadow-sm">
              Full Set
            </Badge>
          )}
          <div className="flex-1" />
          <Badge
            variant={conditionKey}
          >
            {condition}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-bold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{book.subject} • Class {book.class_level}</span>
            <span>{book.board}</span>
          </div>
          {book.area && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{book.area}{book.city ? `, ${book.city}` : ''}</span>
            </div>
          )}
          {book.donor_name && (
            <div className="flex items-center gap-1 font-medium text-foreground/80">
              <span className="text-[10px] uppercase text-muted-foreground mr-1">Donor:</span>
              <span className="truncate">{book.donor_name}</span>
            </div>
          )}
        </div>
        <Link to={`${linkPrefix}/${book.id}`}>
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
