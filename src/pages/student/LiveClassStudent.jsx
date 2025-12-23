import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ChatWindow } from '@/components/ChatWindow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, VideoOff, Mic, MicOff, Phone, MessageSquare, Hand } from 'lucide-react';

export default function LiveClassStudent() {
  const { classId } = useParams();
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [handRaised, setHandRaised] = useState(false);

  return (
    <div className="min-h-screen bg-sidebar flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src={`https://meet.jit.si/rural-classroom-connect-${classId}`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full min-h-[500px]"
              style={{ border: 0 }}
              title="Live Class"
            />
          </div>
          <Card className="bg-card">
            <CardContent className="py-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                You are in class: <span className="font-mono font-bold">{classId}</span>
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Leave Class
              </Button>
            </CardContent>
          </Card>
        </div>
        {showChat && <ChatWindow className="w-full lg:w-80 min-h-[300px]" title="Class Chat" />}
      </div>
    </div>
  );
}
