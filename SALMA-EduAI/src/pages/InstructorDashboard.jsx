import { useState } from "react";
import { MessageSquare } from "lucide-react";
import Sidebar from "../components/InstructorDashboard/Sidebar";
import GroupOverview from "../components/InstructorDashboard/GroupOverview";
import SubjectStudents from "../components/InstructorDashboard/SubjectStudents";
import StudentExams from "../components/InstructorDashboard/StudentExams";
import CreateExam from "../components/InstructorDashboard/CreateExam";
import CorrectExam from "../components/InstructorDashboard/CorrectExam";
import InstructorProfile from "../components/InstructorDashboard/InstructorProfile";
import ExamDetails from "../components/InstructorDashboard/ExamDetails";
import { useAuth } from "../context/AuthProvider";

export default function InstructorDashboard() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([{ label: "Overview", page: "overview" }]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const updateBreadcrumbs = (page, additionalData = {}) => {
    let newBreadcrumbs = [{ label: "Overview", page: "overview" }];
    
    switch (page) {
      case "subject-students":
        newBreadcrumbs.push({ 
          label: additionalData.subjectName || "Subject", 
          page: "subject-students" 
        });
        break;
      case "student-exams":
        newBreadcrumbs.push(
          { label: additionalData.subjectName || "Subject", page: "subject-students" },
          { label: additionalData.studentName || "Student", page: "student-exams" }
        );
        break;
      case "exam-details":
        newBreadcrumbs.push(
          { label: additionalData.subjectName || "Subject", page: "subject-students" },
          { label: additionalData.studentName || "Student", page: "student-exams" },
          { label: "Exam Details", page: "exam-details" }
        );
        break;
      case "create-exam":
        newBreadcrumbs.push({ label: "Create Exam", page: "create-exam" });
        break;
      case "correct-exam":
        newBreadcrumbs.push({ label: "Correct Exam", page: "correct-exam" });
        break;
      case "profile":
        newBreadcrumbs.push({ label: "Profile", page: "profile" });
        break;
      case "appeals":
        newBreadcrumbs.push({ label: "Appeals", page: "appeals" });
        break;
    }
    
    setBreadcrumbs(newBreadcrumbs);
  };

  const navigateToPage = (page, additionalData = {}) => {
    setIsLoading(true);
    setCurrentPage(page);
    updateBreadcrumbs(page, additionalData);
    
    // Reduced loading time for faster transitions
    setTimeout(() => setIsLoading(false), 150);
  };

  const handleViewExamDetails = (examId, studentId) => {
    setSelectedExamId(examId);
    setSelectedStudent({ _id: studentId, ...selectedStudent });
    navigateToPage("exam-details", {
      subjectName: selectedSubject?.name,
      studentName: selectedStudent?.name
    });
  };

  const handleBreadcrumbClick = (targetPage, index) => {
    setIsLoading(true);
    setCurrentPage(targetPage);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setTimeout(() => setIsLoading(false), 100);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "overview":
        return (
          <GroupOverview
            onGroupSelect={(group) => {
              setSelectedSubject(group);
              navigateToPage("subject-students", { subjectName: group?.name });
            }}
          />
        );
      case "subject-students":
        return (
          <SubjectStudents
            subject={selectedSubject}
            onBack={() => navigateToPage("overview")}
            onStudentSelect={(student, subject) => {
              setSelectedStudent(student);
              setSelectedSubject(subject);
              navigateToPage("student-exams", {
                subjectName: subject?.name,
                studentName: student?.name
              });
            }}
          />
        );
      case "student-exams":
        return (
          <StudentExams
            student={selectedStudent}
            subject={selectedSubject}
            onBack={() => navigateToPage("subject-students", { subjectName: selectedSubject?.name })}
            onViewExamDetails={handleViewExamDetails}
          />
        );
      case "exam-details":
        return (
          <ExamDetails
            teacherId={currentUser?.id}
            examId={selectedExamId}
            studentId={selectedStudent?._id}
            onBack={() => navigateToPage("student-exams", {
              subjectName: selectedSubject?.name,
              studentName: selectedStudent?.name
            })}
          />
        );
      case "create-exam":
        return <CreateExam />;
      case "correct-exam":
        return <CorrectExam />;
      case "profile":
        return <InstructorProfile />;
      case "appeals":
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-sky-100 text-center">
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Appeals Management</h1>
                <p className="text-lg text-gray-600 mb-4">Coming Soon</p>
                <p className="text-gray-500 max-w-md mx-auto">
                  We're developing a comprehensive appeals management system that will allow instructors to review and respond to student grade appeals. This feature will be available in a future update.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigateToPage("overview")}
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  Back to Overview
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <GroupOverview
            onGroupSelect={(group) => {
              setSelectedSubject(group);
              navigateToPage("subject-students", { subjectName: group?.name });
            }}
          />
        );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-100">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className={`fixed left-0 top-20 bottom-0 z-20 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-80'
        }`}>
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={(page) => navigateToPage(page)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-80'
        } p-6 pb-12`}>
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            {breadcrumbs.length > 1 && (
              <nav className="flex mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <button
                        onClick={() => handleBreadcrumbClick(crumb.page, index)}
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                          index === breadcrumbs.length - 1 
                            ? 'text-gray-900 cursor-default' 
                            : 'text-blue-500 hover:underline'
                        }`}
                        disabled={index === breadcrumbs.length - 1}
                      >
                        {crumb.label}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 text-sm">Loading...</p>
                </div>
              </div>
            ) : (
              /* Main Content with Fade Transition */
              <div className="animate-fadeIn">
                {renderCurrentPage()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
