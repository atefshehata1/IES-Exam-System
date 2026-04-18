import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, TrendingUp, Award, AlertCircle, Loader2, FileText, Users } from "lucide-react";
import { studentApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function TeacherSubjects({ teacher, onBack, onViewExams }) {
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedTeacherId, setLastFetchedTeacherId] = useState(null);
  const { currentUser } = useAuth();

  // Extract stable IDs to prevent unnecessary re-renders
  const teacherId = teacher?.teacher_id || teacher?.id || teacher?._id;
  const studentId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (!studentId || !teacherId) return;
      
      // Prevent refetching if we already have data for this teacher
      if (lastFetchedTeacherId === teacherId && subjectDetails) {
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getStudentTeacherSubjects(studentId, teacherId);
        setSubjectDetails(data);
        setLastFetchedTeacherId(teacherId);
      } catch (err) {
        console.error("Error fetching teacher subjects:", err);
        setError(err.message || "Failed to load subject details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [studentId, teacherId, lastFetchedTeacherId, subjectDetails]);

  // Reset cache when component unmounts or teacher changes
  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      setLastFetchedTeacherId(null);
    };
  }, []);

  // Reset cache when teacher changes
  useEffect(() => {
    if (teacherId !== lastFetchedTeacherId) {
      setSubjectDetails(null);
      setLastFetchedTeacherId(null);
    }
  }, [teacherId, lastFetchedTeacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-600" />
          <p className="text-gray-600">Loading subject details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 p-3 rounded-xl hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Subject Details</h1>
              <p className="text-gray-600">Subjects with {teacher?.teacher_name}</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subjectDetails || subjectDetails.subjects.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 p-3 rounded-xl hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Subject Details</h1>
              <p className="text-gray-600">Subjects with {subjectDetails?.teacher?.name || teacher?.teacher_name}</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Shared Subjects</h3>
          <p className="text-gray-600">
            {subjectDetails?.message || "You don't have any subjects with this teacher."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 p-3 rounded-xl hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Subject Details</h1>
            <p className="text-gray-600">Subjects with {subjectDetails.teacher.name}</p>
          </div>
        </div>

       
      </div>

      {/* Summary Stats */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <div>
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-xl font-bold text-sky-700">{subjectDetails.total_shared_subjects}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-xl font-bold text-emerald-700">
                  {subjectDetails.subjects.filter(s => s.student_average_percentage !== null).length > 0
                    ? Math.round(
                        subjectDetails.subjects
                          .filter(s => s.student_average_percentage !== null)
                          .reduce((sum, s) => sum + s.student_average_percentage, 0) /
                        subjectDetails.subjects.filter(s => s.student_average_percentage !== null).length
                      ) + "%"
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Total Exams Taken</p>
                <p className="text-xl font-bold text-amber-700">
                  {subjectDetails.subjects.reduce((sum, s) => sum + s.exams_taken_by_student, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectDetails.subjects.map((subject) => (
            <div key={subject.subject_id} className="bg-gradient-to-r from-white to-sky-50 p-6 rounded-2xl border border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{subject.subject_name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Users className="w-4 h-4" />
                    <span>{subject.total_students} students enrolled</span>
                  </div>
                </div>
                {subject.student_average_percentage !== null && (
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    subject.student_average_percentage >= 90 
                      ? 'bg-emerald-100 text-emerald-700'
                      : subject.student_average_percentage >= 80
                      ? 'bg-blue-100 text-blue-700'
                      : subject.student_average_percentage >= 70
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {subject.student_average_percentage}%
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Exams:</span>
                  <span className="font-medium text-gray-800">{subject.total_exams}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Exams Taken:</span>
                  <span className="font-medium text-sky-600">{subject.exams_taken_by_student}</span>
                </div>
                {subject.student_total_grade > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Score:</span>
                    <span className="font-medium text-emerald-600">
                      {subject.student_total_grade} / {subject.max_possible_grade}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {subject.student_average_percentage !== null && (
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-500"
                      style={{ width: `${subject.student_average_percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Progress: {subject.student_average_percentage}%</span>
                    <span>{subject.exams_taken_by_student}/{subject.total_exams} exams</span>
                  </div>
                </div>
              )}

              {/* View Exams Button */}
              <button
                onClick={() => onViewExams(subject, subjectDetails.teacher)}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Exams ({subject.total_exams})</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
