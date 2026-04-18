import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Calendar, User, MessageSquare, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { teacherApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function ExamDetails({ exam, onBack }) {
  const [detailedExamData, setDetailedExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDetailedExamData = async () => {
      if (!exam || !currentUser?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        const data = await teacherApi.getStudentExamDetails(
          exam.teacherId, 
          exam.examId, 
          currentUser.id
        );
        
        console.log("Detailed exam data:", data);
        setDetailedExamData(data);
      } catch (err) {
        console.error("Error fetching detailed exam data:", err);
        setError(err.message || "Failed to load detailed exam data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedExamData();
  }, [exam, currentUser]);

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No exam selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 p-3 rounded-xl hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-gray-600">{exam.subjectName}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-sky-100">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
            <p className="text-gray-600 text-lg">Loading detailed exam data...</p>
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
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 p-3 rounded-xl hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-gray-600">{exam.subjectName}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-red-100">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Detailed Data</h3>
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

  const getGradeColor = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "text-emerald-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getGradeBg = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "from-emerald-50 to-green-50 border-emerald-100";
    if (percentage >= 80) return "from-blue-50 to-sky-50 border-blue-100";
    if (percentage >= 70) return "from-amber-50 to-orange-50 border-amber-100";
    return "from-red-50 to-rose-50 border-red-100";
  };

  const getQuestionGradeBg = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "bg-emerald-100 text-emerald-700";
    if (percentage >= 80) return "bg-blue-100 text-blue-700";
    if (percentage >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  // Use detailed data if available, otherwise fall back to exam prop data
  const examData = detailedExamData?.exam || exam;
  const gradeData = detailedExamData?.grade_summary || {
    total_grade: exam.studentGrade,
    max_total_grade: exam.maxGrade,
    percentage: exam.score
  };
  const questionDetails = detailedExamData?.question_details || exam.questionGrades || [];
  const teacherData = detailedExamData?.teacher || { name: exam.teacherName };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 p-3 rounded-xl hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{examData.name || exam.title}</h1>
              <p className="text-gray-600">{exam.subjectName}</p>
            </div>
          </div>
          <div className={`text-right ${getGradeColor(gradeData.total_grade || 0, gradeData.max_total_grade || 1)}`}>
            <div className="text-3xl font-bold">{gradeData.total_grade || 0}</div>
            <div className="text-sm">/ {gradeData.max_total_grade || 0}</div>
            <div className="text-xs text-gray-600 mt-1">{gradeData.percentage || 0}%</div>
          </div>
        </div>

        {/* Exam Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
            <User className="w-5 h-5 text-sky-600" />
            <div>
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="font-medium text-gray-800">{teacherData.name || exam.teacherName}</p>
              {exam.teacherEmail && (
                <p className="text-xs text-gray-500">{exam.teacherEmail}</p>
              )}
            </div>
          </div>
         
          <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Grade</p>
              <p className="font-medium text-gray-800">{gradeData.percentage || 0}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
            <FileText className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="font-medium text-gray-800">{examData.num_of_questions || questionDetails.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Breakdown */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <Info className="w-5 h-5 text-sky-600" />
          <span>Question-by-Question Breakdown</span>
        </h2>

        <div className="space-y-4">
          {questionDetails && questionDetails.length > 0 ? (
            questionDetails.map((question, index) => (
              <div key={question.question_id || index + 1} className={`bg-gradient-to-r ${getGradeBg(question.student_grade || question.grade || 0, question.max_grade)} p-6 rounded-2xl border`}>
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/80 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                      Q{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Question {index + 1}</h3>
                      {question.question_text && (
                        <p className="text-sm text-gray-600 mt-1 max-w-lg">{question.question_text}</p>
                      )}
                      <p className="text-sm text-gray-600">Points: {question.max_grade}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-xl font-bold text-lg ${getQuestionGradeBg(question.student_grade || question.grade || 0, question.max_grade)}`}>
                      {question.student_grade || question.grade || 0} / {question.max_grade}
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-2">
                      <div className="flex items-center space-x-2 text-amber-700">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Appeal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Answer and Correct Answer */}
                {(question.student_answer || question.correct_answer) && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    {question.student_answer && (
                      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/40">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Your Answer</span>
                        </h4>
                        <p className="text-gray-700 text-sm">{question.student_answer}</p>
                      </div>
                    )}
                    {question.correct_answer && (
                      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/40">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Correct Answer</span>
                        </h4>
                        <p className="text-gray-700 text-sm">{question.correct_answer}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Explanation */}
                {(question.explanation || question.aiExplanation) && (
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/40 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 p-2 rounded-lg">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">AI Feedback</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{question.explanation || question.aiExplanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Grade Information */}
                <div className="mt-4 space-y-3">
                  {/* Grade Bar */}
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                      <span className={`text-sm font-bold ${getGradeColor(question.student_grade || question.grade || 0, question.max_grade)}`}>
                        {Math.round(((question.student_grade || question.grade || 0) / question.max_grade) * 100)}%
                      </span>
                    </div>
                    <div className="bg-white/40 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-500"
                        style={{ width: `${((question.student_grade || question.grade || 0) / question.max_grade) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Earned: {question.student_grade || question.grade || 0} pts</span>
                      <span>Max: {question.max_grade} pts</span>
                    </div>
                  </div>

                  {/* Additional Question Metadata */}
                  {(question.question_type || question.difficulty || question.topic || question.category) && (
                    <div className="bg-white/30 rounded-lg p-3">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Question Details</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {question.question_type && (
                          <div>
                            <span className="text-gray-500">Type:</span> {question.question_type}
                          </div>
                        )}
                        {question.difficulty && (
                          <div>
                            <span className="text-gray-500">Difficulty:</span> {question.difficulty}
                          </div>
                        )}
                        {question.topic && (
                          <div>
                            <span className="text-gray-500">Topic:</span> {question.topic}
                          </div>
                        )}
                        {question.category && (
                          <div>
                            <span className="text-gray-500">Category:</span> {question.category}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-600">No question details available</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Performance Analytics</h2>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100 text-center">
            <div className="text-2xl font-bold text-sky-700">{examData.num_of_questions || questionDetails.length || 0}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {questionDetails?.filter(q => ((q.student_grade || q.grade || 0) / q.max_grade) >= 0.9).length || 0}
            </div>
            <div className="text-sm text-gray-600">Excellent (90%+)</div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 text-center">
            <div className="text-2xl font-bold text-amber-700">
              {questionDetails?.filter(q => {
                const percentage = ((q.student_grade || q.grade || 0) / q.max_grade);
                return percentage >= 0.8 && percentage < 0.9;
              }).length || 0}
            </div>
            <div className="text-sm text-gray-600">Good (80-89%)</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-100 text-center">
            <div className="text-2xl font-bold text-red-700">
              {questionDetails?.filter(q => ((q.student_grade || q.grade || 0) / q.max_grade) < 0.7).length || 0}
            </div>
            <div className="text-sm text-gray-600">Needs Review (&lt;70%)</div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
