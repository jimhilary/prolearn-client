import { useNavigate } from 'react-router-dom';
import type { Course } from '@/services/api';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface CourseCardProps {
  course: Course;
  onAddToCart: () => void;
}

export default function CourseCard({ course, onAddToCart }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
      onClick={() => navigate(`/course/${course.course_uuid}`)}
    >
      <img
        src={course.image_url}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 flex-grow">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3">
          by {course.author.first_name} {course.author.last_name}
        </p>
        <div className="text-sm text-gray-500 mb-4">
          👥 {course.student_no} students
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-primary font-bold text-xl">${course.price}</span>
          <Button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card's onClick from firing
              onAddToCart();
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
} 