import { useState, useEffect, useCallback } from "react";
import { studentApi } from "../../service/apiService";

export const StudentSelector = ({ 
  teacherId, 
  selectedStudent, 
  onStudentSelect, 
  error: parentError 
}) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTeacherStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await studentApi.getTeacherStudents(teacherId);
      setStudents(response.students || []);
    } catch (err) {
      console.error("Error fetching teacher's students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      fetchTeacherStudents();
    }
  }, [teacherId, fetchTeacherStudents]);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    if (studentId) {
      const student = students.find(s => s.id === studentId || s._id === studentId);
      onStudentSelect(student);
    } else {
      onStudentSelect(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <label 
        htmlFor="studentSelect" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Student
      </label>
      
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {parentError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {parentError}
        </div>
      )}

      <select
        id="studentSelect"
        value={selectedStudent?.id || selectedStudent?._id || ""}
        onChange={handleStudentChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={students.length === 0}
      >
        <option value="">
          {students.length === 0 ? "No students found" : "Select a student..."}
        </option>
        {students.map((student) => (
          <option 
            key={student.id || student._id} 
            value={student.id || student._id}
          >
            {student.name || student.firstName + " " + student.lastName} 
            {student.email && ` (${student.email})`}
            {student.id && ` - ID: ${student.id}`}
          </option>
        ))}
      </select>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {students.length > 0 
            ? `${students.length} student${students.length !== 1 ? 's' : ''} available`
            : "No students in your class yet"
          }
        </p>
        
        {students.length === 0 && (
          <button
            onClick={fetchTeacherStudents}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};
