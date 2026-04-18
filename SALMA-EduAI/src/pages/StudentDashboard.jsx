import { useState, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import Sidebar from "../components/StudentDashboard/Sidebar";
import TeacherList from "../components/StudentDashboard/TeacherList";
import TeacherSubjects from "../components/StudentDashboard/TeacherSubjects";
import SubjectExams from "../components/StudentDashboard/SubjectExams";
import ExamDetailsView from "../components/StudentDashboard/ExamDetailsView";
import ExamsOverview from "../components/StudentDashboard/ExamsOverview";
import ExamDetails from "../components/StudentDashboard/ExamDetails";
import StudentProfile from "../components/StudentDashboard/StudentProfile";
import JoinSubjects from "../components/StudentDashboard/JoinSubjects";

export default function StudentDashboard() {
  const [currentPage, setCurrentPage] = useState("teachers");
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleViewTeacherSubjects = useCallback((teacher) => {
    setSelectedTeacher(teacher);
    setCurrentPage("teacher-subjects");
  }, []);

  const handleBackToTeachers = useCallback(() => {
    setCurrentPage("teachers");
  }, []);

  const handleViewExams = useCallback((subject, teacher) => {
    setSelectedSubject(subject);
    // Only update teacher if it's different to prevent unnecessary re-renders
    if (!selectedTeacher || selectedTeacher.teacher_id !== teacher.teacher_id) {
      setSelectedTeacher(teacher);
    }
    setCurrentPage("subject-exams");
  }, [selectedTeacher]);

  const handleBackToTeacherSubjects = useCallback(() => {
    setCurrentPage("teacher-subjects");
  }, []);

  const handleViewExamDetails = useCallback((exam) => {
    setSelectedExam(exam);
    setCurrentPage("exam-details-view");
  }, []);

  const handleBackToSubjectExams = useCallback(() => {
    setCurrentPage("subject-exams");
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "teachers":
        return (
          <TeacherList 
            onViewTeacherSubjects={handleViewTeacherSubjects}
          />
        );
      case "teacher-subjects":
        return (
          <TeacherSubjects
            teacher={selectedTeacher}
            onBack={handleBackToTeachers}
            onViewExams={handleViewExams}
          />
        );
      case "subject-exams":
        return (
          <SubjectExams
            teacher={selectedTeacher}
            subject={selectedSubject}
            onBack={handleBackToTeacherSubjects}
            onViewExamDetails={handleViewExamDetails}
          />
        );
      case "exam-details-view":
        return (
          <ExamDetailsView
            teacher={selectedTeacher}
            exam={selectedExam}
            subject={selectedSubject}
            onBack={handleBackToSubjectExams}
          />
        );
      case "join-subjects":
        return <JoinSubjects />;
      case "exams":
        return (
          <ExamsOverview
            onExamSelect={(exam) => {
              setSelectedExam(exam);
              setCurrentPage("exam-details");
            }}
          />
        );
      case "exam-details":
        return (
          <ExamDetails
            exam={selectedExam}
            onBack={() => setCurrentPage("exams")}
          />
        );
      case "appeal":
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-sky-100 text-center">
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Appeal System</h1>
                <p className="text-lg text-gray-600 mb-4">Coming Soon</p>
                <p className="text-gray-500 max-w-md mx-auto">
                  We're working on implementing a comprehensive appeal system that will allow students to contest exam grades. This feature will be available in a future update.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage("exams")}
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  View Exams
                </button>
                <button
                  onClick={() => setCurrentPage("teachers")}
                  className="bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 px-6 py-3 rounded-xl font-medium hover:from-sky-100 hover:to-indigo-100 transition-all duration-300 border border-sky-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      case "profile":
        return <StudentProfile />;
      default:
        return (
          <TeacherList 
            onViewTeacherSubjects={handleViewTeacherSubjects}
          />
        );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      <div className="flex">
        <div className="fixed left-0 top-20 bottom-0 w-80 z-20">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
        <div className="flex-1 ml-80 p-6 pb-12">
          <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
        </div>
      </div>
    </div>
  );
}
