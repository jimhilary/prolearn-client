import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Course, SectorCoursesResponse } from '@/services/api';
import { UserContext } from '@/App';
import CourseCard from '@/components/CourseCard';
import Button from '@/components/Button';
import mlImg from '@/assets/course_images/Machine-Learning.jpg';
import pythonImg from '@/assets/course_images/python.jpg';
import webDevImg from '@/assets/course_images/web-dev.jpg';

const imageMap: Record<string, string> = {
  'Introductory Machine Learning': mlImg,
  'Python Programing for Beginners': pythonImg,
  'Web Development: Beginner to Advance': webDevImg,
};

export default function SectorPage() {
  const { sectorId } = useParams<{ sectorId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useContext(UserContext);

  const [courses, setCourses] = useState<Course[]>([]);
  const [sectorName, setSectorName] = useState<string>('');
  const [totalStudents, setTotalStudents] = useState<number>(0);
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
      const data: SectorCoursesResponse = await api.getSectorCourses(uuid);
      console.log('Sector API Response:', data); // Debug log
      
      setCourses(data.data);
      setSectorName(data.sector_name);
      setTotalStudents(data.total_students);
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
      <nav className="bg-white shadow-sm mb-6 lg:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-20 space-y-4 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
              ProLearn
            </h1>
            <Button variant="secondary" size="small" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{sectorName || title}</h2>
          {totalStudents > 0 && (
            <p className="text-sm sm:text-base text-gray-600">Total students in this sector: {totalStudents.toLocaleString()}</p>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.course_uuid}
                course={{ ...course, image: imageMap[course.title] }}
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