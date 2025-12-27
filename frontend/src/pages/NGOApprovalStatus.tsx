import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import { mockBulkRequests } from '@/data/mockData';

const statusConfig = {
  pending: {
    variant: 'pending' as const,
    icon: Clock,
    label: 'Pending',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  partial: {
    variant: 'approved' as const,
    icon: Package,
    label: 'Partial',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  fulfilled: {
    variant: 'approved' as const,
    icon: CheckCircle,
    label: 'Fulfilled',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

const NGOApprovalStatus = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="ngo" userName="Hope Foundation" />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-display font-bold mb-2">Request Status</h1>
        <p className="text-muted-foreground mb-8">
          Track the status of your bulk book requests
        </p>

        {/* Request Cards */}
        <div className="space-y-4">
          {mockBulkRequests.map(request => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            const progress = (request.fulfilled / request.quantity) * 100;

            return (
              <Card key={request.id} variant="elevated">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-xl ${status.bgColor} flex items-center justify-center shrink-0`}>
                      <StatusIcon className={`h-6 w-6 ${status.color}`} />
                    </div>

                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display font-bold text-lg">
                          {request.subject} - Class {request.class} ({request.board})
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        Requested: {request.quantity} books • {request.reason}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Fulfilled</span>
                          <span className="font-medium">{request.fulfilled} / {request.quantity}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Requested on {new Date(request.requestDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0">
                      {request.status === 'partial' && (
                        <Link to="/ngo-collection">
                          <Button size="sm" className="gap-1">
                            <MapPin className="h-4 w-4" />
                            View Pickups
                          </Button>
                        </Link>
                      )}
                      {request.status === 'fulfilled' && (
                        <Link to="/ngo-distribution">
                          <Button variant="outline" size="sm">
                            Distribute Books
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

        {mockBulkRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a bulk request to get books for your students
            </p>
            <Link to="/bulk-request">
              <Button>Create Request</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NGOApprovalStatus;
