//src/app/pages/Dashboard.tsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CourseCard from '@/components/CourseCard';
import { api } from '@/services/api';
import type { Sector, Course } from '@/services/api';
import { UserContext } from '@/App';
import mlImg from '@/assets/course_images/Machine-Learning1.jpg';
import pythonImg from '@/assets/course_images/python.jpg';
import webDevImg from '@/assets/course_images/web-dev.jpg';
import bigDataImg from '@/assets/course_images/WhatisBigData.jpg';

const imageMap: Record<string, string> = {
  'Introductory Machine Learning': mlImg,
  'Python Programing for Beginners': pythonImg,
  'Web Development: Beginner to Advance': webDevImg,
  'Data Analytics with Python':bigDataImg,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { username, name, isAuthenticated } = useContext(UserContext);
  const displayName = name || username;

  // Profile image logic (localStorage or state)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  useEffect(() => {
    const img = localStorage.getItem(`profile_image_${username}`);
    setProfileImage(img);
  }, [username]);
  const displayLetter = (name && name.length > 0) ? name[0].toUpperCase() : (username ? username[0].toUpperCase() : '?');

  // Debug logs for troubleshooting profile icon
  console.log('DEBUG Dashboard:', {
    profileImage,
    displayLetter,
    username,
    name
  });

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadFeaturedCourses();
    loadCartItems();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const loadCartItems = () => {
    const cartKey = `cart_${username}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    setCartItems(storedCart);
  };

  const loadFeaturedCourses = async () => {
    setLoading(true);
    setSearchResults([]); // Clear previous search results
    setSearchTerm(''); // Clear search term
    setError(null);
    try {
      const data = await api.getHomepage();
      console.log('API Response:', data); // Log the raw API response
      console.log('Sectors found:', data.length); // Log number of sectors
      if (Array.isArray(data)) {
        setSectors(data);
        // Log each sector's details
        data.forEach((sector, index) => {
          console.log(`Sector ${index + 1}:`, {
            title: sector.sector_title,
            uuid: sector.sector_uuid,
            coursesCount: sector.featured_course?.length || 0,
            courses: sector.featured_course?.map((c: any) => ({
              title: c.title,
              author: c.author?.first_name + ' ' + c.author?.last_name,
              price: c.price,
              image: c.image_url
            }))
          });
        });
      } else {
        setSectors([]);
        console.warn('Homepage data is not an array:', data);
      }
    } catch (err) {
      console.error('Failed to load featured courses:', err); // Log the specific error
      setError('Failed to load courses. Check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await api.searchCourses(searchTerm);
      setSearchResults(results);
      setSectors([]); // Clear sectors when showing search results
    } catch (error) {
      setError('Search failed. Please try again later.');
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (courseUuid: string) => {
    const cartKey = `cart_${username}`;
    const existing = JSON.parse(localStorage.getItem(cartKey) || '[]') as string[];
    if (!existing.includes(courseUuid)) {
      const updatedCart = [...existing, courseUuid];
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert('Course added to cart!');
    } else {
      alert('This course is already in your cart.');
    }
  };

  const clearSearch = () => {
    loadFeaturedCourses();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-red-50 text-red-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={loadFeaturedCourses}>Try Again</Button>
        </div>
      );
    }

    if (searchResults.length > 0) {
      return (
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Search Results for "{searchTerm}"</h2>
            <Button variant="secondary" onClick={clearSearch}>Clear Search</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {searchResults.map((course) => (
              <CourseCard
                key={course.course_uuid}
                course={{ ...course, image: imageMap[course.title] }}
                onAddToCart={() => addToCart(course.course_uuid)}
              />
            ))}
          </div>
        </section>
      );
    }

    if (sectors.length > 0) {
      return (
        <div className="space-y-12 lg:space-y-16">
          {sectors.map((sector) => (
            <section key={sector.sector_uuid}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{sector.sector_title}</h2>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/sector/${sector.sector_uuid}`, { state: { title: sector.sector_title } })}
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {sector.featured_course.map((course) => (
                  <CourseCard
                    key={course.course_uuid}
                    course={{ ...course, image: imageMap[course.title] }}
                    onAddToCart={() => addToCart(course.course_uuid)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    }

    return (
       <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">No Courses Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find any courses. Please try again later or broaden your search.</p>
        <Button onClick={clearSearch}>
          Back to All Courses
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex flex-col lg:hidden py-4 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={clearSearch}>ProLearn</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/cart')}
                  className="relative p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full px-1.5 py-0.5 text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
                {/* Profile Icon */}
                <div
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-300 hover:shadow"
                  onClick={() => navigate('/user-dashboard')}
                  title="View Profile"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base font-bold text-primary">{displayLetter}</span>
                  )}
                </div>
                <Button variant="secondary" size="small" onClick={() => navigate('/')}>Logout</Button>
              </div>
            </div>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Welcome, {displayName}</span>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex justify-between items-center h-20">
            <h1 className="text-3xl font-bold text-primary cursor-pointer" onClick={clearSearch}>ProLearn</h1>
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for courses, e.g., 'Python'"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border rounded-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {displayName}</span>
              <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                    {cartItems.length}
                  </span>
                )}
              </Button>
              {/* Profile Icon */}
              <div
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-300 hover:shadow"
                onClick={() => navigate('/user-dashboard')}
                title="View Profile"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary">{displayLetter}</span>
                )}
              </div>
              <Button variant="secondary" onClick={() => navigate('/')}>Logout</Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {renderContent()}
      </main>
    </div>
  );
}