// student tables component
import { Eye, Download, Award, TrendingUp, TrendingDown } from "lucide-react";

export function StudentsTable({ studentsData, handleStudentClick, selectedExam }) {
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 80) return "text-blue-600 bg-blue-50";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50";
    if (percentage >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 85) return <Award className="w-4 h-4 text-yellow-500" />;
    if (percentage >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  // Calculate statistics
  const averageScore = studentsData.length > 0
    ? (studentsData.reduce((sum, student) => sum + parseFloat(student.percentage), 0) / studentsData.length).toFixed(1)
    : 0;
  
  const highestScore = studentsData.length > 0
    ? Math.max(...studentsData.map(s => parseFloat(s.percentage))).toFixed(1)
    : 0;
  
  const lowestScore = studentsData.length > 0
    ? Math.min(...studentsData.map(s => parseFloat(s.percentage))).toFixed(1)
    : 0;
  
  const excellentCount = studentsData.filter(s => parseFloat(s.percentage) >= 90).length;
  const goodCount = studentsData.filter(s => parseFloat(s.percentage) >= 80 && parseFloat(s.percentage) < 90).length;
  const needsImprovementCount = studentsData.filter(s => parseFloat(s.percentage) < 70).length;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header with enhanced statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Grading Results</h2>
          {selectedExam && (
            <div className="bg-white shadow-sm border border-purple-200 px-4 py-2 rounded-lg">
              <p className="text-sm text-purple-700">
                📊 <span className="font-medium">{selectedExam.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{studentsData.length}</div>
            <div className="text-xs text-gray-600">Total Submissions</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
            <div className="text-xs text-gray-600">Average Score</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{highestScore}%</div>
            <div className="text-xs text-gray-600">Highest Score</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{lowestScore}%</div>
            <div className="text-xs text-gray-600">Lowest Score</div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            {excellentCount} Excellent (90%+)
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            {goodCount} Good (80-89%)
          </div>
          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
            {needsImprovementCount} Needs Improvement (&lt;70%)
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                Student
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                Performance
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                Score
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                Grade
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studentsData.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-sm font-medium text-white">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {student.fileName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getPerformanceIcon(parseFloat(student.percentage))}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(
                        parseFloat(student.percentage)
                      )}`}
                    >
                      {student.percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="font-medium text-gray-900">
                    {student.totalGrade}/{student.maxTotalGrade}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${
                      getGradeColor(parseFloat(student.percentage)).split(" ")[0]
                    } bg-opacity-20`}
                  >
                    {parseFloat(student.percentage) >= 90
                      ? "A"
                      : parseFloat(student.percentage) >= 80
                      ? "B"
                      : parseFloat(student.percentage) >= 70
                      ? "C"
                      : parseFloat(student.percentage) >= 60
                      ? "D"
                      : "F"}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleStudentClick(student.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
