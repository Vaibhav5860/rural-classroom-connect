import { useState } from 'react';
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
import { BookOpen, Loader2, Copy, Check } from 'lucide-react';

export default function CreateClass() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [createdInfo, setCreatedInfo] = useState(null);
  const initialForm = { name: '', subject: '', customSubject: '', description: '', scheduleEntries: [], };
  const [formData, setFormData] = useState(initialForm);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const addScheduleEntry = () => {
    setFormData((f) => ({ ...f, scheduleEntries: [...f.scheduleEntries, { day: 'Mon', start: '09:00', end: '10:00' }] }));
  };

  const updateScheduleEntry = (index, changes) => {
    setFormData((f) => {
      const entries = [...f.scheduleEntries];
      entries[index] = { ...entries[index], ...changes };
      return { ...f, scheduleEntries: entries };
    });
  };

  const removeScheduleEntry = (index) => {
    setFormData((f) => ({ ...f, scheduleEntries: f.scheduleEntries.filter((_, i) => i !== index) }));
  };

  const formatScheduleString = (entries) => {
    if (!entries || entries.length === 0) return '';
    // Sort by day order then start time
    const dayIndex = (d) => daysOfWeek.indexOf(d);
    const sorted = [...entries].sort((a, b) => (dayIndex(a.day) - dayIndex(b.day)) || a.start.localeCompare(b.start));
    return sorted.map(e => `${e.day} ${e.start}-${e.end}`).join('; ');
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If user picked Other, ensure custom subject is provided
      if (formData.subject === 'other' && !formData.customSubject.trim()) {
        toast({ title: 'Please specify the subject', variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      // Validate schedule entries
      for (const e of formData.scheduleEntries) {
        if (!e.start || !e.end) {
          toast({ title: 'Please fill in start and end times for all schedule entries', variant: 'destructive' });
          setIsLoading(false);
          return;
        }
        if (e.start >= e.end) {
          toast({ title: `Start time must be before end time for ${e.day}`, variant: 'destructive' });
          setIsLoading(false);
          return;
        }
      }

      // Check for overlaps on the same day
      const entriesByDay = formData.scheduleEntries.reduce((acc, cur) => {
        acc[cur.day] = acc[cur.day] || [];
        acc[cur.day].push(cur);
        return acc;
      }, {});

      for (const day of Object.keys(entriesByDay)) {
        const list = entriesByDay[day].slice().sort((a, b) => a.start.localeCompare(b.start));
        for (let i = 1; i < list.length; i++) {
          if (list[i].start < list[i - 1].end) {
            toast({ title: `Schedule entries overlap for ${day}`, variant: 'destructive' });
            setIsLoading(false);
            return;
          }
        }
      }

      const generatedCode = `CLS${Date.now().toString().slice(-6)}`;

      const subjectToSend = formData.subject === 'other' ? formData.customSubject.trim() : formData.subject;

      // Build structured schedule array from entries
      const scheduleArray = formData.scheduleEntries || [];

      const payload = {
        name: formData.name,
        subject: subjectToSend,
        description: formData.description,
        schedule: scheduleArray,
        code: generatedCode,
      };

      await teacherAPI.createClass(payload);

      setClassCode(generatedCode);
      setCreatedInfo({ name: formData.name, subject: subjectToSend, schedule: formatScheduleString(formData.scheduleEntries) });
      toast({
        title: 'Class Created!',
        description: 'Your class has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                Create New Class
              </h1>
              <p className="text-muted-foreground mt-1">
                Set up a new class for your students
              </p>
            </div>

            {classCode ? (
              <Card className="animate-slide-up">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mx-auto mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                      Class Created Successfully!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Share this code with your students so they can join
                    </p>
                    <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-xl mb-6">
                      <div>
                        <div className="text-2xl font-mono font-bold text-foreground tracking-wider">{classCode}</div>
                        {createdInfo?.subject && <div className="text-sm text-muted-foreground mt-2">Subject: <span className="text-foreground">{createdInfo.subject}</span></div>}
                        {createdInfo?.schedule && <div className="text-sm text-muted-foreground mt-1">Schedule: <span className="text-foreground">{createdInfo.schedule}</span></div>}
                      </div>
                      <Button variant="outline" size="icon" onClick={copyCode}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={() => { setClassCode(''); setFormData(initialForm); setCreatedInfo(null); }}>
                        Create Another
                      </Button>
                      <Button onClick={() => navigate('/teacher/classes')}>
                        Go to My Classes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Class Details</CardTitle>
                      <CardDescription>Fill in the information for your new class</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Class Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Data Structures and Algorithms"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value, customSubject: value !== 'other' ? '' : formData.customSubject })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                          <SelectItem value="civil">Civil Engineering</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      {formData.subject === 'other' && (
                        <div className="space-y-2">
                          <Label htmlFor="customSubject">Specify Subject</Label>
                          <Input
                            id="customSubject"
                            placeholder="e.g., Environmental Science"
                            value={formData.customSubject}
                            onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Schedule</Label>

                      <div className="space-y-3">
                        {formData.scheduleEntries.length === 0 && (
                          <p className="text-sm text-muted-foreground">No schedule added yet. Click "Add time" to create entries.</p>
                        )}

                        {formData.scheduleEntries.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <select
                              value={entry.day}
                              onChange={(e) => updateScheduleEntry(idx, { day: e.target.value })}
                              className="rounded-md border bg-background px-3 py-2 text-sm"
                            >
                              {daysOfWeek.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>

                            <input
                              type="time"
                              value={entry.start}
                              onChange={(e) => updateScheduleEntry(idx, { start: e.target.value })}
                              className="rounded-md border bg-background px-3 py-2 text-sm"
                              required
                            />

                            <span className="text-sm text-muted-foreground">to</span>

                            <input
                              type="time"
                              value={entry.end}
                              onChange={(e) => updateScheduleEntry(idx, { end: e.target.value })}
                              className="rounded-md border bg-background px-3 py-2 text-sm"
                              required
                            />

                            <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleEntry(idx)}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </Button>
                          </div>
                        ))}

                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" onClick={addScheduleEntry}>Add time</Button>
                          {formData.scheduleEntries.length > 0 && (
                            <div className="text-sm text-muted-foreground">Preview: <span className="text-foreground">{formatScheduleString(formData.scheduleEntries)}</span></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the class..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Class...
                        </>
                      ) : (
                        'Create Class'
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
