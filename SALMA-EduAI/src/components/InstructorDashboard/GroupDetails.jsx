import { useState } from "react";
import { ArrowLeft, Eye, Search, Filter, TrendingUp, Trophy, Users } from "lucide-react";

export default function GroupDetails({ group, onStudentSelect, onBack }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [students] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@university.edu",
      finalGrade: 92.5,
      examsTaken: 3,
      averageGrade: 92.5,
      status: "excellent",
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@university.edu",
      finalGrade: 87.3,
      examsTaken: 3,
      averageGrade: 87.3,
      status: "good",
    },
    {
      id: 3,
      name: "Omar Al-Rashid",
      email: "omar.alrashid@university.edu",
      finalGrade: 78.9,
      examsTaken: 2,
      averageGrade: 78.9,
      status: "satisfactory",
    },
    {
      id: 4,
      name: "Emily Johnson",
      email: "emily.johnson@university.edu",
      finalGrade: 95.1,
      examsTaken: 3,
      averageGrade: 95.1,
      status: "excellent",
    },
    {
      id: 5,
      name: "Mohammed Ali",
      email: "mohammed.ali@university.edu",
      finalGrade: 83.7,
      examsTaken: 3,
      averageGrade: 83.7,
      status: "good",
    },
  ]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "grade":
        return b.finalGrade - a.finalGrade;
      case "exams":
        return b.examsTaken - a.examsTaken;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "satisfactory":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
              {group?.name}
            </h1>
            <p className="text-gray-600">
              {group?.code} • {group?.semester} • {students.length} Students
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {(students.reduce((sum, s) => sum + s.finalGrade, 0) / students.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Class Average</div>
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
                {Math.max(...students.map(s => s.finalGrade)).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Highest Grade</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-xl">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {students.filter(s => s.status === "excellent").length}
              </div>
              <div className="text-sm text-gray-600">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-700"
            >
              <option value="name">Name</option>
              <option value="grade">Grade</option>
              <option value="exams">Exams Taken</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Final Grade</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Exams Taken</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-sky-50/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {student.finalGrade.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-gray-700">{student.examsTaken}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onStudentSelect(student)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
