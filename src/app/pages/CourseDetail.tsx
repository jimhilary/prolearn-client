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
        alert('Course added to cart!');
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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm mb-6 lg:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-20 space-y-4 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
              ProLearn
            </h1>
            <Button variant="secondary" size="small" onClick={() => navigate('/dashboard')}>
              Back to Courses
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4">{course.description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 text-sm sm:text-base text-gray-700">
              <span>
                Created by {course.author.first_name} {course.author.last_name}
              </span>
              <span className="hidden sm:inline">|</span>
              <span>Last updated: {new Date(course.updated).toLocaleDateString()}</span>
            </div>

            {/* Course Curriculum */}
            <Card className="p-0">
              <h2 className="text-xl sm:text-2xl font-bold p-4 sm:p-6">Course Content</h2>
              <div className="divide-y">
                {course.course_section.map((section, idx) => (
                  <div key={idx} className="p-4 sm:p-6">
                    <h3 className="font-bold text-base sm:text-lg mb-3">{section.section_title}</h3>
                    <ul className="space-y-2">
                      {section.episode.map((ep, epIdx) => (
                        <li key={epIdx} className="flex justify-between items-center text-sm sm:text-base text-gray-800">
                          <span>- {ep.title}</span>
                          <span className="text-xs sm:text-sm text-gray-500">{ep.length}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Comments Section */}
            <div className="mt-8 lg:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Comments</h2>
              <Card>
                <div className="space-y-4 sm:space-y-6">
                  {course.comments.map((comment, idx) => (
                    <div key={idx} className="flex space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-light flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{comment.user.first_name} {comment.user.last_name}</p>
                        <p className="text-gray-700 text-sm sm:text-base">{comment.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(comment.created).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Add Your Comment</h3>
                  <Input
                    placeholder="Write your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-3"
                  />
                  <Button onClick={handleAddComment}>Submit Comment</Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Course Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <img src={course.image_url} alt={course.title} className="rounded-lg mb-4 w-full h-32 sm:h-48 object-cover" />
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">${course.price}</div>
              <Button
                className="w-full mb-3"
                onClick={() => course && addToCart(course.course_uuid)}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/cart')}
              >
                Go to Cart
              </Button>
              <div className="text-xs sm:text-sm text-gray-600 mt-6 space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <span>👥 {course.student_no} students</span>
                </div>
                <div className="flex items-center">
                  <span>⏱️ {course.total_duration} total length</span>
                </div>
                <div className="flex items-center">
                  <span>📚 {course.total_lectures} lectures</span>
                </div>
                <div className="flex items-center">
                  <span>🌐 {course.language}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}