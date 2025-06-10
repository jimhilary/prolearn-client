//src/App.tsx
 import { createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './app/pages/Landing';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import Dashboard from './app/pages/Dashboard';
import CourseDetail from './app/pages/CourseDetail';
import Cart from './app/pages/cart';
import NotFound from './app/pages/NotFound';
import './App.css';

// Define the context type
interface UserContextType {
  username: string;
  timestamp: string;
}

// Create the context with type
export const UserContext = createContext<UserContextType>({
  username: 'jimhilary',
  timestamp: '2025-06-10 11:23:17'  // Updated to current timestamp
});

export default function App() {
  return (
    <UserContext.Provider 
      value={{ 
        username: 'jimhilary', 
        timestamp: '2025-06-10 11:23:17'  // Updated to current timestamp
      }}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContext.Provider>
  );
}