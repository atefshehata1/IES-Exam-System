// student detail component for displaying individual student grades
import { Award, TrendingUp, TrendingDown, Target, FileText, Star, CheckCircle2 } from "lucide-react";

export function StudentDetail({ selectedStudent, selectedExam }) {
  const getGradeColor = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (percentage >= 70)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (percentage >= 60)
      return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getOverallGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 80) return "text-blue-600 bg-blue-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    if (percentage >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 90) return <Award className="w-5 h-5 text-yellow-500" />;
    if (percentage >= 80) return <Star className="w-5 h-5 text-blue-500" />;
    if (percentage >= 70) return <TrendingUp className="w-5 h-5 text-green-500" />;
    return <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getQuestionPerformanceLabel = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Satisfactory";
    if (percentage >= 60) return "Needs Improvement";
    return "Poor";
  };

  // Calculate additional statistics
  const averageQuestionScore = selectedStudent.questions.length > 0
    ? (selectedStudent.questions.reduce((sum, q) => sum + (q.grade / q.maxGrade) * 100, 0) / selectedStudent.questions.length).toFixed(1)
    : 0;

  const excellentQuestions = selectedStudent.questions.filter(q => (q.grade / q.maxGrade) * 100 >= 90).length;
  const goodQuestions = selectedStudent.questions.filter(q => (q.grade / q.maxGrade) * 100 >= 80 && (q.grade / q.maxGrade) * 100 < 90).length;
  const needsImprovementQuestions = selectedStudent.questions.filter(q => (q.grade / q.maxGrade) * 100 < 70).length;

  return (
    <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {selectedStudent.studentName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedStudent.studentName}</h2>
              {selectedExam && (
                <p className="text-blue-100 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {selectedExam.name}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              {getPerformanceIcon(parseFloat(selectedStudent.percentage))}
              <span className="text-3xl font-bold">{selectedStudent.percentage}%</span>
            </div>
            <div className="text-blue-100">Overall Performance</div>
          </div>
        </div>
      </div>

      {/* Enhanced Student Summary */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-gray-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {selectedStudent.totalGrade}/{selectedStudent.maxTotalGrade}
            </div>
            <div className="text-sm text-gray-500">Total Score</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold px-4 py-2 rounded-full ${getOverallGradeColor(
                parseFloat(selectedStudent.percentage)
              )}`}
            >
              {parseFloat(selectedStudent.percentage) >= 90
                ? "A"
                : parseFloat(selectedStudent.percentage) >= 80
                ? "B"
                : parseFloat(selectedStudent.percentage) >= 70
                ? "C"
                : parseFloat(selectedStudent.percentage) >= 60
                ? "D"
                : "F"}
            </div>
            <div className="text-sm text-gray-500">Letter Grade</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {averageQuestionScore}%
            </div>
            <div className="text-sm text-gray-500">Avg Question Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {selectedStudent.questions.length}
            </div>
            <div className="text-sm text-gray-500">Questions Answered</div>
          </div>
        </div>

        {/* Question Performance Distribution */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            {excellentQuestions} Excellent
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            {goodQuestions} Good
          </div>
          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
            {needsImprovementQuestions} Needs Improvement
          </div>
        </div>
      </div>

      {/* Enhanced Question Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-gray-600" />
          Question-by-Question Analysis
        </h3>
        <div className="space-y-4">
          {selectedStudent.questions.map((question) => (
            <div
              key={question.questionId}
              className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${getGradeColor(
                question.grade,
                question.maxGrade
              )}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      Question {question.questionNumber}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getGradeColor(question.grade, question.maxGrade)
                    }`}>
                      {getQuestionPerformanceLabel(question.grade, question.maxGrade)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {question.questionText}
                  </p>
                </div>
                <div className="ml-6 text-right">
                  <div className="text-2xl font-bold">
                    {question.grade}/{question.maxGrade}
                  </div>
                  <div className="text-sm text-gray-600">
                    {((question.grade / question.maxGrade) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Enhanced Explanation with Student and Ideal Answers */}
              <div className="mt-4 space-y-3">
                {/* Student Answer Section */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Student's Answer:
                  </h5>
                  <p className="text-sm text-blue-800 leading-relaxed bg-white p-3 rounded border">
                    {question.studentAnswer || "No answer text extracted from the image."}
                  </p>
                </div>

                {/* Ideal Answer Section */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ideal Answer:
                  </h5>
                  <p className="text-sm text-green-800 leading-relaxed bg-white p-3 rounded border">
                    {question.idealAnswer || "No ideal answer provided."}
                  </p>
                </div>

                {/* AI Grading Analysis */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="text-sm font-semibold text-purple-700 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    AI Grading Analysis:
                  </h5>
                  <p className="text-sm text-purple-800 leading-relaxed bg-white p-3 rounded border">
                    {question.explanation || "No detailed explanation provided for this question."}
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        ((question.grade / question.maxGrade) * 100) >= 90 ? 'bg-green-500' :
                        ((question.grade / question.maxGrade) * 100) >= 80 ? 'bg-blue-500' :
                        ((question.grade / question.maxGrade) * 100) >= 70 ? 'bg-yellow-500' :
                        ((question.grade / question.maxGrade) * 100) >= 60 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(question.grade / question.maxGrade) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    Performance: {getQuestionPerformanceLabel(question.grade, question.maxGrade)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Performance Summary */}
      <div className="bg-blue-50 p-6 border-t">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-3">Score Distribution</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Excellent Questions (90%+):</span>
                <span className="font-medium">{excellentQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Good Questions (80-89%):</span>
                <span className="font-medium">{goodQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Needs Improvement (&lt;70%):</span>
                <span className="font-medium">{needsImprovementQuestions}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-3">Key Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Question Score:</span>
                <span className="font-medium">{averageQuestionScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium">{selectedStudent.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Submission File:</span>
                <span className="font-medium text-xs truncate max-w-xs">{selectedStudent.fileName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
