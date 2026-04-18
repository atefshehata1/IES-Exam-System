// src/services/apiService.js
import axios from "axios";

const API_URL = "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      // You could implement token refresh logic here if you have refresh tokens

      // For now, we'll just log the user out if their token is invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Student-related API functions
export const studentApi = {
  // Get all teachers with subjects that a student is enrolled in
  getStudentTeachersAndSubjects: async (studentId) => {
    try {
      const response = await apiClient.get(`/teachers/student/${studentId}/teachers-subjects`);
      return response.data; // Expected format: { student: {id, name}, teachers: [...], total_teachers, total_subjects, message? }
    } catch (error) {
      console.error("Error fetching student teachers and subjects:", error);
      throw error;
    }
  },

  // Get subjects that a student has with a specific teacher
  getStudentTeacherSubjects: async (studentId, teacherId) => {
    try {
      const response = await apiClient.get(`/teachers/student/${studentId}/teacher/${teacherId}/subjects`);
      return response.data; // Expected format: { student: {...}, teacher: {...}, subjects: [...], total_shared_subjects }
    } catch (error) {
      console.error("Error fetching student-teacher subjects:", error);
      throw error;
    }
  },

  // Get exams a student took for a specific subject
  getStudentSubjectExams: async (teacherId, subjectId, studentId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/subjects/${subjectId}/students/${studentId}/exams`);
      return response.data; // Expected format: { subject: {...}, student: {...}, exams: [...], message? }
    } catch (error) {
      console.error("Error fetching student subject exams:", error);
      throw error;
    }
  },

  // Get all exams that a student has taken
  getStudentAllExams: async (studentId) => {
    try {
      const response = await apiClient.get(`/teachers/student/${studentId}/exams`);
      return response.data; // Expected format: { student: {...}, exams: [...], total_exams, overall_statistics, performance_by_subject }
    } catch (error) {
      console.error("Error fetching student exams:", error);
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await apiClient.get(`/students/${studentId}`);
      return response.data; // Expected format: { student: {...} }
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      throw error;
    }
  },

  // Get complete student profile information
  getStudentProfile: async (studentId) => {
    try {
      const response = await apiClient.get(`/teachers/student/${studentId}/profile`);
      return response.data; // Expected format: { student: {...}, message }
    } catch (error) {
      console.error("Error fetching student profile:", error);
      throw error;
    }
  },

  // Update student profile
  updateStudentProfile: async (studentId, profileData) => {
    try {
      const response = await apiClient.put(`/teachers/student/${studentId}/profile`, profileData);
      return response.data; // Expected format: { student: {...}, message }
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error;
    }
  },

  // Search students by name/email
  searchStudents: async (query) => {
    try {
      const response = await apiClient.get(`/students/search?q=${encodeURIComponent(query)}`);
      return response.data; // Expected format: { students: [...] }
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  },

  // Get all students for a specific teacher
  getTeacherStudents: async (teacherId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/students`);
      return response.data; // Expected format: { students: [...] }
    } catch (error) {
      console.error("Error fetching teacher's students:", error);
      throw error;
    }
  },

  // Add student to teacher's class
  addStudentToTeacher: async (teacherId, studentId) => {
    try {
      const response = await apiClient.post(`/teachers/${teacherId}/students`, {
        studentId
      });
      return response.data;
    } catch (error) {
      console.error("Error adding student to teacher:", error);
      throw error;
    }
  }
};

// Teacher-related API functions
export const teacherApi = {
  // Get teacher subjects
  getTeacherSubjects: async (teacherId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/subjects`);
      return response.data; // Expected format: { teacher_name: string, subjects: [{id, name, students_count, exams_count}], message?: string }
    } catch (error) {
      console.error("Error fetching teacher subjects:", error);
      throw error;
    }
  },

  // Add subject to teacher
  addSubjectToTeacher: async (teacherId, name) => {
    try {
      const response = await apiClient.post(`/teachers/${teacherId}/subjects`, {
        name
      });
      return response.data; // Expected format: { message: string, teacher: {...} }
    } catch (error) {
      console.error("Error adding subject to teacher:", error);
      throw error;
    }
  },

  // Get students for a teacher's subject
  getSubjectStudents: async (teacherId, subjectId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/subjects/${subjectId}/students`);
      return response.data; // Expected format: { subject: {id, name}, students: [...], message?: string }
    } catch (error) {
      console.error("Error fetching subject students:", error);
      throw error;
    }
  },

  // Get detailed student grade for an exam
  getStudentExamDetails: async (teacherId, examId, studentId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/exams/${examId}/grade/${studentId}`);
      return response.data; // Expected format: { exam: {...}, student: {...}, teacher: {...}, grade_summary: {...}, question_details: [...] }
    } catch (error) {
      console.error("Error fetching student exam details:", error);
      throw error;
    }
  },

  // Add student to subject
  addStudentToSubject: async (teacherId, subjectId, studentId) => {
    try {
      const response = await apiClient.post(`/teachers/${teacherId}/subjects/${subjectId}/addstudent/${studentId}`);
      return response.data; // Expected format: { message: string, subject: {...}, student: {...}, teacher: {...} }
    } catch (error) {
      console.error("Error adding student to subject:", error);
      throw error;
    }
  },

  // Get teacher profile
  getTeacherProfile: async (teacherId) => {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}/profile`);
      return response.data; // Expected format: { message: string, teacher: {id, name, email, phone, bio, subjects_count, exams_count, students_count, pdfs_count} }
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      throw error;
    }
  },

  // Update teacher profile
  updateTeacherProfile: async (teacherId, profileData) => {
    try {
      const response = await apiClient.put(`/teachers/${teacherId}/profile`, profileData);
      return response.data; // Expected format: { message: string, teacher: {id, name, email, phone, bio, subjects_count, exams_count, students_count, pdfs_count} }
    } catch (error) {
      console.error("Error updating teacher profile:", error);
      throw error;
    }
  }
};

export default apiClient;
