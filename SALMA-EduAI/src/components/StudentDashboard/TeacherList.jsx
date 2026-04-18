import { useState, useEffect } from "react";
import { Users, BookOpen, Clock, Star, AlertCircle, Loader2 } from "lucide-react";
import { studentApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function TeacherList({ onViewTeacherSubjects }) {
  const [teachersData, setTeachersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTeachersAndSubjects = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getStudentTeachersAndSubjects(currentUser.id);
        setTeachersData(data);
      } catch (err) {
        console.error("Error fetching teachers and subjects:", err);
        setError(err.message || "Failed to load teachers and subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersAndSubjects();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-600" />
          <p className="text-gray-600">Loading teachers and subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Data</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teachersData || teachersData.teachers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Teachers Found</h3>
        <p className="text-gray-600">
          {teachersData?.message || "You are not enrolled in any subjects yet."}
        </p>
      </div>
    );
  }

  const { teachers } = teachersData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Teachers</h1>
            <p className="text-gray-600">View all your enrolled courses and instructors</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-xl font-bold text-sky-700">{teachersData?.total_teachers || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-xl font-bold text-emerald-700">{teachersData?.total_subjects || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-xl font-bold text-amber-700">
                  {teachers.reduce((total, teacher) => 
                    total + teacher.subjects.reduce((subTotal, subject) => subTotal + subject.exams_count, 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.teacher_id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            {/* Teacher Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold border-2 border-sky-200">
                  {teacher.teacher_name.split(' ').map(name => name[0]).join('').toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-100 text-emerald-600 rounded-full p-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{teacher.teacher_name}</h3>
                <p className="text-sky-600 font-medium">{teacher.teacher_email}</p>
                <p className="text-sm text-gray-500">{teacher.subjects.length} Subject{teacher.subjects.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 rounded-full border border-amber-100">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm font-medium text-amber-700">4.8</span>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Subjects:</span>
                <span className="font-medium text-gray-800">{teacher.subjects.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Exams:</span>
                <span className="font-medium text-sky-600">
                  {teacher.subjects.reduce((total, subject) => total + subject.exams_count, 0)}
                </span>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Subjects:</p>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject.subject_id}
                    className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 px-3 py-1 rounded-full text-xs font-medium border border-sky-100"
                  >
                    {subject.subject_name} ({subject.exams_count} exam{subject.exams_count !== 1 ? 's' : ''})
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button 
                onClick={() => onViewTeacherSubjects(teacher)}
                className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Subject Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
