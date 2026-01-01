import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthChange } from '@/lib/firebase';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: 'student' | 'ngo' | null;
  organizationName: string | null;
  eduCredits: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // These will be useful for NGO flow
  const [role, setRole] = useState<'student' | 'ngo' | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [eduCredits, setEduCredits] = useState<number>(0);

  const refreshCredits = async () => {
    try {
      const profile = await authApi.getCurrentUser() as any;
      if (profile) {
        setEduCredits(profile.edu_credits || 0);
      }
    } catch (error) {
      console.error('Error refreshing credits:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setRole(null);
        setOrganizationName(null);
        setLoading(false);
      } else {
        try {
          // Fetch additional user data (role, etc.) from backend
          const profile = await authApi.getCurrentUser() as any;
          if (profile) {
            setRole(profile.role);
            setOrganizationName(profile.organization_name || null);
            setEduCredits(profile.edu_credits || 0);
          }
        } catch (error) {
          console.error('Error fetching user profile in AuthContext:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        organizationName,
        eduCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
