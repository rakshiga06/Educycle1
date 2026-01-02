import { useState, useEffect } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const { user, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        const data = await notificationsApi.list();
        setNotifications(data);
    };

    const handleNotificationClick = async (notification: any) => {
        await notificationsApi.markRead(notification.id);
        setNotifications(notifications.filter(n => n.id !== notification.id));

        const isNGO = role === 'ngo';
        const requestStatusPath = isNGO ? '/ngo-my-requests' : '/request-status';

        if (notification.type === 'chat' || notification.type === 'request_accepted') {
            // Both chat notifications and acceptance lead to the chat interface
            navigate(`/chat/${notification.related_id}`);
        } else if (notification.type === 'new_request') {
            // New requests go to the status/management page
            navigate(requestStatusPath);
        } else if (notification.type === 'request_rejected') {
            // Rejections go to the status page so they can see what happened
            navigate(requestStatusPath);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-semibold">Notifications</span>
                    {notifications.length > 0 && (
                        <Badge variant="secondary">{notifications.length} New</Badge>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className="px-4 py-3 cursor-pointer focus:bg-accent"
                                onClick={() => handleNotificationClick(n)}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'chat' ? 'bg-primary/10' :
                                        n.type === 'request_accepted' ? 'bg-success/10' :
                                            'bg-accent/20'
                                        }`}>
                                        {n.type === 'chat' ? (
                                            <MessageCircle className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Bell className={`h-4 w-4 ${n.type === 'request_accepted' ? 'text-success' : 'text-accent-foreground'
                                                }`} />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 w-full overflow-hidden">
                                        {n.title && (
                                            <p className="text-sm font-bold text-foreground truncate">{n.title}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {n.body || n.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => navigate('/request-status')}
                            >
                                View all requests
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;
