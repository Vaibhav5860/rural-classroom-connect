import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teacherAPI } from '@/api/teacherAPI';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Clock, AlertCircle, Search, Download, Eye } from 'lucide-react';

// interface Submission {
//   id: string;
//   studentName: string;
//   submittedAt: string | null;
//   status: 'submitted' | 'graded' | 'pending';
//   grade: number | null;
// }

export default function ViewSubmissions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await teacherAPI.getAllAssignments();
        setAssignments(data);
        if (data.length > 0) {
          setSelectedAssignment(data[0]._id);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch assignments.",
          variant: "destructive"
        });
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedAssignment) return;
      try {
        const { data } = await teacherAPI.getSubmissions(selectedAssignment);
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };
    fetchSubmissions();
  }, [selectedAssignment]);



  const filteredSubmissions = submissions.filter((sub) =>
    sub.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGrade = async () => {
    if (!selectedSubmission) return;

    try {
      await teacherAPI.gradeSubmission(
        selectedSubmission._id,
        parseInt(gradeData.grade),
        gradeData.feedback
      );
      toast({
        title: 'Graded!',
        description: `Successfully graded ${selectedSubmission.student?.name}'s submission.`,
      });
      setGradeDialogOpen(false);
      // Update local state
      setSubmissions(submissions.map(sub =>
        sub._id === selectedSubmission._id
          ? { ...sub, status: 'graded', grade: parseInt(gradeData.grade) }
          : sub
      ));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to grade submission.',
        variant: 'destructive',
      });
    }
  };

  const openGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({ grade: submission.grade?.toString() || '', feedback: '' });
    setGradeDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'graded':
        return <Badge className="bg-success/10 text-success border-0">Graded</Badge>;
      case 'submitted':
        return <Badge className="bg-info/10 text-info border-0">Submitted</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-0">Pending</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'submitted':
        return <Clock className="h-5 w-5 text-info" />;
      default:
        return <AlertCircle className="h-5 w-5 text-warning" />;
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              View Submissions
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and grade student submissions
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignment" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                          <SelectItem key={assignment._id} value={assignment._id}>
                            {assignment.title} {assignment.class?.name ? `- ${assignment.class.name}` : ''}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-assignments">
                          No assignments found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {submissions.filter(s => s.status === 'graded').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Graded</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-info">
                    {submissions.filter(s => s.status === 'submitted').length}
                  </p>
                  <p className="text-sm text-muted-foreground">To Review</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">
                    {submissions.filter(s => s.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(submission.status)}
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.student?.name}`} />
                        <AvatarFallback>{submission.student?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{submission.student?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.submittedAt
                            ? `Submitted: ${new Date(submission.submittedAt).toLocaleDateString()}`
                            : 'Not submitted yet'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(submission.status)}
                      {submission.grade !== null && (
                        <span className="font-bold text-foreground">{submission.grade}/100</span>
                      )}
                      <div className="flex gap-2">
                        {submission.fileUrl && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}${submission.fileUrl}`, '_blank')}
                              title="View Submission"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" asChild title="Download Submission">
                              <a href={`${import.meta.env.VITE_API_BASE_URL}${submission.fileUrl}`} download target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </>
                        )}
                        {submission.status !== 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => openGradeDialog(submission)}
                          >
                            {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Dialog */}
          <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grade Submission</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission?.student?.name}`} />
                    <AvatarFallback>{selectedSubmission?.student?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedSubmission?.student?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {selectedSubmission?.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (out of 100)</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.grade}
                    onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback (optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide feedback for the student..."
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGrade}>Save Grade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
