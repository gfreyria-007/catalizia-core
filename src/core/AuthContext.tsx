import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, doc, onSnapshot } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Generate and store SSO token (Firebase ID Token)
        const token = await u.getIdToken();
        localStorage.setItem('catalizia_sso_token', token);

        const unsub = onSnapshot(doc(db, 'users', u.uid), (snap) => {
          if (snap.exists()) {
            setProfile({ uid: u.uid, ...snap.data() } as UserProfile);
          }
          setLoading(false);
        });
        return () => unsub();
      } else {
        localStorage.removeItem('catalizia_sso_token');
        setProfile(null);
        setLoading(false);
      }
    });
  }, []);

  const isAdmin = profile?.role === 'admin' || user?.email === 'gfreyria@gmail.com';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
