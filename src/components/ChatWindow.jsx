import { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


const dummyMessages = [
  { id: '1', sender: 'Dr. Priya Sharma', message: 'Welcome to today\'s live session!', time: '10:00 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: '2', sender: 'Rahul Kumar', message: 'Good morning, ma\'am!', time: '10:01 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: '3', sender: 'Amit Patel', message: 'Can we start with the doubts from last class?', time: '10:02 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
  { id: '4', sender: 'Dr. Priya Sharma', message: 'Sure, let me address those first. The time complexity we discussed...', time: '10:03 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: '5', sender: 'You', message: 'Thank you for the explanation!', time: '10:05 AM', isOwn: true },
];

export function ChatWindow({
  messages = dummyMessages,
  onSendMessage,
  className,
  title = 'Live Chat',
}) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage && onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className={cn('flex flex-col h-full bg-card rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.isOwn && 'flex-row-reverse'
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={msg.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {msg.sender.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={cn('flex-1 max-w-[80%]', msg.isOwn && 'flex flex-col items-end')}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2 text-sm',
                    msg.isOwn
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  )}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
