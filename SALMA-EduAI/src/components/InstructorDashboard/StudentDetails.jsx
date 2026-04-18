import { useState } from "react";
import { ArrowLeft, Calendar, FileText, TrendingUp, Award, Eye } from "lucide-react";

export default function StudentDetails({ student, group, onBack }) {
  const [selectedExam, setSelectedExam] = useState(null);

  const [exams] = useState([
    {
      id: 1,
      name: "Midterm Exam",
      date: "2024-10-15",
      totalGrade: 92,
      maxGrade: 100,
      questions: [
        {
          id: 1,
          question: "What is the time complexity of binary search?",
          studentAnswer: "O(log n)",
          correctAnswer: "O(log n)",
          points: 10,
          maxPoints: 10,
          aiExplanation: "Perfect answer! The student correctly identified the logarithmic time complexity.",
        },
        {
          id: 2,
          question: "Explain the concept of inheritance in OOP",
          studentAnswer: "Inheritance allows a class to inherit properties and methods from another class",
          correctAnswer: "Inheritance is a fundamental OOP concept where a class inherits properties and methods from a parent class",
          points: 8,
          maxPoints: 10,
          aiExplanation: "Good understanding shown, but could have included more details about parent-child relationships and code reusability.",
        },
        {
          id: 3,
          question: "What is a hash table?",
          studentAnswer: "A data structure that uses hash function to map keys to values",
          correctAnswer: "A hash table is a data structure that implements an associative array abstract data type",
          points: 9,
          maxPoints: 10,
          aiExplanation: "Excellent answer demonstrating clear understanding of hash tables and their key-value mapping functionality.",
        },
      ],
    },
    {
      id: 2,
      name: "Final Exam",
      date: "2024-12-10",
      totalGrade: 88,
      maxGrade: 100,
      questions: [
        {
          id: 1,
          question: "Describe the MVC architecture pattern",
          studentAnswer: "MVC separates application into Model, View, and Controller components",
          correctAnswer: "MVC is an architectural pattern that separates an application into three main components: Model (data), View (UI), and Controller (logic)",
          points: 7,
          maxPoints: 10,
          aiExplanation: "Good basic understanding, but answer lacks detail about the responsibilities of each component and their interactions.",
        },
        {
          id: 2,
          question: "What is database normalization?",
          studentAnswer: "Process of organizing data to reduce redundancy and improve data integrity",
          correctAnswer: "Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity",
          points: 9,
          maxPoints: 10,
          aiExplanation: "Excellent answer! Shows clear understanding of normalization goals and benefits.",
        },
      ],
    },
  ]);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBadge = (percentage) => {
    if (percentage >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-sky-200 text-gray-600 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1
              className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Patrick Hand, cursive" }}
            >
              {student?.name}
            </h1>
            <p className="text-gray-600">
              {student?.email} • {group?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Student Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${getGradeColor(student?.finalGrade)}`}>
                {student?.finalGrade.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Final Grade</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{exams.length}</div>
              <div className="text-sm text-gray-600">Exams Taken</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {(exams.reduce((sum, exam) => sum + (exam.totalGrade / exam.maxGrade) * 100, 0) / exams.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {exams.length > 0 ? new Date(exams[exams.length - 1].date).toLocaleDateString() : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Last Exam</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg">
        <div className="p-6 border-b border-sky-200">
          <h2 className="text-xl font-bold text-gray-800">Exam History</h2>
          <p className="text-gray-600">Detailed breakdown of all examinations</p>
        </div>
        
        <div className="p-6 space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white/60 backdrop-blur-sm rounded-xl border border-sky-200 p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-3 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{exam.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(exam.date).toLocaleDateString()} • {exam.questions.length} Questions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getGradeColor((exam.totalGrade / exam.maxGrade) * 100)}`}>
                      {exam.totalGrade}/{exam.maxGrade}
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getGradeBadge(
                        (exam.totalGrade / exam.maxGrade) * 100
                      )}`}
                    >
                      {((exam.totalGrade / exam.maxGrade) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                    className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{selectedExam === exam.id ? "Hide" : "View"} Details</span>
                  </button>
                </div>
              </div>

              {/* Exam Details */}
              {selectedExam === exam.id && (
                <div className="mt-6 space-y-4 border-t border-sky-200 pt-4">
                  <h4 className="font-semibold text-gray-800">Question Breakdown</h4>
                  {exam.questions.map((question) => (
                    <div
                      key={question.id}
                      className="bg-gray-50 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-gray-800 flex-1">
                          Q{question.id}: {question.question}
                        </h5>
                        <span
                          className={`ml-4 font-bold ${getGradeColor((question.points / question.maxPoints) * 100)}`}
                        >
                          {question.points}/{question.maxPoints}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-gray-700">Student Answer:</strong>
                          <p className="text-gray-600 mt-1">{question.studentAnswer}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Expected Answer:</strong>
                          <p className="text-gray-600 mt-1">{question.correctAnswer}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <strong className="text-blue-800">AI Explanation:</strong>
                        <p className="text-blue-700 mt-1">{question.aiExplanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
