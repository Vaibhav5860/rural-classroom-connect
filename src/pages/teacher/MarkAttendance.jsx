import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teacherAPI } from '@/api/teacherAPI';
import { toast } from '@/hooks/use-toast';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function MarkAttendance() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date());
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'late' }
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await teacherAPI.getClasses();
                setClasses(data);
                if (data.length > 0) setSelectedClass(data[0]._id);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedClass) return;
            setIsLoading(true);
            try {
                // Fetch students
                const { data: studentsData } = await teacherAPI.getClassStudents(selectedClass);
                setStudents(studentsData);

                // Fetch existing attendance for this date
                const { data: attendanceData } = await teacherAPI.getClassAttendance(selectedClass, date.toISOString());

                // If report exists, pre-fill
                // attendanceData is an array of reports. We check if there is one for this specific date (backend filters by date)
                if (attendanceData && attendanceData.length > 0) {
                    const record = attendanceData[0]; // expecting filtered by date from backend
                    const newAttendance = {};
                    record.records.forEach(r => {
                        newAttendance[r.student._id] = r.status;
                    });
                    setAttendance(newAttendance);
                } else {
                    // Default to present for all if new
                    const newAttendance = {};
                    studentsData.forEach(s => {
                        newAttendance[s._id] = 'present';
                    });
                    setAttendance(newAttendance);
                }

            } catch (error) {
                console.error("Failed to fetch class data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedClass, date]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                student: studentId,
                status
            }));

            await teacherAPI.markAttendance({
                classId: selectedClass,
                date: date.toISOString(),
                records
            });

            toast({
                title: "Attendance Saved",
                description: "Attendance records have been updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save attendance.",
                variant: "destructive"
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
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                            Mark Attendance
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Record daily class attendance
                        </p>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Select Class</label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((c) => (
                                                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <CalendarComponent
                                                mode="single"
                                                selected={date}
                                                onSelect={(d) => d && setDate(d)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Student List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">Loading...</div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No students in this class.</div>
                            ) : (
                                <div className="space-y-4">
                                    {students.map((student) => (
                                        <div key={student._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student._id] === 'present' ? 'default' : 'outline'}
                                                    className={attendance[student._id] === 'present' ? 'bg-success hover:bg-success/90' : ''}
                                                    onClick={() => handleStatusChange(student._id, 'present')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Present
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student._id] === 'absent' ? 'default' : 'outline'}
                                                    className={attendance[student._id] === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                                                    onClick={() => handleStatusChange(student._id, 'absent')}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Absent
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[student._id] === 'late' ? 'default' : 'outline'}
                                                    className={attendance[student._id] === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                                                    onClick={() => handleStatusChange(student._id, 'late')}
                                                >
                                                    <Clock className="h-4 w-4 mr-1" /> Late
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={handleSubmit} size="lg">Save Attendance</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
