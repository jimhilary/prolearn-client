//src/app/pages/Dashboard.tsx

 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { api } from '@/services/api';
import type { Sector, Course } from '@/services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedCourses();
  }, []);

  const loadFeaturedCourses = async () => {
    try {
      const data = await api.getHomepage();
      setSectors(data);
    } catch (error) {
      console.error('Failed to load featured courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const results = await api.searchCourses(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const addToCart = (courseUuid: string) => {
    setCartItems(prev => [...prev, courseUuid]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary">ProLearn</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  🔍
                </button>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/cart')}
                className="flex items-center"
              >
                Cart ({cartItems.length})
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : searchResults.length > 0 ? (
          // Search Results
          <div>
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((course) => (
                <CourseCard
                  key={course.course_uuid}
                  course={course}
                  onAddToCart={() => addToCart(course.course_uuid)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Featured Courses by Sector
          <div className="space-y-12">
            {sectors.map((sector) => (
              <div key={sector.sector_uuid}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{sector.sector_title}</h2>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/sector/${sector.sector_uuid}`)}
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sector.featured_course.map((course) => (
                    <CourseCard
                      key={course.course_uuid}
                      course={course}
                      onAddToCart={() => addToCart(course.course_uuid)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  onAddToCart: () => void;
}

function CourseCard({ course, onAddToCart }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <img
        src={course.image_url}
        alt={course.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
      <p className="text-gray-600 text-sm mb-2">
        by {course.author.first_name} {course.author.last_name}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-primary font-medium">${course.price}</span>
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/course/${course.course_uuid}`)}
          >
            Details
          </Button>
          <Button onClick={onAddToCart}>Add to Cart</Button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {course.student_no} students enrolled
      </div>
    </Card>
  );
}