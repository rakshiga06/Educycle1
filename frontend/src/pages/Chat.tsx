import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { chatsApi, requestsApi, booksApi } from '@/lib/api';
import { ChatMessage, BookRequest } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const { requestId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [request, setRequest] = useState<BookRequest | null>(null);
  const [bookTitle, setBookTitle] = useState('Book Request');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (requestId && user) {
      loadChat();
    }
  }, [requestId, user]);

  const loadChat = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      const reqData = await requestsApi.getById(requestId) as any;
      setRequest(reqData as BookRequest);

      // Load book title
      try {
        const book = await booksApi.getById(reqData.book_id) as any;
        setBookTitle(book.title);
      } catch { }

      // Load messages using requestId as chatId (they're the same)
      const messagesData = await chatsApi.getMessages(requestId);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error: any) {
      console.error('Error loading chat:', error);
      toast({
        title: 'Error loading chat',
        description: error.message || 'Failed to load chat',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !requestId || !user) return;

    try {
      setSending(true);
      await chatsApi.sendMessage(requestId, message.trim());
      setMessage('');
      // Reload messages
      const messagesData = await chatsApi.getMessages(requestId);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" />

      <main className="flex-1 container py-8 flex flex-col">
        <Link to="/request-status" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <Card variant="outlined" className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold">{bookTitle}</h2>
                  <p className="text-sm text-muted-foreground">Chat with donor to arrange pickup</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Safety Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mb-4">
            <Shield className="h-5 w-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Safe Communication</p>
              <p className="text-muted-foreground">
                Only discuss pickup date, time, and verified location. Never share personal contact info.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          {!loading && (
            <Card className="flex-1 flex flex-col">
              <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                {messages.map(msg => {
                  const isOwn = msg.sender_uid === user?.uid;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                          }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={request?.status === 'approved' ? "Type your message..." : "Chat disabled until request is approved"}
                    className="flex-1"
                    disabled={sending || request?.status !== 'approved'}
                  />
                  <Button type="submit" size="icon" disabled={sending || !message.trim() || request?.status !== 'approved'}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setMessage("Can we meet tomorrow at 4 PM?")}>
              Suggest time
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMessage("Which pickup location works for you?")}>
              Ask location
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMessage("I'm on my way!")}>
              On my way
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
