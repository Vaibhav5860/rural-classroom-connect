import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Megaphone, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { classAPI } from '@/api/classAPI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useConfirm } from '@/components/ConfirmProvider';

export default function Announcements() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', important: false });
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const confirm = useConfirm();

  const fetchAnnouncements = async () => {
    try {
      const { data } = await classAPI.getGlobalAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async () => {
    try {
      await classAPI.createGlobalAnnouncement(newAnnouncement);
      toast({ title: 'Announcement created' });
      setIsDialogOpen(false);
      setNewAnnouncement({ title: '', content: '', important: false });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Failed to create', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const ok = await confirm({ title: 'Delete announcement', description: 'Are you sure you want to delete this announcement?', confirmText: 'Delete', cancelText: 'Cancel' });
      if (!ok) return;
      await classAPI.deleteAnnouncement(id);
      toast({ title: 'Announcement deleted' });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Global Announcements</h1>
            {isTeacher && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        placeholder="Announcement Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        placeholder="Write your announcement here..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="important"
                        checked={newAnnouncement.important}
                        onCheckedChange={(checked) => setNewAnnouncement({ ...newAnnouncement, important: checked })}
                      />
                      <Label htmlFor="important">Mark as Important</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreate} disabled={!newAnnouncement.title || !newAnnouncement.content}>Post</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">No announcements yet.</p>
            ) : (
              announcements.map((a) => (
                <Card key={a._id} className={a.important ? 'border-warning/50' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {a.important && <AlertCircle className="h-5 w-5 text-warning" />}
                        <CardTitle className="text-lg">{a.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.important && <Badge className="bg-warning/10 text-warning">Important</Badge>}
                        {isTeacher && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(a._id)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 whitespace-pre-wrap">{a.content}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Posted by {a.author?.name || 'Admin'}</span>
                      <span>{new Date(a.date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
