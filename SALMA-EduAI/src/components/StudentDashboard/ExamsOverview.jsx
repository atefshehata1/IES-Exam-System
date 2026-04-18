import { useState, useEffect } from "react";
import { FileText, Clock, TrendingUp, Award, AlertTriangle, Loader2, BookOpen, User, BarChart3, ChevronRight } from "lucide-react";
import { studentApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function ExamsOverview({ onExamSelect }) {
  const [examsData, setExamsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStudentExams = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getStudentAllExams(currentUser.id);
        console.log("ExamsOverview - Received data:", data);
        console.log("ExamsOverview - First exam:", data?.exams?.[0]);
        setExamsData(data);
      } catch (err) {
        console.error("Error fetching student exams:", err);
        setError(err.message || "Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentExams();
  }, [currentUser]);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-emerald-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getGradeBg = (percentage) => {
    if (percentage >= 90) return "from-emerald-50 to-green-50 border-emerald-100";
    if (percentage >= 80) return "from-blue-50 to-sky-50 border-blue-100";
    if (percentage >= 70) return "from-amber-50 to-orange-50 border-amber-100";
    return "from-red-50 to-rose-50 border-red-100";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exams Overview</h1>
              <p className="text-gray-600">Track your academic performance</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-sky-100">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
            <p className="text-gray-600 text-lg">Loading your exam data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exams Overview</h1>
              <p className="text-gray-600">Track your academic performance</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-red-100">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Exams</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examsData || examsData.exams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exams Overview</h1>
              <p className="text-gray-600">Track your academic performance</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-sky-100">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-sky-100 rounded-full">
              <FileText className="w-12 h-12 text-sky-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exams Yet</h3>
              <p className="text-gray-600">{examsData?.message || "You haven't taken any exams yet. Check back later!"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { overall_statistics: overallStats, performance_by_subject: performanceBySubject, exams } = examsData;

  return (
    <div className="space-y-6">
      {/* Student Info Header */}
      {examsData.student && (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {examsData.student.name}</h1>
              <p className="text-gray-600">Student ID: {examsData.student.id}</p>
            </div>
          </div>
        </div>
      )}

      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-800">{examsData.total_exams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className={`text-2xl font-bold ${getGradeColor(overallStats.overall_percentage)}`}>
                {overallStats.overall_percentage}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-amber-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-800">
                {overallStats.total_grade}/{overallStats.total_max_grade}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-800">{overallStats.subjects_count}</p>
            </div>
          </div>
        </div>
      </div>

      {performanceBySubject && performanceBySubject.length > 0 && (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Performance by Subject</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceBySubject.map((subject) => (
              <div 
                key={subject.subject_name}
                className={`p-4 rounded-xl border bg-gradient-to-br ${getGradeBg(subject.average_percentage)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{subject.subject_name}</h3>
                    <p className="text-xs text-gray-600">👨‍🏫 {subject.teacher_name}</p>
                  </div>
                  <span className={`text-lg font-bold ${getGradeColor(subject.average_percentage)}`}>
                    {subject.average_percentage}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex justify-start">
                    <span>Exams:</span>
                    <span className="font-medium">{subject.exams_count}</span>
                  </div>
                  <div className="flex justify-end">
                    <span>Points:</span>
                    <span className="font-medium">{subject.total_grade}/{subject.total_max_grade}</span>
                  </div>
                </div>
                {/* Progress bar for subject performance */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${subject.average_percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">All Exams</h2>
        </div>

        <div className="space-y-4">
          {exams.map((exam) => (
            <div 
              key={exam.exam_id} 
              className={`bg-gradient-to-r ${getGradeBg(exam.percentage)} p-6 rounded-2xl border cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
              onClick={() => onExamSelect && onExamSelect({
                examId: exam.exam_id,
                title: exam.exam_name,
                subjectId: exam.subject_id,
                subjectName: exam.subject_name,
                teacherId: exam.teacher_id,
                teacherName: exam.teacher_name,
                teacherEmail: exam.teacher_email,
                score: exam.percentage,
                studentGrade: exam.student_grade,
                maxGrade: exam.max_grade,
                totalQuestions: exam.num_of_questions,
                submittedAt: exam.date_taken,
                questionGrades: exam.question_grades,
                status: exam.status
              })}
            >
              {/* Exam Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{exam.exam_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{exam.subject_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{exam.teacher_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.num_of_questions} questions</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {exam.date_taken && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(exam.date_taken)}</span>
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {exam.status}
                    </div>
                  </div>
                </div>
                <div className={`text-right ${getGradeColor(exam.percentage)}`}>
                  <div className="text-2xl font-bold">{exam.student_grade}</div>
                  <div className="text-sm">/ {exam.max_grade}</div>
                  <div className="text-xs text-gray-600 mt-1">{exam.percentage}%</div>
                </div>
              </div>

              {/* Grade Bar */}
              <div className="mb-4">
                <div className="bg-white/60 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${exam.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Score: {exam.percentage}%</span>
                  <span>{exam.student_grade} / {exam.max_grade} points</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button className="bg-white/60 hover:bg-white/80 text-sky-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-sky-200 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
