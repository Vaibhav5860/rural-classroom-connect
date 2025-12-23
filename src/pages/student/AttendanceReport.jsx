import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { studentAPI } from '@/api/studentAPI';

export default function AttendanceReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState({
    stats: { totalClasses: 0, attended: 0, rate: 0 },
    history: []
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await studentAPI.getAttendance();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      }
    };
    fetchAttendance();
  }, []);

  const { stats, history } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">Attendance Report</h1>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-primary">{stats.attended}</p><p className="text-muted-foreground">Classes Attended</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-foreground">{stats.totalClasses}</p><p className="text-muted-foreground">Total Classes</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-success">{stats.rate}%</p><p className="text-muted-foreground">Attendance Rate</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Attendance History</CardTitle></CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No attendance records found.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{new Date(r.date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-sm text-muted-foreground hidden md:inline">|</span>
                        <span className="text-sm font-medium">{r.className}</span>
                      </div>
                      <Badge className={
                        r.status === 'present' ? 'bg-success/10 text-success' :
                          r.status === 'absent' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      }>
                        {r.status === 'present' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                          r.status === 'absent' ? <XCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

