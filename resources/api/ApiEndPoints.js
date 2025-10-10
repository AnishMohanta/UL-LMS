// base URL
export const base_url = "https://lms-backend-main.onrender.com/api";

// Auth APIs 
export const login_url = `${base_url}/auth/login`;


//student APIs
export const all_courses_url = `${base_url}/courses`;
export const enrolled_courses_url = `${base_url}/enrollments/my-enrollments`;
export const enrolled_coursesByid_url = `${base_url}/enrollments`;
export const get_lessonByid_url = `${base_url}/lessons/course`;
export const complete_lessonByid_url = `${base_url}/enrollments/mark-complete`;

