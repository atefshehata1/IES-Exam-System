import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Clock,
  User,
  BookOpen,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { teacherApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function ExamDetailsView({ teacher, exam, subject, onBack }) {
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchExamDetails = async () => {
      // Try to get the teacher ID from various possible field names
      const teacherId = teacher?.teacher_id || teacher?.id || teacher?._id;
      // Try to get the exam ID from various possible field names
      const examId = exam?.exam_id || exam?.id || exam?._id;
      const studentId = currentUser?.id || currentUser?._id;

      if (!teacherId || !examId || !studentId) {
        console.log("Missing required data for exam details:", {
          teacherId,
          examId,
          studentId,
        });
        setError("Missing required information to load exam details");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching exam details with:", {
          teacherId,
          examId,
          studentId,
        });
        const data = await teacherApi.getStudentExamDetails(
          teacherId,
          examId,
          studentId
        );
        console.log("Exam details response:", data);
        setExamDetails(data);
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError(err.message || "Failed to load exam details");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [teacher, exam, currentUser]);

  const getQuestionStatusIcon = (studentGrade, maxGrade) => {
    if (studentGrade === maxGrade) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (studentGrade > 0) {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getQuestionStatusColor = (studentGrade, maxGrade) => {
    if (studentGrade === maxGrade) {
      return "from-green-50 to-emerald-50 border-green-100";
    } else if (studentGrade > 0) {
      return "from-yellow-50 to-amber-50 border-yellow-100";
    } else {
      return "from-red-50 to-rose-50 border-red-100";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
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
              <h1 className="text-2xl font-bold text-gray-800">Exam Details</h1>
              <p className="text-gray-600">{exam?.exam_name || "Loading..."}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-600" />
            <p className="text-gray-600">Loading exam details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
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
              <h1 className="text-2xl font-bold text-gray-800">Exam Details</h1>
              <p className="text-gray-600">
                {exam?.exam_name || "Error loading exam"}
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">
                Error Loading Exam Details
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
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
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Exam Details</h1>
            <p className="text-gray-600">{examDetails.exam.name}</p>
          </div>
        </div>

        {/* Exam Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-sky-600" />
              <div>
                <p className="text-sm text-gray-600">Teacher</p>
                <p className="font-semibold text-sky-700">
                  {examDetails.teacher.name}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold text-purple-700">
                  {subject?.subject_name || subject?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Summary */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Grade Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Your Score</p>
                <p className="text-xl font-bold text-emerald-700">
                  {examDetails.grade_summary.total_grade}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-sky-600" />
              <div>
                <p className="text-sm text-gray-600">Full Mark</p>
                <p className="text-xl font-bold text-sky-700">
                  {examDetails.grade_summary.max_total_grade}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="text-xl font-bold text-indigo-700">
                  {examDetails.grade_summary.percentage}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-xl font-bold text-amber-700">
                  {examDetails.exam.num_of_questions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Details */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Question-by-Question Breakdown
        </h2>
        <div className="space-y-4">
          {examDetails.question_details.map((question, index) => (
            <div
              key={question.question_id}
              className={`bg-gradient-to-r ${getQuestionStatusColor(
                question.student_grade,
                question.max_grade
              )} p-6 rounded-2xl border`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getQuestionStatusIcon(
                    question.student_grade,
                    question.max_grade
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Question {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {question.student_grade} / {question.max_grade} points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Score</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round(
                      (question.student_grade / question.max_grade) * 100
                    )}
                    %
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Question:</h4>
                <p className="text-gray-700 bg-white/50 p-3 rounded-lg">
                  {question.question_text}
                </p>
              </div>

              {/* Correct Answer */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Correct Answer:
                </h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                  {question.correct_answer}
                </p>
              </div>

              {/* Student Answer */}
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Your Answer:</h4>
                <p className={`text-gray-700 p-3 rounded-lg border ${
                  question.student_answer === question.correct_answer 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  {question.student_answer || "No answer submitted"}
                </p>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Explanation:
                  </h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* Appeal Button - Coming Soon */}
              {question.student_grade < question.max_grade && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-amber-700">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Appeal
                      </span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Grade appeal functionality will be available in a future
                      update.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}










/**
 * من أبرز العوامل الداخلية التي أدت إلى سقوط الدولة العباسية ضعف الخلفاء في الفترات الأخيرة، والاعتماد الكبير عل
 * ى الوزراء والقادة العسكريين، بالإضافة إلى انتشار الفساد وسوء الإدارة، وظهور حركات انفصالية هددت وحدة الدولة.
 * 
 * 
 * 
 * من أبرز العوامل الداخلية التي أدت إلى سقوط الدولة العباسية ضعف الخلفاء في الفترات الأخيرة، والاعتماد الكبير على الوزراء والقادة العسكريين، بالإضافة إلى انتشار الفساد وسوء الإدارة، وظهور حركات انفصالية هددت وحدة الدولة.
 * الحروب الصليبية دفعت المسلمين إلى التوحد لمواجهة الخطر القادم من أوروبا، مما أدى إلى ظهور قادة أقوياء مثل صلاح الدين الأيوبي. كما حدثت بعض التغيرات الثقافية، حيث انتقلت بعض العلوم والمعارف من المسلمين إلى الأوروبيين، وبدأت أوروبا تهتم بالحضارة الإسلامية أكثر.
 * ساهمت الحركات الانفصالية في إضعاف الدولة العباسية من خلال تهديد وحدتها وتقويض سلطتها المركزية. هذه الحركات عملت على تقسيم الدولة إلى كيانات مستقلة أو شبه مستقلة، مما أضعف الموارد والقدرات العسكرية والإدارية للدولة العباسية.
 * كانت الدولة العثمانية تحمي العالم الإسلامي من الهجمات الأوروبية. كما حافظت على الدين الإسلامي ونشرت التعليم الديني، وأبقت اللغة العربية حاضرة في المؤسسات الدينية. أيضاً، جمعت الكثير من الدول الإسلامية تحت حكم واحد، مما ساعد على حفظ الهوية الإسلامية.
 * 
 */