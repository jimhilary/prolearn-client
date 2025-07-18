//src/services/api.ts

const API_ROOT = 'http://127.0.0.1:8000/courses';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Course {
  course_uuid: string;
  title: string;
  student_no: number;
  author: User;
  price: string;
  image_url: string;
  description?: string;
  total_lectures?: number;
  total_duration?: string;
}

export interface Sector {
  sector_title: string;
  sector_uuid: string;
  featured_course: Course[];
  sector_image: string;
}

// New interface for sector courses response
export interface SectorCoursesResponse {
  data: Course[];
  sector_name: string;
  total_students: number;
}

export interface CourseDetail extends Course {
  description: string;
  created: string;
  updated: string;
  language: string;
  total_lectures: number;
  total_duration: string;
  course_section: CourseSection[];
  comments: Comment[];
}

export interface CourseSection {
  section_title: string;
  total_duration: string;
  episode: Episode[];
}

export interface Episode {
  title: string;
  length: string;
  file?: string;
}

export interface Comment {
  user: User;
  message: string;
  created: string;
}

// Updated cart response interface
export interface CartResponse {
  cart_detail: CartItem[];
  cart_total: string;
}

export interface CartItem {
  title: string;
  price: string;
  image_url: string;
  author: {
    first_name: string;
    last_name: string;
  };
}

export const api = {
  // Get homepage with featured courses by sector
  getHomepage: () => fetch(`${API_ROOT}/`).then(res => res.json()),

  // Get detailed course information
  getCourseDetail: (courseUuid: string) => 
    fetch(`${API_ROOT}/detail/${courseUuid}/`).then(res => res.json()),

  // Get all courses in a specific sector - updated to handle the correct response format
  getSectorCourses: (sectorUuid: string): Promise<SectorCoursesResponse> => 
    fetch(`${API_ROOT}/${sectorUuid}/`).then(res => res.json()),

  // Search courses
  searchCourses: (searchTerm: string) => 
    fetch(`${API_ROOT}/search/${searchTerm}/`).then(res => res.json()),

  // Add comment to a course
  addComment: (courseUuid: string, message: string) => 
    fetch(`${API_ROOT}/comment/${courseUuid}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    }),

  // Get cart details - updated to match the API response format
  getCartDetails: (cartItems: string[]): Promise<CartResponse> => 
    fetch(`${API_ROOT}/cart/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: cartItems })
    }).then(res => res.json()),

  // Get course content for enrolled users
  getStudyCourse: (courseUuid: string) => 
    fetch(`${API_ROOT}/study/${courseUuid}/`).then(res => res.json()),
};

const USER_API_ROOT = 'http://127.0.0.1:8000/users';

// --- Token helpers ---
export function saveToken(token: string) {
  localStorage.setItem('auth_token', token);
}
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}
export function clearToken() {
  localStorage.removeItem('auth_token');
}

function authHeadersOrUndefined(): { headers: HeadersInit } | undefined {
  const token = getToken();
  return token ? { headers: { Authorization: `Token ${token}` } } : undefined;
}

export const userApi = {
  // Signup
  signup: (name: string, email: string, password: string) =>
    fetch(`${USER_API_ROOT}/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(res => res.json()),

  // Login
  login: (email: string, password: string) =>
    fetch(`${USER_API_ROOT}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(res => res.json()),

  // Get profile (requires auth) - expects same user object format
  profile: () => {
    const opts = authHeadersOrUndefined();
    return fetch(`${USER_API_ROOT}/profile/`, opts).then(res => res.json());
  },

  // Get user courses (requires auth)
  userCourses: () => {
    const opts = authHeadersOrUndefined();
    return fetch(`${USER_API_ROOT}/courses/`, opts).then(res => res.json());
  },

  // Auth status
  authStatus: () => {
    const opts = authHeadersOrUndefined();
    return fetch(`${USER_API_ROOT}/auth-status/`, opts).then(res => res.json());
  },

  // Logout (POST)
  logout: () => {
    const opts = authHeadersOrUndefined() || {};
    return fetch(`${USER_API_ROOT}/logout/`, { ...opts, method: 'POST' }).then(res => res.json());
  },
};