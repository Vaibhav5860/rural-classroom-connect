import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { teacherAPI } from '@/api/teacherAPI';
import { Plus, Users, BookOpen, Clock, Copy, Check, Trash2, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useConfirm } from '@/components/ConfirmProvider';

export default function TeacherClassList() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', subject: '', scheduleEntries: [] });

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const parseScheduleString = (s) => {
        if (!s) return [];
        if (Array.isArray(s)) return s.map(item => ({ day: item.day || 'Mon', start: item.start || '09:00', end: item.end || '10:00' }));
        // split by ; or , then parse 'Mon 09:00-10:00'
        return s.split(/;|,/).map(part => part.trim()).filter(Boolean).map(part => {
            const m = part.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
            if (m) return { day: m[1], start: m[2], end: m[3] };
            // fallback: try to split differently
            const [day, times] = part.split(' ');
            const [start, end] = (times || '').split('-');
            return { day: day || 'Mon', start: start || '09:00', end: end || '10:00' };
        });
    };

    const formatScheduleString = (entries) => {
        if (!entries || entries.length === 0) return '';
        const dayIndex = (d) => daysOfWeek.indexOf(d);
        const sorted = [...entries].sort((a, b) => (dayIndex(a.day) - dayIndex(b.day)) || a.start.localeCompare(b.start));
        return sorted.map(e => `${e.day} ${e.start}-${e.end}`).join('; ');
    };

    const addScheduleEntry = () => {
        setEditFormData((f) => ({ ...f, scheduleEntries: [...f.scheduleEntries, { day: 'Mon', start: '09:00', end: '10:00' }] }));
    };

    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [viewScheduleEntries, setViewScheduleEntries] = useState([]);
    const [viewScheduleClassId, setViewScheduleClassId] = useState(null);
    const updateScheduleEntry = (index, changes) => {
        setEditFormData((f) => {
            const entries = [...f.scheduleEntries];
            entries[index] = { ...entries[index], ...changes };
            return { ...f, scheduleEntries: entries };
        });
    };

    const removeScheduleEntry = (index) => {
        setEditFormData((f) => ({ ...f, scheduleEntries: f.scheduleEntries.filter((_, i) => i !== index) }));
    };
    const confirm = useConfirm();

    const fetchClasses = async () => {
        try {
            const { data } = await teacherAPI.getClasses();
            setClasses(data);
        } catch (error) {
            console.error("Failed to fetch classes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(code);
        toast({ title: "Class code copied!" });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id) => {
        try {
            const ok = await confirm({ title: 'Delete class', description: 'Are you sure you want to delete this class? This action cannot be undone.', confirmText: 'Delete', cancelText: 'Cancel' });
            if (!ok) return;
            await teacherAPI.deleteClass(id);
            toast({ title: "Class deleted successfully" });
            fetchClasses();
        } catch (error) {
            toast({ title: "Failed to delete class", variant: "destructive" });
        }
    };

    const openEditDialog = (cls) => {
        setSelectedClass(cls);
        const entries = parseScheduleString(cls.schedule || '');
        setEditFormData({ name: cls.name, subject: cls.subject, scheduleEntries: entries });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!selectedClass) return;
        try {
            // Convert scheduleEntries back to formatted string
            const schedule = formatScheduleString(editFormData.scheduleEntries);
            await teacherAPI.updateClass(selectedClass._id, { ...editFormData, schedule });
            toast({ title: "Class updated successfully" });
            setEditDialogOpen(false);
            fetchClasses();
        } catch (error) {
            toast({ title: "Failed to update class", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">My Classes</h1>
                        <Link to="/teacher/create-class">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Create Class
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Loading classes...</div>
                    ) : classes.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
                            <Link to="/teacher/create-class">
                                <Button>Create your first class</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classes.map((cls) => (
                                <Card key={cls._id} className="hover:shadow-card-hover transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                                                {cls.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Class Code</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{cls.code}</code>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(cls.code)}>
                                                        {copiedId === cls.code ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl">{cls.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{cls.subject}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{cls.students?.length || 0} Students</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* <Clock className="h-4 w-4" /> */}
                                                {cls.schedule ? (
                                                  (() => {
                                                    const entries = parseScheduleString(cls.schedule || []);
                                                    return (
                                                      <>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => { setViewScheduleEntries(entries); setScheduleOpen(true); setViewScheduleClassId(cls._id || cls.id); }}>
                                                          View schedule
                                                        </Button>
                                                      </>
                                                    );
                                                  })()
                                                ) : (
                                                  <span>No schedule</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to={`/live/teacher/${cls._id}`} className="flex-1">
                                                <Button className="w-full gap-2" variant="default">
                                                    <BookOpen className="h-4 w-4" /> Class
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="icon" onClick={() => openEditDialog(cls)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(cls._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>

                {/* Edit Class Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Class</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name</Label>
                                <Input
                                    id="name"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={editFormData.subject}
                                    onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Schedule</Label>

                                {editFormData.scheduleEntries.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No schedule added yet. Click "Add time" to create entries.</p>
                                )}

                                {editFormData.scheduleEntries.map((entry, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <Select value={entry.day} onValueChange={(value) => updateScheduleEntry(idx, { day: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {daysOfWeek.map((d) => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <input type="time" value={entry.start} onChange={(e) => updateScheduleEntry(idx, { start: e.target.value })} className="rounded-md border bg-background px-3 py-2 text-sm" />
                                        <span className="text-sm text-muted-foreground">to</span>
                                        <input type="time" value={entry.end} onChange={(e) => updateScheduleEntry(idx, { end: e.target.value })} className="rounded-md border bg-background px-3 py-2 text-sm" />

                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleEntry(idx)} aria-label="Delete time">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" onClick={addScheduleEntry}>Add time</Button>
                                    {editFormData.scheduleEntries.length > 0 && (
                                        <div className="text-sm text-muted-foreground">Preview: <span className="text-foreground">{formatScheduleString(editFormData.scheduleEntries)}</span></div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditSubmit}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Schedule view dialog */}
                <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Schedule</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            {viewScheduleEntries.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No schedule available.</p>
                            ) : (
                                <div className="space-y-3">
                                    {viewScheduleEntries.map((entry, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <select
                                                value={entry.day}
                                                onChange={(e) => {
                                                    const copy = viewScheduleEntries.map(x => ({ ...x }));
                                                    copy[idx].day = e.target.value;
                                                    setViewScheduleEntries(copy);
                                                }}
                                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                            >
                                                {daysOfWeek.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>

                                            <input
                                                type="time"
                                                value={entry.start}
                                                onChange={(e) => {
                                                    const copy = viewScheduleEntries.map(x => ({ ...x }));
                                                    copy[idx].start = e.target.value;
                                                    setViewScheduleEntries(copy);
                                                }}
                                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                            />

                                            <span className="text-sm text-muted-foreground">to</span>

                                            <input
                                                type="time"
                                                value={entry.end}
                                                onChange={(e) => {
                                                    const copy = viewScheduleEntries.map(x => ({ ...x }));
                                                    copy[idx].end = e.target.value;
                                                    setViewScheduleEntries(copy);
                                                }}
                                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                            />

                                            <Button type="button" variant="ghost" size="icon" onClick={() => { setViewScheduleEntries(viewScheduleEntries.filter((_, i) => i !== idx)); }} aria-label="Delete time">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" onClick={() => setViewScheduleEntries([...viewScheduleEntries, { day: 'Mon', start: '09:00', end: '10:00' }])}>Add time</Button>
                                        <div className="ml-auto flex gap-2">
                                            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                                            <Button onClick={async () => {
                                                // validate
                                                for (const e of viewScheduleEntries) {
                                                    if (!e.start || !e.end) { toast({ title: 'Please fill start/end for all entries', variant: 'destructive' }); return; }
                                                    if (e.start >= e.end) { toast({ title: `Start must be before end for ${e.day}`, variant: 'destructive' }); return; }
                                                }
                                                const byDay = viewScheduleEntries.reduce((acc, cur) => { acc[cur.day] = acc[cur.day] || []; acc[cur.day].push(cur); return acc; }, {});
                                                for (const day of Object.keys(byDay)) {
                                                    const list = byDay[day].slice().sort((a, b) => a.start.localeCompare(b.start));
                                                    for (let i = 1; i < list.length; i++) { if (list[i].start < list[i - 1].end) { toast({ title: `Overlapping entries for ${day}`, variant: 'destructive' }); return; } }
                                                }

                                                try {
                                                    await teacherAPI.updateClass(viewScheduleClassId, { schedule: viewScheduleEntries });
                                                    toast({ title: 'Schedule updated' });
                                                    setScheduleOpen(false);
                                                    fetchClasses();
                                                } catch (err) {
                                                    toast({ title: 'Failed to update schedule', variant: 'destructive' });
                                                }
                                            }}>Save</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
