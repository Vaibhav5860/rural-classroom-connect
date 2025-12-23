import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/api/authAPI';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile({ name, avatarFile });
      await refreshUser();
      toast({ title: 'Profile updated' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-card p-6 rounded-md">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview.startsWith('http') || avatarPreview.startsWith('/') ? avatarPreview : avatarPreview} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Change avatar</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Email</label>
              <Input value={user?.email || ''} disabled />
            </div>

            <div>
              <label className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">{user?.role}</label>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
