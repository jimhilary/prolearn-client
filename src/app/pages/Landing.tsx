//src/app/pages/Landing.tsx

import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-blue-100">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">ProLearn</h1>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6">Start Your Learning Journey Today</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our platform to access premium courses, expert instructors, and a supportive learning community.
            </p>
            <Link to="/register">
              <Button className="text-lg px-8 py-3">Get Started</Button>
            </Link>
          </div>
          <Card className="p-8">
            <img 
              src="/learning-illustration.svg" 
              alt="Learning" 
              className="w-full h-auto"
            />
          </Card>
        </div>
      </main>
    </div>
  );
}