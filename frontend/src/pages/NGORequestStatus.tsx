import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  completed: {
    variant: 'completed' as const,
    icon: CheckCircle,
    label: 'Completed',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
};

const NGORequestStatus = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [bookTitles, setBookTitles] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && role === 'student') {
      navigate('/request-status');
    }
  }, [role, authLoading, navigate]);

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

  const handleApprove = async (requestId: string) => {
    try {
      await requestsApi.approve(requestId);
      toast({
        title: "Request Approved!",
        description: "You can now chat with the student to arrange pickup.",
      });
      loadRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await requestsApi.updateStatus(requestId, 'rejected');
      toast({
        title: "Request Rejected",
        description: "The requester has been notified.",
      });
      loadRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      await requestsApi.complete(requestId);
      toast({
        title: "Success!",
        description: "Book marked as collected. Thank you for using EduCycle!",
      });
      navigate(`/feedback/${requestId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete request",
        variant: "destructive",
      });
    }
  };

  const myRequests = requests.filter(r => r.requester_uid === user?.uid && r.status !== 'completed');
  const incomingRequests = requests.filter(r => r.donor_uid === user?.uid);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-display font-bold mb-2">NGO Book Requests</h1>
        <p className="text-muted-foreground mb-8">
          Track and manage your organization's book requests
        </p>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Badge
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              className="cursor-pointer capitalize px-4 py-1.5"
              onClick={() => setSelectedStatus(status)}
            >
              {status} ({status === 'all' ? requests.length : requests.filter(r => r.status === status).length})
            </Badge>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Outgoing Requests Section */}
        <div className="mb-12">
          <h2 className="text-xl font-display font-bold mb-4">Books I've Requested</h2>
          {!loading && myRequests.length > 0 && (
            <div className="space-y-4">
              {myRequests.filter(r => selectedStatus === 'all' || r.status === selectedStatus).map((request: any) => {
                const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Card key={request.id} variant="elevated">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${status.bgColor} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`h-6 w-6 ${status.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-display font-bold text-lg truncate">
                              {bookTitles[request.id] || 'Loading...'}
                            </h3>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Requested on {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                          {request.donor_name && (
                            <p className="text-sm font-medium flex items-center gap-1 mb-1">
                              Donor: <span className="text-foreground">{request.donor_name}</span>
                            </p>
                          )}
                          {request.donor_location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3" /> {request.donor_location}
                            </p>
                          )}
                          <p className="text-sm font-medium mb-1">
                            Quantity: {request.quantity || 1}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {request.status === 'approved' && (
                            <>
                              <Link to={`/chat/${request.id}`}>
                                <Button size="sm" className="gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  Chat
                                </Button>
                              </Link>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="gap-1"
                                onClick={() => handleComplete(request.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Mark as Collected
                              </Button>
                            </>
                          )}
                          {request.status === 'pending' && (
                            <Button variant="outline" size="sm" disabled>
                              Awaiting Response
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {!loading && myRequests.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No book requests made yet.</p>
          )}
        </div>

        {/* Incoming Requests Section (For Donors) */}
        {!loading && incomingRequests.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-display font-bold mb-4">Requests for My Books</h2>
            <div className="space-y-4">
              {incomingRequests.filter(r => selectedStatus === 'all' || r.status === selectedStatus).map((request: any) => {
                const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Card key={request.id} variant="elevated" className="border-l-4 border-l-primary">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${status.bgColor} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`h-6 w-6 ${status.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-display font-bold text-lg truncate">
                              {bookTitles[request.id] || 'Loading...'}
                            </h3>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <div className="flex flex-col gap-1 mb-2">
                            <p className="text-sm font-medium text-foreground">
                              Requested by: {request.requester_name || 'Anonymous'}
                            </p>
                            {request.requester_location && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {request.requester_location}
                              </p>
                            )}
                          </div>
                          {request.reason && (
                            <p className="text-sm italic text-muted-foreground mb-2">
                              "{request.reason}"
                            </p>
                          )}
                          {(request.quantity > 1) && (
                            <p className="text-sm font-medium mb-1">
                              Quantity: {request.quantity}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Pickup Preference: <span className="capitalize font-medium">{request.pickup_location || 'Not specified'}</span>
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                                className="bg-success hover:bg-success/90 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(request.id)}
                                className="text-destructive border-destructive hover:bg-destructive/5"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Link to={`/chat/${request.id}`}>
                              <Button size="sm" className="gap-1">
                                <MessageCircle className="h-4 w-4" />
                                Chat
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NGORequestStatus;
