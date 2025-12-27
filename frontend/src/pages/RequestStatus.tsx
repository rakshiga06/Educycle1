import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, MessageCircle, MapPin } from 'lucide-react';
import { mockRequests } from '@/data/mockData';

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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" userName="Alex" />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-display font-bold mb-2">My Requests</h1>
        <p className="text-muted-foreground mb-8">
          Track the status of your book requests
        </p>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Badge variant="default" className="cursor-pointer">All ({mockRequests.length})</Badge>
          <Badge variant="outline" className="cursor-pointer">
            Pending ({mockRequests.filter(r => r.status === 'pending').length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Approved ({mockRequests.filter(r => r.status === 'approved').length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Rejected ({mockRequests.filter(r => r.status === 'rejected').length})
          </Badge>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {mockRequests.map(request => {
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
                          {request.bookTitle}
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Requested on {new Date(request.requestDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        <strong>Reason:</strong> {request.reason}
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
                          {request.pickupLocation && (
                            <Link to={`/pickup/${request.id}`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <MapPin className="h-4 w-4" />
                                Pickup
                              </Button>
                            </Link>
                          )}
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

                  {/* Approved Details */}
                  {request.status === 'approved' && request.pickupLocation && (
                    <div className="mt-4 p-3 rounded-lg bg-success/5 border border-success/20 flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-success shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium">Pickup Location: {request.pickupLocation}</p>
                        {request.pickupDate && (
                          <p className="text-muted-foreground">
                            Scheduled: {new Date(request.pickupDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {mockRequests.length === 0 && (
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
