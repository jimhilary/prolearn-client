//src/app/pages/Landing.tsx

import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import mlImg from '@/assets/course_images/Machine-Learning1.jpg';
import pythonImg from '@/assets/course_images/python.jpg';
import webDevImg from '@/assets/course_images/web-dev.jpg';
import { useState } from 'react';

const featuredCourses = [
  {
    title: 'Introductory Machine Learning',
    image: mlImg,
    description: 'Kickstart your journey into machine learning. No prior experience required! Learn the basics and build real projects.',
  },
  {
    title: 'Python Programing for Beginners',
    image: pythonImg,
    description: 'Master Python from scratch. Perfect for beginners who want to code, automate, and solve problems with Python.',
  },
  {
    title: 'Web Development: Beginner to Advance',
    image: webDevImg,

    description: 'Become a web developer! Learn HTML, CSS, JavaScript, and modern frameworks to build beautiful websites.',
  },
];

export default function Landing() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const next = () => setCurrent((c) => (c + 1) % featuredCourses.length);
  const prev = () => setCurrent((c) => (c - 1 + featuredCourses.length) % featuredCourses.length);

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
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <Card className="p-0 cursor-pointer transition-shadow duration-300 hover:shadow-xl" onClick={() => navigate('/login')}>
                <img src={featuredCourses[current].image} alt={featuredCourses[current].title} className="w-full h-40 sm:h-56 object-cover rounded-t-2xl" />
                <div className="p-4 flex flex-col items-center">
                  <h3 className="font-bold text-lg mb-2 text-center">{featuredCourses[current].title}</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">{featuredCourses[current].description}</p>
                  <div className="flex justify-between items-center w-full mt-auto">
                    <Button onClick={(e) => { e.stopPropagation(); navigate('/login'); }}>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
              <div className="flex justify-between items-center mt-4">
                <button onClick={prev} className="rounded-full bg-white shadow p-2 hover:bg-gray-100" aria-label="Previous">
                  &#8592;
                </button>
                <div className="flex space-x-2">
                  {featuredCourses.map((_, idx) => (
                    <span key={idx} className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-gray-300'}`}></span>
                  ))}
                </div>
                <button onClick={next} className="rounded-full bg-white shadow p-2 hover:bg-gray-100" aria-label="Next">
                  &#8594;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}