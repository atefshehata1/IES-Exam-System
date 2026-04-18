import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, FileText, Calendar, Award, TrendingUp, AlertCircle, Loader2, Clock, CheckCircle } from "lucide-react";
import { studentApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function SubjectExams({ teacher, subject, onBack, onViewExamDetails }) {
  const [examsData, setExamsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedKey, setLastFetchedKey] = useState(null);
  const { currentUser } = useAuth();

  // Extract stable IDs to prevent unnecessary re-renders - memoized for performance
  const { teacherId, subjectId, studentId } = useMemo(() => ({
    teacherId: teacher?.teacher_id || teacher?.id || teacher?._id,
    subjectId: subject?.subject_id || subject?.id || subject?._id,
    studentId: currentUser?.id || currentUser?._id
  }), [teacher, subject, currentUser]);

  // Memoized fetch function for performance
  const fetchSubjectExams = useCallback(async () => {
    if (!studentId || !teacherId || !subjectId) {
      setError("Missing required information to load exams");
      setLoading(false);
      return;
    }
    
    // Create a unique key for this combination
    const fetchKey = `${studentId}-${teacherId}-${subjectId}`;
    
    // Prevent refetching if we already have data for this combination
    if (lastFetchedKey === fetchKey && examsData) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getStudentSubjectExams(teacherId, subjectId, studentId);
      setExamsData(data);
      setLastFetchedKey(fetchKey);
    } catch (err) {
      console.error("Error fetching subject exams:", err);
      setError(err.message || "Failed to load exam details");
    } finally {
      setLoading(false);
    }
  }, [studentId, teacherId, subjectId, lastFetchedKey, examsData]);

  useEffect(() => {
    fetchSubjectExams();
  }, [fetchSubjectExams]);

  // Reset cache when component unmounts
  useEffect(() => {
    return () => {
      setLastFetchedKey(null);
    };
  }, []);

  // Reset cache when teacher or subject changes
  useEffect(() => {
    const currentKey = `${studentId}-${teacherId}-${subjectId}`;
    if (currentKey !== lastFetchedKey) {
      setExamsData(null);
      setLastFetchedKey(null);
    }
  }, [studentId, teacherId, subjectId, lastFetchedKey]);

  // Memoized grade calculation functions for performance
  const getGradeColor = useCallback((grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "text-emerald-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-red-600";
  }, []);

  const getGradeBg = useCallback((grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "from-emerald-50 to-green-50 border-emerald-100";
    if (percentage >= 80) return "from-blue-50 to-sky-50 border-blue-100";
    if (percentage >= 70) return "from-amber-50 to-orange-50 border-amber-100";
    return "from-red-50 to-rose-50 border-red-100";
  }, []);

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
              <h1 className="text-2xl font-bold text-gray-800">Subject Exams</h1>
              <p className="text-gray-600">{subject?.subject_name}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-600" />
            <p className="text-gray-600">Loading exams...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Subject Exams</h1>
              <p className="text-gray-600">{subject?.subject_name}</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Exams</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examsData || examsData.exams.length === 0) {
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
              <h1 className="text-2xl font-bold text-gray-800">Subject Exams</h1>
              <p className="text-gray-600">{examsData?.subject?.name || subject?.subject_name}</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Exams Taken</h3>
          <p className="text-gray-600">
            {examsData?.message || "You haven't taken any exams for this subject yet."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalGrade = examsData.exams.reduce((sum, exam) => sum + exam.student_grade, 0);
  const totalMaxGrade = examsData.exams.reduce((sum, exam) => sum + exam.full_mark, 0);
  const averagePercentage = totalMaxGrade > 0 ? Math.round((totalGrade / totalMaxGrade) * 100) : 0;

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
            <h1 className="text-2xl font-bold text-gray-800">Subject Exams</h1>
            <p className="text-gray-600">{examsData.subject.name}</p>
          </div>
        </div>

        {/* Subject Info */}
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-xl border border-sky-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">{examsData.subject.name}</h3>
              <p className="text-sky-600">Student: {examsData.student.name}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getGradeColor(totalGrade, totalMaxGrade)}`}>
                {averagePercentage}%
              </div>
              <div className="text-sm text-gray-600">Overall Average</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-sky-600" />
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-xl font-bold text-sky-700">{examsData.exams.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-xl font-bold text-emerald-700">{averagePercentage}%</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-xl font-bold text-indigo-700">{totalGrade}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Max Possible</p>
                <p className="text-xl font-bold text-amber-700">{totalMaxGrade}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Exams</h2>
        <div className="space-y-4">
          {examsData.exams.map((exam) => (
            <div 
              key={exam.exam_id} 
              className={`bg-gradient-to-r ${getGradeBg(exam.student_grade, exam.full_mark)} p-6 rounded-2xl border cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
              onClick={() => onViewExamDetails && onViewExamDetails(exam)}
            >
              {/* Exam Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{exam.exam_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.num_of_questions} questions</span>
                    </div>
                    {exam.date_taken && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(exam.date_taken).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-right ${getGradeColor(exam.student_grade, exam.full_mark)}`}>
                  <div className="text-2xl font-bold">{exam.student_grade}</div>
                  <div className="text-sm">/ {exam.full_mark}</div>
                </div>
              </div>

              {/* Grade Bar */}
              <div className="mb-4">
                <div className="bg-white/60 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${(exam.student_grade / exam.full_mark) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Score: {Math.round((exam.student_grade / exam.full_mark) * 100)}%</span>
                  <span>{exam.student_grade} / {exam.full_mark} points</span>
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
