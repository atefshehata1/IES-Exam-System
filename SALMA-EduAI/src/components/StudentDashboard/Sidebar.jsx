import { Users, FileText, MessageSquare, User, Bell, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthProvider";

export default function Sidebar({ currentPage, onPageChange }) {
  const { currentUser } = useAuth();
  const menuItems = [
    {
      id: "teachers",
      label: "View Teachers",
      icon: <Users className="w-5 h-5" />,
      description: "My enrolled courses",
    },
    {
      id: "join-subjects",
      label: "Join Subject",
      icon: <Plus className="w-5 h-5" />,
      description: "Join new subjects",
    },
    {
      id: "exams",
      label: "Exams Overview",
      icon: <FileText className="w-5 h-5" />,
      description: "View all exams",
    },
    {
      id: "appeal",
      label: "Submit Appeal",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Coming Soon",
    },
    {
      id: "profile",
      label: "Student Profile",
      icon: <User className="w-5 h-5" />,
      description: "Account settings",
    },
  ];  return (
    <div className="w-full h-full bg-white/60 backdrop-blur-lg border-r border-sky-200 shadow-lg overflow-y-auto relative">
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Student Portal</h2>
              <p className="text-sm text-gray-500">Academic Dashboard</p>
            </div>
          </div>
          

        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              disabled={item.id === "appeal"}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                item.id === "appeal"
                  ? "text-gray-400 cursor-not-allowed bg-gray-50"
                  : currentPage === item.id
                  ? "bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 shadow-md border border-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-all duration-300 ${
                  item.id === "appeal"
                    ? "bg-gray-200 text-gray-400"
                    : currentPage === item.id
                    ? "bg-sky-200 text-sky-700"
                    : "bg-gray-100 text-gray-500 group-hover:bg-sky-100 group-hover:text-sky-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>   
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
                {currentUser?.name || "Student"}
              </div>
              <div className="text-xs text-gray-600">
                {currentUser?.email || "student@university.edu"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
