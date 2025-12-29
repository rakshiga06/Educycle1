import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, MessageCircle, MapPin, Loader2 } from 'lucide-react';
import { requestsApi, booksApi } from '@/lib/api';
import { BookRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const statusConfig = {
  pending: {
    variant: 'pending' as const,
    icon: Clock,
    label: 'Pending',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  approved: {
    variant: 'approved' as const,
    icon: CheckCircle,
    label: 'Approved',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  rejected: {
    variant: 'rejected' as const,
    icon: XCircle,
    label: 'Rejected',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

const RequestStatus = () => {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [bookTitles, setBookTitles] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await requestsApi.list() as BookRequest[];
      const requestsList = Array.isArray(data) ? data : [];
      setRequests(requestsList);
      
      // Load book titles for each request
      const titles: Record<string, string> = {};
      for (const req of requestsList) {
        try {
          const book = await booksApi.getById(req.book_id) as any;
          titles[req.id] = book.title || 'Unknown Book';
        } catch {
          titles[req.id] = 'Unknown Book';
        }
      }
      setBookTitles(titles);
    } catch (error: any) {
      console.error('Error loading requests:', error);
      toast({
        title: 'Error loading requests',
        description: error.message || 'Failed to fetch requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = selectedStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === selectedStatus);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-display font-bold mb-2">My Requests</h1>
        <p className="text-muted-foreground mb-8">
          Track the status of your book requests
        </p>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Badge 
            variant={selectedStatus === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSelectedStatus('all')}
          >
            All ({requests.length})
          </Badge>
          <Badge 
            variant={selectedStatus === 'pending' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSelectedStatus('pending')}
          >
            Pending ({requests.filter(r => r.status === 'pending').length})
          </Badge>
          <Badge 
            variant={selectedStatus === 'approved' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSelectedStatus('approved')}
          >
            Approved ({requests.filter(r => r.status === 'approved').length})
          </Badge>
          <Badge 
            variant={selectedStatus === 'rejected' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setSelectedStatus('rejected')}
          >
            Rejected ({requests.filter(r => r.status === 'rejected').length})
          </Badge>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Request Cards */}
        {!loading && filteredRequests.length > 0 && (
          <div className="space-y-4">
            {filteredRequests.map(request => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;

            return (
              <Card key={request.id} variant="elevated">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-xl ${status.bgColor} flex items-center justify-center shrink-0`}>
                      <StatusIcon className={`h-6 w-6 ${status.color}`} />
                    </div>

                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display font-bold text-lg truncate">
                          {bookTitles[request.id] || 'Loading...'}
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Requested on {request.created_at ? new Date(request.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {request.status === 'approved' && (
                        <>
                          <Link to={`/chat/${request.id}`}>
                            <Button size="sm" className="gap-1">
                              <MessageCircle className="h-4 w-4" />
                              Chat
                            </Button>
                          </Link>
                          <Link to={`/pickup/${request.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <MapPin className="h-4 w-4" />
                              Pickup
                            </Button>
                          </Link>
                        </>
                      )}
                      {request.status === 'pending' && (
                        <Button variant="outline" size="sm" disabled>
                          Awaiting Response
                        </Button>
                      )}
                      {request.status === 'rejected' && (
                        <Link to="/search-books">
                          <Button variant="outline" size="sm">
                            Find Similar Books
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            );
          })}
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by finding books you need
            </p>
            <Link to="/search-books">
              <Button>Find Books</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RequestStatus;
