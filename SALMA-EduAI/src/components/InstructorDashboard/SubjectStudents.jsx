import { useState, useEffect } from "react";
import { ArrowLeft, Users, User, Mail, Eye, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { teacherApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function SubjectStudents({ subject, onBack, onStudentSelect }) {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectInfo, setSubjectInfo] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!currentUser?.id || !subject?.id) return;

      try {
        setLoading(true);
        setError("");
        const response = await teacherApi.getSubjectStudents(currentUser.id, subject.id);
        setStudents(response.students || []);
        setSubjectInfo(response.subject);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [currentUser?.id, subject?.id]);

  const refreshStudents = async () => {
    if (!currentUser?.id || !subject?.id) return;

    try {
      setLoading(true);
      const response = await teacherApi.getSubjectStudents(currentUser.id, subject.id);
      setStudents(response.students || []);
      setSubjectInfo(response.subject);
    } catch (err) {
      console.error("Error refreshing students:", err);
      setError(err.response?.data?.message || "Failed to refresh students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Overview</span>
        </button>
        
        <button
          onClick={refreshStudents}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="text-center space-y-4">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          {subjectInfo?.name || subject?.name || "Subject"} Students
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View and manage students enrolled in this subject
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {loading ? "..." : students.length}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {subjectInfo?.name || subject?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Subject</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">Active</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Enrolled Students</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-600 mr-3" />
            <span className="text-gray-600">Loading students...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Students Enrolled</h3>
            <p>This subject doesn't have any students enrolled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{student.name}</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStudentSelect(student, subject)}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:from-sky-600 group-hover:to-indigo-700"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Exams</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
