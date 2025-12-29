import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';

interface UserProfile {
  uid: string;
  email: string;
  role: 'student' | 'ngo';
  organization_name?: string;
  city?: string;
  area?: string;
  created_at?: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getCurrentUser();
        setProfile(data as UserProfile);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  return { profile, loading };
};

