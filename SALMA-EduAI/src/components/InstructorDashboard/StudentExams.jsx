import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Calendar, Trophy, FileText, AlertCircle, RefreshCw, User, CheckCircle2, Eye } from "lucide-react";
import { studentApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function StudentExams({ student, subject, onBack, onViewExamDetails }) {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [subjectInfo, setSubjectInfo] = useState(null);

  useEffect(() => {
    const fetchStudentExams = async () => {
      if (!currentUser?.id || !subject?.id || !student?._id) return;

      try {
        setLoading(true);
        setError("");
        const response = await studentApi.getStudentSubjectExams(
          currentUser.id, 
          subject.id, 
          student._id
        );
        setExams(response.exams || []);
        setStudentInfo(response.student);
        setSubjectInfo(response.subject);
      } catch (err) {
        console.error("Error fetching student exams:", err);
        setError(err.response?.data?.message || "Failed to load student exams");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentExams();
  }, [currentUser?.id, subject?.id, student?._id]);

  const refreshExams = async () => {
    if (!currentUser?.id || !subject?.id || !student?._id) return;

    try {
      setLoading(true);
      const response = await studentApi.getStudentSubjectExams(
        currentUser.id, 
        subject.id, 
        student._id
      );
      setExams(response.exams || []);
      setStudentInfo(response.student);
      setSubjectInfo(response.subject);
    } catch (err) {
      console.error("Error refreshing exams:", err);
      setError(err.response?.data?.message || "Failed to refresh exams");
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (grade, fullMark) => {
    if (!grade || !fullMark) return 0;
    return Math.round((grade / fullMark) * 100);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "from-green-500 to-emerald-600";
    if (percentage >= 80) return "from-blue-500 to-indigo-600";
    if (percentage >= 70) return "from-yellow-500 to-orange-600";
    if (percentage >= 60) return "from-orange-500 to-red-600";
    return "from-red-500 to-red-700";
  };

  const getGradeText = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Pass";
    return "Needs Improvement";
  };

  const averageGrade = exams.length > 0 
    ? exams.reduce((sum, exam) => sum + calculatePercentage(exam.student_grade, exam.full_mark), 0) / exams.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Students</span>
        </button>
        
        <button
          onClick={refreshExams}
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
          {studentInfo?.name || student?.name || "Student"}'s Exams
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Exam performance for {subjectInfo?.name || subject?.name || "Subject"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {studentInfo?.name || student?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Student</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {subjectInfo?.name || subject?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Subject</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {loading ? "..." : exams.length}
              </div>
              <div className="text-sm text-gray-600">Exams Taken</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {loading ? "..." : `${Math.round(averageGrade)}%`}
              </div>
              <div className="text-sm text-gray-600">Average Grade</div>
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

      {/* Exams List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Exam Results</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-600 mr-3" />
            <span className="text-gray-600">Loading exams...</span>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Exams Taken</h3>
            <p>This student hasn't taken any exams for this subject yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => {
              const percentage = calculatePercentage(exam.student_grade, exam.full_mark);
              const gradeColor = getGradeColor(percentage);
              const gradeText = getGradeText(percentage);

              return (
                <div
                  key={exam.exam_id}
                  className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{exam.exam_name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{exam.num_of_questions} questions</span>
                          {exam.date_taken && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(exam.date_taken).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradeColor} text-white`}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {gradeText}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Score</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {exam.student_grade} / {exam.full_mark}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Percentage</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {percentage}%
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Full Mark</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {exam.full_mark}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Performance</span>
                      <span className="text-sm font-medium text-gray-800">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${gradeColor} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => onViewExamDetails && onViewExamDetails(exam.exam_id, student._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
