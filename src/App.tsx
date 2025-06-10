//src/App.tsx

 
import { Routes, Route } from 'react-router-dom';
import Login from './app/pages/Login';      // ← Add 'app/' here
import Register from './app/pages/Register'; // ← Add 'app/' here
import NotFound from './app/pages/NotFound'; // ← Add 'app/' here
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}