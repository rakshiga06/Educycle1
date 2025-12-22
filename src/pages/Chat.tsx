import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Shield, AlertCircle } from 'lucide-react';
import { mockChatMessages, mockRequests } from '@/data/mockData';

const Chat = () => {
  const { requestId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockChatMessages);

  const request = mockRequests.find(r => r.id === requestId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: `msg${messages.length + 1}`,
        senderId: 'student1',
        senderName: 'You',
        message: message.trim(),
        timestamp: new Date().toLocaleString(),
      }
    ]);
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userType="student" userName="Alex" />
      
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
                  <h2 className="font-display font-bold">{request?.bookTitle || 'Book Request'}</h2>
                  <p className="text-sm text-muted-foreground">Chat with donor to arrange pickup</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'student1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.senderId === 'student1'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 opacity-80">{msg.senderName}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>

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
