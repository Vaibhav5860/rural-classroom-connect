import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Video, Users, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl">Remote Classroom</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/register"><Button>Get Started</Button></Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Quality Education for<br />
            <span className="text-primary">Rural Colleges</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
            Bridge the digital divide with our remote classroom platform. Live classes, study materials, assignments, and more - all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
            <Link to="/register"><Button size="lg" className="gap-2">Start Learning <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">I'm a Teacher</Button></Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Video, title: 'Live Classes', desc: 'Attend real-time video lectures with interactive features' },
              { icon: BookOpen, title: 'Study Materials', desc: 'Access PDFs, videos, and resources anytime' },
              { icon: Users, title: 'Collaboration', desc: 'Chat, raise hands, and engage with teachers' },
            ].map((f, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to Transform Education?</h2>
        <p className="text-muted-foreground mb-8">Join thousands of students and teachers already using our platform.</p>
        <Link to="/register"><Button size="lg">Get Started Free</Button></Link>
      </div>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 Remote Classroom. Made for Rural Colleges.</p>
      </footer>
    </div>
  );
}
