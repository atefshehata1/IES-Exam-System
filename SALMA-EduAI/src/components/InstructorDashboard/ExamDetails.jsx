import { useState, useEffect } from "react";
import { ArrowLeft, FileText, User, Trophy, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { teacherApi } from "../../service/apiService";

export default function ExamDetails({ teacherId, examId, studentId, onBack }) {
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!teacherId || !examId || !studentId) return;

      try {
        setLoading(true);
        setError("");
        const response = await teacherApi.getStudentExamDetails(teacherId, examId, studentId);
        setExamDetails(response);
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError(err.response?.data?.message || "Failed to load exam details");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [teacherId, examId, studentId]);

  const refreshDetails = async () => {
    if (!teacherId || !examId || !studentId) return;

    try {
      setLoading(true);
      const response = await teacherApi.getStudentExamDetails(teacherId, examId, studentId);
      setExamDetails(response);
    } catch (err) {
      console.error("Error refreshing exam details:", err);
      setError(err.response?.data?.message || "Failed to refresh exam details");
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "from-green-500 to-emerald-600";
    if (percentage >= 80) return "from-blue-500 to-indigo-600";
    if (percentage >= 70) return "from-yellow-500 to-orange-600";
    if (percentage >= 60) return "from-orange-500 to-red-600";
    return "from-red-500 to-red-700";
  };

  const getQuestionGradeStatus = (studentGrade, maxGrade) => {
    if (studentGrade === maxGrade) return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" };
    if (studentGrade > 0) return { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-100" };
    return { icon: XCircle, color: "text-red-600", bg: "bg-red-100" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-600 mr-3" />
        <span className="text-gray-600 text-lg">Loading exam details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Exams</span>
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Exam Details</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!examDetails) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No Exam Details Found</h3>
        <p>Unable to load the exam details.</p>
      </div>
    );
  }

  const { exam, student, grade_summary, question_details } = examDetails;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Exams</span>
        </button>
        
        <button
          onClick={refreshDetails}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          Exam Details
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Detailed breakdown of {student.name}'s performance in {exam.name}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{student.name}</div>
              <div className="text-sm text-gray-600">Student</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{exam.name}</div>
              <div className="text-sm text-gray-600">Exam</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {grade_summary.total_grade} / {grade_summary.max_total_grade}
              </div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{grade_summary.percentage}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Grade Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {grade_summary.total_grade} / {grade_summary.max_total_grade}
            </div>
            <div className="text-sm text-gray-600">Final Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{grade_summary.percentage}%</div>
            <div className="text-sm text-gray-600">Percentage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{exam.num_of_questions}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Performance</span>
            <span className="text-sm font-medium text-gray-800">{grade_summary.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`bg-gradient-to-r ${getGradeColor(grade_summary.total_grade, grade_summary.max_total_grade)} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${grade_summary.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Questions Details */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Question-by-Question Breakdown</h3>
        
        <div className="space-y-6">
          {question_details.map((question, index) => {
            const status = getQuestionGradeStatus(question.student_grade, question.max_grade);
            const StatusIcon = status.icon;
            
            return (
              <div key={question.question_id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${status.bg}`}>
                      <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">Question {index + 1}</h4>
                      <p className="text-gray-700 mb-3">{question.question_text}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {question.student_grade} / {question.max_grade}
                    </div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {/* <div className="bg-white rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-2">Student Answer</div>
                    <div className="text-gray-800">
                      {question.student_answer || "No answer provided"}
                    </div>
                  </div> */}
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-2">Correct Answer</div>
                    <div className="text-gray-800">{question.correct_answer}</div>
                  </div>
                </div>

                {question.explanation && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">Explanation</div>
                    <div className="text-blue-700">{question.explanation}</div>
                  </div>
                )}

                {/* Question Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Question Score</span>
                    <span className="text-sm font-medium text-gray-800">
                      {Math.round((question.student_grade / question.max_grade) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getGradeColor(question.student_grade, question.max_grade)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${(question.student_grade / question.max_grade) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
