import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI } from '@/api/studentAPI';
import {
  BookOpen,
  ClipboardList,
  Calendar,
  Video,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    enrolledClasses: 0,
    pendingAssignments: 0,
    attendanceRate: 0,
    upcomingClasses: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await studentAPI.getDashboard();
      setDashboardData(data);
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: 'Enrolled Classes',
      value: dashboardData.enrolledClasses,
      icon: BookOpen,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Pending Assignments',
      value: dashboardData.pendingAssignments,
      icon: ClipboardList,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Attendance Rate',
      value: `${dashboardData.attendanceRate}%`,
      icon: Calendar,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Live Sessions Today',
      value: dashboardData.upcomingClasses,
      icon: Video,
      color: 'bg-info/10 text-info',
    },
  ];

  const upcomingAssignments = [
    { title: 'Linked List Implementation', class: 'Data Structures', dueIn: '2 days', progress: 60 },
    { title: 'SQL Queries Practice', class: 'Database Management', dueIn: '4 days', progress: 20 },
    { title: 'React Component Project', class: 'Web Development', dueIn: '1 week', progress: 0 },
  ];

  const enrolledClasses = [
    { name: 'Data Structures', teacher: 'Dr. Priya Sharma', progress: 65, nextClass: 'Today, 10:00 AM' },
    { name: 'Database Management', teacher: 'Prof. Amit Kumar', progress: 45, nextClass: 'Tomorrow, 2:00 PM' },
    { name: 'Web Development', teacher: 'Dr. Sneha Gupta', progress: 80, nextClass: 'Wed, 11:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Hello, {user?.name}! 📚
            </h1>
            <p className="text-muted-foreground mt-1">
              Keep up the great work! Here's your learning progress.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.title}
                className="overflow-hidden transition-all duration-300 hover:shadow-card-hover"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Assignments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">Upcoming Assignments</CardTitle>
                <Link to="/student/assignments">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <p>No pending assignments right now.</p>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Classes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">My Classes</CardTitle>
                <Link to="/student/classes">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <p>Go to 'My Classes' to view your enrollment.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Link to="/live/student/demo">
                  <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    Join Live Class
                  </Button>
                </Link>
                <Link to="/student/materials">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    View Materials
                  </Button>
                </Link>
                <Link to="/student/attendance">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Check Attendance
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
