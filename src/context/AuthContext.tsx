import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../api';
import { clearBookingIds, clearToken, getToken, setToken } from '../auth';
import type { CurrentUser } from '../types';

interface AuthContextValue {
  user: CurrentUser | null;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (getToken()) {
      api
        .get<CurrentUser>('/users/current')
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  async function loginWithToken(token: string) {
    setToken(token);
    const res = await api.get<CurrentUser>('/users/current');
    setUser(res.data);
  }

  function logout() {
    clearToken();
    clearBookingIds();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
