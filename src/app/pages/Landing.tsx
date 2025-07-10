//src/app/pages/Landing.tsx

import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-blue-100">
      <nav className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">ProLearn</h1>
        <div className="flex space-x-2 sm:space-x-4">
          <Link to="/login">
            <Button variant="secondary" size="small">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="small">Sign Up</Button>
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Start Your Learning Journey Today</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
              Join our platform to access premium courses, expert instructors, and a supportive learning community.
            </p>
            <Link to="/register">
              <Button className="text-base sm:text-lg px-6 sm:px-8 py-3">Get Started</Button>
            </Link>
          </div>
          <Card className="p-6 sm:p-8">
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