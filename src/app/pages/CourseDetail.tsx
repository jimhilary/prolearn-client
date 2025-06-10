//src/app/pages/CourseDetail.tsx

 import { useState, useEffect, useContext } from 'react'; // Add useContext
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { api } from '@/services/api';
import type { CourseDetail } from '@/services/api';
import { UserContext } from '@/App'; // Add UserContext import

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { username } = useContext(UserContext); // Add this line to get username
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourseDetail(courseId);
    }
  }, [courseId]);

  const loadCourseDetail = async (uuid: string) => {
    try {
      const data = await api.getCourseDetail(uuid);
      setCourse(data);
    } catch (error) {
      console.error('Failed to load course details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add the missing addToCart function
  const addToCart = (courseUuid: string) => {
    try {
      const cartKey = `cart_${username}`; // Use user-specific cart
      const existing = JSON.parse(localStorage.getItem(cartKey) || '[]') as string[];
      if (!existing.includes(courseUuid)) { // Prevent duplicates
        localStorage.setItem(cartKey, JSON.stringify([...existing, courseUuid]));
        alert('Course added to cart successfully!');
      } else {
        alert('This course is already in your cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add course to cart');
    }
  };

  const handleAddComment = async () => {
    if (!courseId || !comment.trim()) return;
    try {
      await api.addComment(courseId, comment);
      setComment('');
      loadCourseDetail(courseId);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  // Rest of your component remains the same until the Cart button
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... previous JSX ... */}

      {/* Course Purchase Card */}
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <div className="text-3xl font-bold mb-4">${course.price}</div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">👥 {course.student_no} students</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">⏱️ {course.total_duration} total length</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">📚 {course.total_lectures} lectures</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">🌐 {course.language}</span>
            </div>
          </div>
          <Button 
            className="w-full mb-4" 
            onClick={() => course && addToCart(course.course_uuid)}
          >
            Add to Cart
          </Button>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={() => navigate('/checkout')}
          >
            Buy Now
          </Button>
        </Card>
      </div>
      {/* ... rest of your JSX ... */}
    </div>
  );
}