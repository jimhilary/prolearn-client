//src/App.tsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './app/pages/Landing';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import Dashboard from './app/pages/Dashboard';
import CourseDetail from './app/pages/CourseDetail';
import Cart from './app/pages/Cart';
import SectorPage from './app/pages/Sector';
import NotFound from './app/pages/NotFound';
import './App.css';
import { userApi, getToken, saveToken, clearToken } from './services/api';

// Define the context type
interface UserContextType {
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Default context
export const UserContext = createContext<UserContextType>({
  username: '',
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// UserProvider implementation
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // Load user profile if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (getToken()) {
        try {
          const profile = await userApi.profile();
          if (profile && profile.username) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    fetchProfile();
  }, []);

  // Login method
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await userApi.login(email, password);
      if (res && res.token) {
        saveToken(res.token);
        const profile = await userApi.profile();
        setUser(profile);
        setIsAuthenticated(true);
        return true;
      }
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    return false;
  }, []);

  // Register method
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await userApi.signup(name, email, password);
      if (res && res.token) {
        saveToken(res.token);
        const profile = await userApi.profile();
        setUser(profile);
        setIsAuthenticated(true);
        return true;
      }
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    return false;
  }, []);

  // Logout method
  const logout = useCallback(() => {
    userApi.logout();
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        username: user?.username || '',
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/sector/:sectorId" element={<SectorPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}