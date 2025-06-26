import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '../types/variables';

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  refreshUser: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
  console.log('🔄 Calling refreshUser...');
  setLoading(true);
  try {
    console.log('📦 Fetching session from Supabase...');

   const {
  data: { session },
  error: sessionError,
  } = await supabase.auth.getSession();

console.log('📦 Supabase session:', session);

   if (sessionError || !session?.user) {
  console.log('🚫 No active session found');
  setUser(null);
  setIsAuthenticated(false);
  localStorage.removeItem('user');
  return; // ✅ but still let finally run
}

    const userId = session.user.id;

    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_uid', userId)
      .single();

    if (error || !userProfile) {
      throw new Error('User profile not found');
    }

    setUser(userProfile);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userProfile)); // optional

  } catch (err) {
    console.error('❌ Failed to refresh user:', err);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  } finally {
    console.log('✅ Setting loading to false');
    setLoading(false); // ✅ this should always run
  }
};

const hasRun = useRef(false);


useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  let mounted = true;

  const initialize = async () => {
    if (!mounted) return;
    await refreshUser(); // ✅ always run this, it handles both session + user
  };

  initialize();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.clear();
      } else if (event === 'SIGNED_IN' && session) {
        await refreshUser(); // ✅ resync profile on login
      }
    }
  );

  return () => {
    mounted = false;
    subscription?.unsubscribe();
  };
}, []);


  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        setIsAuthenticated,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Make sure these lines exist exactly as shown at the end of your file
export const useUser = () => useContext(UserContext);
export default UserProvider;