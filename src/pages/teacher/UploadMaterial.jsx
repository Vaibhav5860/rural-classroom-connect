import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploader } from '@/components/FileUploader';
import { toast } from '@/hooks/use-toast';
import { teacherAPI } from '@/api/teacherAPI';
import { Upload, Loader2, FileText, Video, Image } from 'lucide-react';

export default function UploadMaterial() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    type: '',
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
    if (!formData.classId) {
      toast({
        title: 'No class selected',
        description: 'Please select a class to upload material to.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await teacherAPI.uploadMaterial(formData.classId, selectedFile, formData.title);
      toast({
        title: 'Material Uploaded!',
        description: 'Your material has been uploaded successfully.',
      });
      setSelectedFile(null);
      setFormData({ title: '', classId: '', type: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload material. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const materialTypes = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'video', label: 'Video Lecture', icon: Video },
    { value: 'image', label: 'Images/Slides', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Upload Material
              </h1>
              <p className="text-muted-foreground mt-1">
                Share study materials with your students
              </p>
            </div>

            <Card className="animate-slide-up">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Material Details</CardTitle>
                    <CardDescription>Upload PDFs, videos, or other study materials</CardDescription>
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
                    <Label htmlFor="title">Material Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Week 3 - Linked Lists"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Material Type</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {materialTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.type === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <type.icon className={`h-6 w-6 ${formData.type === type.value ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          <span className="text-xs font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <FileUploader
                      onFileSelect={setSelectedFile}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.png"
                      maxSize={50}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || !selectedFile}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Material
                      </>
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
