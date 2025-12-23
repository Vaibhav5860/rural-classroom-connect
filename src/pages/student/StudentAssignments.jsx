import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { studentAPI } from '@/api/studentAPI';
import { FileUploader } from '@/components/FileUploader';
import { toast } from '@/hooks/use-toast';
import { ClipboardList, Calendar, CheckCircle, AlertCircle, Clock, Search, Upload, FileText } from 'lucide-react';

export default function StudentAssignments() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const { data } = await studentAPI.getAllAssignments();
                // Calculate status based on simple logic for now (mocking submitted status until we have logic to check if student submitted)
                // Ideally backend should return "isSubmitted" flag.
                // For now, let's assume all are pending unless local state says otherwise (which it won't persist).
                // This is a limitation we can address if we fetch submissions status too.
                setAssignments(data);
            } catch (error) {
                console.error('Failed to fetch assignments', error);
            }
        };
        fetchAssignments();
    }, []);

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.class?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!submissionFile || !selectedAssignment) return;
        setIsSubmitting(true);
        try {
            await studentAPI.submitAssignment(selectedAssignment._id, submissionFile);
            toast({
                title: 'Assignment Submitted!',
                description: 'Your work has been uploaded successfully.',
            });
            setSubmitDialogOpen(false);
            setSubmissionFile(null);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to submit assignment. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openSubmitDialog = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmitDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="mb-8 animate-fade-in">
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                            My Assignments
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View and submit your assignments
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search assignments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredAssignments.length > 0 ? (
                            filteredAssignments.map((assignment) => (
                                <Card key={assignment._id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row md:items-center p-6 gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                        {assignment.class?.name}
                                                    </Badge>
                                                    {new Date(assignment.dueDate) < new Date() && (
                                                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0">
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold">{assignment.title}</h3>
                                                <p className="text-muted-foreground line-clamp-2">{assignment.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ClipboardList className="h-4 w-4" />
                                                        {assignment.totalPoints} Points
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <Button onClick={() => openSubmitDialog(assignment)}>
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Submit
                                                </Button>
                                                <Button variant="outline">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-muted/30 rounded-xl">
                                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-medium text-foreground mb-2">No assignments found</h3>
                                <p className="text-muted-foreground">You don't have any pending assignments.</p>
                            </div>
                        )}
                    </div>

                    <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Submit Assignment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="p-4 bg-muted rounded-lg space-y-2">
                                    <h4 className="font-medium">{selectedAssignment?.title}</h4>
                                    <p className="text-sm text-muted-foreground">{selectedAssignment?.description}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Upload Your Work</Label>
                                    <FileUploader
                                        onFileSelect={setSubmissionFile}
                                        accept=".pdf,.doc,.docx,.zip,.jpg,.png"
                                        maxSize={10}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={isSubmitting || !submissionFile}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    );
}
