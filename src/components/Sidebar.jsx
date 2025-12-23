import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Video,
  Users,
  Upload,
  Calendar,
  Megaphone,
  CheckSquare,
  BarChart3,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


const teacherLinks = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/classes', icon: BookOpen, label: 'My Classes' },
  { to: '/teacher/create-class', icon: Users, label: 'Create Class' },
  { to: '/teacher/upload-material', icon: Upload, label: 'Upload Material' },
  { to: '/teacher/create-assignment', icon: ClipboardList, label: 'Create Assignment' },
  { to: '/teacher/submissions', icon: CheckSquare, label: 'View Submissions' },
  { to: '/teacher/attendance', icon: Calendar, label: 'Attendance' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
];

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/classes', icon: BookOpen, label: 'My Classes' },
  { to: '/student/materials', icon: FileText, label: 'Materials' },
  { to: '/student/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/student/attendance', icon: Calendar, label: 'Attendance' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
];

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:sticky md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-display font-semibold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Live class quick access - Commented out demo link to clean UI 
          <div className="border-t border-sidebar-border p-4">
            <Link
              to={user?.role === 'teacher' ? '/live/teacher/demo' : '/live/student/demo'}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg bg-accent px-4 py-3 text-accent-foreground transition-all hover:opacity-90"
            >
              <Video className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Live Class</p>
                <p className="text-xs opacity-80">
                  {user?.role === 'teacher' ? 'Start a session' : 'Join now'}
                </p>
              </div>
            </Link>
          </div>
          */}

          {/* Profile link at bottom */}
          <div className="border-t border-sidebar-border p-4">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-sm">
                <p className="font-medium text-sidebar-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
