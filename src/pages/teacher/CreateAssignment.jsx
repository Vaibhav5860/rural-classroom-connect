import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { teacherAPI } from '@/api/teacherAPI';
import { ClipboardList, Loader2, Calendar, Check } from 'lucide-react';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    description: '',
    dueDate: '',
    maxMarks: '100',
  });

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await teacherAPI.getClasses();
        setClasses(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch classes.",
          variant: "destructive"
        });
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await teacherAPI.createAssignment({
        classId: formData.classId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
      });

      setIsSuccess(true);

      toast({
        title: 'Assignment Created!',
        description: 'Your assignment has been created successfully.',
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assignment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      title: '',
      classId: '',
      description: '',
      dueDate: '',
      maxMarks: '100',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Create Assignment
              </h1>
              <p className="text-muted-foreground mt-1">
                Create and publish assignments for your students
              </p>
            </div>

            {isSuccess ? (
              <Card className="animate-slide-up">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mx-auto mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                      Assignment Created!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Students will be notified about the new assignment
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={resetForm}>
                        Create Another
                      </Button>
                      <Button onClick={() => navigate('/teacher/submissions')}>
                        View Submissions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Assignment Details</CardTitle>
                      <CardDescription>Fill in the assignment information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="class">Select Class</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(value) => setFormData({ ...formData, classId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls._id} value={cls._id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Implement a Binary Search Tree"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Detailed instructions for the assignment..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxMarks">Maximum Marks</Label>
                        <Input
                          id="maxMarks"
                          type="number"
                          placeholder="100"
                          value={formData.maxMarks}
                          onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Assignment...
                        </>
                      ) : (
                        'Create Assignment'
                      )}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
