import { createContext } from 'react';
import type { CurrentUser } from '../types';

export interface AuthContextValue {
  user: CurrentUser | null;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
