import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  hasProfile: boolean;
  hasSchool: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, teacher_code?: string, school_id?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [hasProfile, setHasProfile] = useState(false);
  const [hasSchool, setHasSchool] = useState(false);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const userData = await api.users.getMe(token);
      setUser(userData);
      setHasProfile(!!userData.profile);
      setHasSchool(!!userData.school_id);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, teacher_code?: string, school_id?: string) => {
    try {
      const data = await api.auth.register(email, password, teacher_code, school_id);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setHasProfile(false);
    setHasSchool(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, hasProfile, hasSchool, login, register, logout, refreshUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
