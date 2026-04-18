import { useState, useEffect } from "react";
import {
  Users,
  Eye,
  BookOpen,
  TrendingUp,
  Calendar,
  Plus,
  RefreshCw,
  Share2,
} from "lucide-react";
import { teacherApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";
import SubjectInviteLink from "./SubjectInviteLink";

// Color options for different subjects
const colorOptions = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-pink-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-blue-500",
  "from-green-400 to-emerald-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-lime-400 to-green-500",
];

// Function to generate random but consistent data for each subject
const generateGroupFromSubject = (subject, index) => {
  // Handle both old string format and new object format
  const subjectName = typeof subject === "string" ? subject : subject.name;
  const studentCount =
    typeof subject === "object" ? subject.students_count : null;
  const examCount = typeof subject === "object" ? subject.exams_count : null;

  // Use subject name to generate consistent random values
  const subjectHash = subjectName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const baseRandom = Math.abs(subjectHash);

  // Generate realistic subject code
  const words = subjectName.split(" ");
  const code =
    words.length > 1
      ? words.map((w) => w.substring(0, 2).toUpperCase()).join("") +
        (101 + (baseRandom % 400))
      : subjectName.substring(0, 3).toUpperCase() + (101 + (baseRandom % 400));

  return {
    id: typeof subject === "object" ? subject.id : index + 1,
    name: subjectName,
    code: code,
    semester: "Fall 2024",
    studentCount: studentCount !== null ? studentCount : 25 + (baseRandom % 35), // Use real count or generate
    examCount: examCount !== null ? examCount : 2 + (baseRandom % 4), // Use real count or generate
    averageGrade: 75 + (baseRandom % 20), // 75-95%
    color: colorOptions[index % colorOptions.length],
    subject: subjectName,
  };
};

export default function GroupOverview({ onGroupSelect }) {
  const { currentUser } = useAuth();
  const [, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [selectedSubjectForShare, setSelectedSubjectForShare] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleShareSubject = (subject) => {
    setSelectedSubjectForShare(subject);
    setShowSharePopup(true);
  };

  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
    setSelectedSubjectForShare(null);
  };

  // Fetch teacher subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError("");
        const response = await teacherApi.getTeacherSubjects(currentUser.id);
        const fetchedSubjects = response.subjects || [];
        setSubjects(fetchedSubjects);

        // Generate groups from subjects
        const generatedGroups = fetchedSubjects.map((subject, index) =>
          generateGroupFromSubject(subject, index)
        );
        setGroups(generatedGroups);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [currentUser?.id]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          Your Classes Overview
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your groups, track student progress, and monitor exam
          performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {loading
                  ? "..."
                  : groups.reduce(
                      (total, group) => total + group.studentCount,
                      0
                    )}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {loading ? "..." : groups.length}
              </div>
              <div className="text-sm text-gray-600">Active Classes</div>
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
                {loading
                  ? "..."
                  : groups.reduce((total, group) => total + group.examCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-sky-600" />
            Your Classes
          </h2>
          {groups.length > 0 && (
            <span className="text-sm text-gray-600">
              {groups.length} {groups.length === 1 ? "class" : "classes"}{" "}
              available
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-gray-600">Loading your classes...</span>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-8">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Classes Available
              </h3>
              <p className="text-gray-600 mb-4">
                You don't have any subjects added yet. Add subjects in your
                profile to create classes.
              </p>
              <div className="text-sm text-gray-500">
                Go to Profile → Teaching Subjects → Add Subject
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
              >
                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${group.color} p-6 text-white relative`}
                >
                  <div className="absolute top-4 right-4 opacity-20">
                    <BookOpen className="w-12 h-12" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">{group.name}</h3>
                    <p className="text-sm opacity-90">
                      {group.code} • {group.semester}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {group.studentCount}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {group.examCount}
                      </div>
                      <div className="text-sm text-gray-600">Exams</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onGroupSelect(group)}
                      className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:from-sky-600 group-hover:to-indigo-700"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleShareSubject(group)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Standalone Share Popup */}
      {showSharePopup && selectedSubjectForShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <SubjectInviteLink 
              subject={selectedSubjectForShare} 
              teacherId={currentUser?.id}
              onClose={handleCloseSharePopup}
              standalone={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
