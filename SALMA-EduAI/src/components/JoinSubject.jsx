import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { teacherApi } from "../service/apiService";
import { useAuth } from "../context/AuthProvider";

export default function JoinSubject() {
  const { teacherId, subjectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [subjectInfo, setSubjectInfo] = useState(null);

  useEffect(() => {
    const fetchSubjectInfo = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch subject information (you might need to add this API endpoint)
        const response = await teacherApi.getTeacherSubjects(teacherId);
        const subject = response.subjects.find(s => s.id === subjectId);
        
        if (!subject) {
          setError("Subject not found or link is invalid");
          return;
        }
        
        setSubjectInfo(subject);
      } catch (err) {
        console.error("Error fetching subject info:", err);
        setError("Failed to load subject information");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId && subjectId) {
      fetchSubjectInfo();
    }
  }, [teacherId, subjectId]);

  const handleJoinSubject = async () => {
    if (!currentUser?.id) {
      setError("Please log in as a student to join the subject");
      return;
    }

    if (currentUser.role !== 'student') {
      setError("Only students can join subjects");
      return;
    }

    try {
      setJoining(true);
      setError("");

      await teacherApi.addStudentToSubject(teacherId, subjectId, currentUser.id);
      setSuccess(true);
      
      // Redirect to student dashboard after 2 seconds
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error joining subject:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to join subject. Please try again.");
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            <h2 className="text-xl font-bold text-gray-800">Loading...</h2>
          </div>
          <p className="text-gray-600 text-center">Loading subject information...</p>
        </div>
      </div>
    );
  }

  if (error && !subjectInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">Error</h2>
          </div>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">Success!</h2>
          </div>
          <p className="text-gray-600 text-center mb-6">
            You have successfully joined {subjectInfo?.name}. You'll be redirected to your dashboard shortly.
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-4 rounded-full inline-block mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Subject</h1>
          <p className="text-gray-600">You've been invited to join a class</p>
        </div>

        {subjectInfo && (
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{subjectInfo.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{subjectInfo.students_count || 0} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{subjectInfo.exams_count || 0} exams</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!currentUser ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">Please log in as a student to join this subject.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Log In
            </button>
          </div>
        ) : currentUser.role !== 'student' ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">Only students can join subjects.</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Go Home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Click the button below to join this subject and start learning!
            </p>
            <button
              onClick={handleJoinSubject}
              disabled={joining}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {joining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>Join Subject</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
