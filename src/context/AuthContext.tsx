import { useEffect, useState, type ReactNode } from 'react';
import api from '../api';
import { clearBookingIds, clearToken, getToken, setToken } from '../auth';
import type { CurrentUser } from '../types';
import { AuthContext } from './authContextValue';

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
