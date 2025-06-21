import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Course } from '@/services/api';
import { UserContext } from '@/App';
import CourseCard from '@/components/CourseCard';
import Button from '@/components/Button';

export default function SectorPage() {
  const { sectorId } = useParams<{ sectorId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useContext(UserContext);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The title is passed via state in the navigate function in Dashboard
  const title = location.state?.title || 'Sector';

  useEffect(() => {
    if (sectorId) {
      loadSectorCourses(sectorId);
    }
  }, [sectorId]);

  const loadSectorCourses = async (uuid: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSectorCourses(uuid);
      // The API documentation is a bit unclear here.
      // Assuming the data is an array of courses. 
      // If it's an object like { courses: [] }, this will need adjustment.
      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (err) {
      setError('Failed to load courses for this sector.');
      console.error('Failed to load sector courses:', err);
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
      alert('Course added to cart!');
    } else {
      alert('This course is already in your cart.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-3xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
              ProLearn
            </h1>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.course_uuid}
                course={course}
                onAddToCart={() => addToCart(course.course_uuid)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p>No courses found in this sector.</p>
          </div>
        )}
      </main>
    </div>
  );
} 