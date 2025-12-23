import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ChatWindow } from '@/components/ChatWindow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Phone,
  Users,
  MessageSquare,
  Settings,
  Hand,
} from 'lucide-react';

export default function LiveClassTeacher() {
  const { classId } = useParams();
  const { user } = useAuth();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);

  const participants = [
    { name: 'Rahul Kumar', hand: true },
    { name: 'Priya Singh', hand: false },
    { name: 'Amit Patel', hand: false },
    { name: 'Sneha Gupta', hand: true },
    { name: 'Vikram Shah', hand: false },
  ];

  const raisedHands = participants.filter(p => p.hand);

  return (
    <div className="min-h-screen bg-sidebar flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Video Area */}
          <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src={`https://meet.jit.si/rural-classroom-connect-${classId}`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full min-h-[500px]"
              style={{ border: 0 }}
              title="Alive Class"
            />
          </div>

          <Card className="bg-card">
            <CardContent className="py-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Classroom ID: <span className="font-mono font-bold">{classId}</span>
              </p>
              <Button variant="destructive" onClick={() => window.close()}>
                End Class
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat/Participants */}
        {(showChat || showParticipants) && (
          <div className="w-full lg:w-80 flex flex-col gap-4">
            {showParticipants && (
              <Card className="flex-shrink-0">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Participants ({participants.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {participants.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                        <span className="text-sm">{p.name}</span>
                        {p.hand && <Hand className="h-4 w-4 text-warning" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {showChat && (
              <ChatWindow className="flex-1 min-h-[300px]" title="Class Chat" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
