import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { studentAPI } from '@/api/studentAPI';
import { toast } from '@/hooks/use-toast';
import { Search, Plus, BookOpen, Users, Clock, Video } from 'lucide-react';

// interface ClassItem {
//   id: string;
//   name: string;
//   teacher: string;
//   subject: string;
//   progress: number;
// }

export default function ClassList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await studentAPI.getEnrolledClasses();
      setClasses(data);
    };
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinClass = async () => {
    try {
      await studentAPI.joinClass(classCode);
      toast({
        title: 'Success!',
        description: 'You have successfully joined the class.',
      });
      setJoinDialogOpen(false);
      setClassCode('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid class code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  My Classes
                </h1>
                <p className="text-muted-foreground mt-1">
                  View and manage your enrolled classes
                </p>
              </div>
              <Button onClick={() => setJoinDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Join Class
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <Card
                key={cls.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                      {cls.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{cls.teacher}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      {cls.subject}
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{cls.progress}%</span>
                      </div>
                      <Progress value={cls.progress} className="h-2" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link to={`/class/${cls.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          View Class
                        </Button>
                      </Link>
                      <Link to={`/live/student/${cls.id}`}>
                        <Button size="sm" className="gap-1">
                          <Video className="h-4 w-4" />
                          Join
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No classes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try a different search term' : 'Join a class to get started'}
              </p>
              <Button onClick={() => setJoinDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Join a Class
              </Button>
            </div>
          )}

          {/* Join Class Dialog */}
          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Class</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="classCode">Class Code</Label>
                <Input
                  id="classCode"
                  placeholder="Enter class code (e.g., ABC123)"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Ask your teacher for the class code to join their class.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setJoinDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleJoinClass} disabled={!classCode.trim()}>
                  Join Class
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
