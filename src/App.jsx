import React from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import { ConfirmProvider } from "./components/ConfirmProvider";
import TeacherClassList from "./pages/teacher/TeacherClassList";
import CreateClass from "./pages/teacher/CreateClass";
import UploadMaterial from "./pages/teacher/UploadMaterial";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import ViewSubmissions from "./pages/teacher/ViewSubmissions";
import LiveClassTeacher from "./pages/teacher/LiveClassTeacher";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import StudentDashboard from "./pages/student/StudentDashboard";
import ClassList from "./pages/student/ClassList";
import Materials from "./pages/student/Materials";
import StudentAssignments from "./pages/student/StudentAssignments";
import AttendanceReport from "./pages/student/AttendanceReport";
import LiveClassStudent from "./pages/student/LiveClassStudent";
import Announcements from "./pages/shared/Announcements";
import Profile from "./pages/Profile";
import HealthCheck from "./pages/HealthCheck";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/classes" element={<ProtectedRoute role="teacher"><TeacherClassList /></ProtectedRoute>} />
      <Route path="/teacher/create-class" element={<ProtectedRoute role="teacher"><CreateClass /></ProtectedRoute>} />
      <Route path="/teacher/upload-material" element={<ProtectedRoute role="teacher"><UploadMaterial /></ProtectedRoute>} />
      <Route path="/teacher/create-assignment" element={<ProtectedRoute role="teacher"><CreateAssignment /></ProtectedRoute>} />
      <Route path="/teacher/submissions" element={<ProtectedRoute role="teacher"><ViewSubmissions /></ProtectedRoute>} />
      <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><MarkAttendance /></ProtectedRoute>} />
      <Route path="/live/teacher/:classId" element={<ProtectedRoute role="teacher"><LiveClassTeacher /></ProtectedRoute>} />
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/classes" element={<ProtectedRoute role="student"><ClassList /></ProtectedRoute>} />
      <Route path="/student/materials" element={<ProtectedRoute role="student"><Materials /></ProtectedRoute>} />
      <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute role="student"><AttendanceReport /></ProtectedRoute>} />
      <Route path="/live/student/:classId" element={<ProtectedRoute role="student"><LiveClassStudent /></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/health" element={<HealthCheck />} />
      <Route path="/class/:id" element={<ProtectedRoute><ClassList /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <ConfirmProvider>
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <AppRoutes />
//           </BrowserRouter>
//         </ConfirmProvider>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;


const API = "https://rural-classroom-connect-production.up.railway.app";

export default function App() {
  fetch(`${API}/api/health`)
    .then(res => res.json())
    .then(data => console.log("API OK:", data))
    .catch(err => console.error("API FAIL:", err));

  return <h1>Testing backend connection</h1>;
}

