import { useNavigate } from 'react-router-dom';
import type { Course } from '@/services/api';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface CourseCardProps {
  course: Course & { image?: string };
  onAddToCart: () => void;
}

export default function CourseCard({ course, onAddToCart }: CourseCardProps) {
  const navigate = useNavigate();

  // Debug logging
  console.log('CourseCard rendering:', {
    title: course.title,
    author: course.author,
    price: course.price,
    image: course.image_url,
    students: course.student_no
  });

  return (
    <Card 
      className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
      onClick={() => navigate(`/course/${course.course_uuid}`)}
    >
      <img
        src={course.image || course.image_url}
        alt={course.title}
        className="w-full h-32 sm:h-40 lg:h-48 object-cover"
      />
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 flex-grow line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
          by {course.author.first_name} {course.author.last_name}
        </p>
        <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          👥 {course.student_no} students
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-auto">
          <span className="text-primary font-bold text-lg sm:text-xl">${course.price}</span>
          <Button 
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card's onClick from firing
              onAddToCart();
            }}
            className="w-full sm:w-auto"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
} 