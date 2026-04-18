import {
  Users,
  FileText,
  CheckSquare,
  User,
  MessageSquare,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthProvider";

export default function Sidebar({ currentPage, onPageChange }) {
  const { currentUser } = useAuth();
  const menuItems = [
    {
      id: "overview",
      label: "Group Overview",
      icon: <Users className="w-5 h-5" />,
      description: "Manage your classes",
    },
    {
      id: "create-exam",
      label: "Create Exam",
      icon: <FileText className="w-5 h-5" />,
      description: "Design new assessments",
    },
    {
      id: "correct-exam",
      label: "Correct Exam",
      icon: <CheckSquare className="w-5 h-5" />,
      description: "Grade submissions",
    },
    {
      id: "appeals",
      label: "Appeals",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Coming Soon",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      description: "Account settings",
    },
  ];
  return (
    <div className="w-full h-full bg-white/60 backdrop-blur-sm border-r border-sky-200 shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-sky-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Patrick Hand, cursive" }}
            >
              IES
            </h1>
            <p className="text-sm text-gray-600">Instructor Dashboard</p>
          </div>
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            disabled={item.id === "appeals"}
            className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 group ${
              item.id === "appeals"
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : currentPage === item.id
                ? "bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 shadow-lg text-sky-700"
                : "hover:bg-white/80 hover:shadow-md text-gray-700 border-2 border-transparent"
            }`}
          >
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                item.id === "appeals"
                  ? "bg-gray-200 text-gray-400"
                  : currentPage === item.id
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md"
                  : "bg-sky-100 text-sky-600 group-hover:bg-sky-200"
              }`}
            >
              {item.icon}
            </div>
            <div className="text-left">
              <div className="font-semibold">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-xl border border-sky-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">
                {currentUser?.name || 'Instructor'}
              </div>
              <div className="text-xs text-gray-600">{currentUser?.email || 'instructor@university.edu'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
