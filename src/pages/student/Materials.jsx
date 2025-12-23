import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MaterialCard } from '@/components/MaterialCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studentAPI } from '@/api/studentAPI';

export default function Materials() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await studentAPI.getEnrolledClasses();
        setClasses(data);
        if (data.length > 0) {
          setSelectedClass(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch classes", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!selectedClass) return;
      try {
        const { data } = await studentAPI.getMaterials(selectedClass);
        setMaterials(data);
      } catch (error) {
        console.error("Failed to fetch materials", error);
      }
    };
    fetchMaterials();
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Study Materials</h1>
            <p className="text-muted-foreground mt-1">Download and view class materials</p>
          </div>
          <div className="mb-6 max-w-xs">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You are not enrolled in any classes yet.</p>
            </div>
          ) : materials.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 animate-slide-up">
              {materials.map((m) => (
                <MaterialCard
                  key={m._id}
                  id={m._id}
                  title={m.title}
                  type={m.type && m.type.includes('pdf') ? 'pdf' : m.type && m.type.includes('video') ? 'video' : 'other'}
                  downloadUrl={`${import.meta.env.VITE_API_BASE_URL}${m.fileUrl}`} // prepend backend URL
                  uploadedAt={new Date(m.createdAt).toLocaleDateString()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No materials found for this class.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
