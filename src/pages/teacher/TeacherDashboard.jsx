import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { teacherAPI } from '@/api/teacherAPI';
import {
  BookOpen,
  Users,
  ClipboardList,
  Video,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
    upcomingClasses: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await teacherAPI.getDashboard();
      setDashboardData(data);
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: 'Total Classes',
      value: dashboardData.totalClasses,
      icon: BookOpen,
      color: 'bg-primary/10 text-primary',
      change: '+2 this month',
    },
    {
      title: 'Total Students',
      value: dashboardData.totalStudents,
      icon: Users,
      color: 'bg-info/10 text-info',
      change: '+12 this week',
    },
    {
      title: 'Pending Reviews',
      value: dashboardData.pendingSubmissions,
      icon: ClipboardList,
      color: 'bg-warning/10 text-warning',
      change: 'Need attention',
    },
    {
      title: 'Live Sessions',
      value: dashboardData.upcomingClasses,
      icon: Video,
      color: 'bg-success/10 text-success',
      change: 'This week',
    },
  ];

  const quickActions = [
    { label: 'Create Class', icon: Plus, to: '/teacher/create-class', color: 'bg-primary' },
    { label: 'Upload Material', icon: BookOpen, to: '/teacher/upload-material', color: 'bg-info' },
    { label: 'Create Assignment', icon: ClipboardList, to: '/teacher/create-assignment', color: 'bg-warning' },
    // { label: 'Start Live Class', icon: Video, to: '/live/teacher/demo', color: 'bg-success' }, // Use dynamic link in class
  ];

  const recentClasses = [
    { name: 'Data Structures', students: 45, lastActive: '2 hours ago' },
    { name: 'Database Management', students: 38, lastActive: '1 day ago' },
    { name: 'Web Development', students: 52, lastActive: '3 days ago' },
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
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your classes today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.title}
                className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="font-display">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.to}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 hover:bg-muted/50"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color} text-primary-foreground`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      {action.label}
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Recent Classes - Now dynamic or links to My Classes */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">My Classes</CardTitle>
                <Link to="/teacher/classes">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {/* Simplified view encouraging navigation to full class list */}
                <div className="text-center py-8 text-muted-foreground">
                  <p>Manage all your classes from the dedicated page.</p>
                  <Link to="/teacher/classes">
                    <Button variant="outline" className="mt-4">Go to My Classes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
