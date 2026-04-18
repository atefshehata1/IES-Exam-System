import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreateExam from "./pages/CreateExam";
import Grades from "./pages/Grades";
import Login from "./components/Home/Login";
import Register from "./components/Home/Register";
import QuestionGenerator from "./pages/GenerateQuestion";
import QuestionsDisplay from "./pages/DisplayQuestions";
import { PDFProvider } from "./context/PDFContext";
import CreateFullExam from "./pages/CreateFullExam";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import JoinSubject from "./components/JoinSubject";
import { useAuth } from "./context/AuthProvider";
import { getRoleBasedRoute } from "./utils/navigation";
import ScrollToTop from "./components/common/ScrollToTop";

// Component for handling 404/unauthorized access
function NotFoundRedirect() {
  const { currentUser } = useAuth();
  const redirectTo = currentUser ? getRoleBasedRoute(currentUser) : "/";
  return <Navigate to={redirectTo} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <PDFProvider>
        <Router>
          <ScrollToTop />
          <AuthProvider>
            <div className="min-h-screen flex flex-col theme-transition">
              <Navbar />
              <main className="pt-20 flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/login"
                    element={
                      <GuestRoute>
                        <Login />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <GuestRoute>
                        <Register />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute allowedRoles={["teacher", "instructor"]}>
                        <CreateExam />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create/full"
                    element={
                      <ProtectedRoute allowedRoles={["teacher", "instructor"]}>
                        <CreateFullExam />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/grades"
                    element={
                      <ProtectedRoute allowedRoles={["teacher", "instructor"]}>
                        <Grades />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/generate"
                    element={
                      <ProtectedRoute allowedRoles={["teacher", "instructor"]}>
                        <QuestionGenerator />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/questions"
                    element={
                      <ProtectedRoute allowedRoles={["teacher", "instructor"]}>
                        <QuestionsDisplay />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["teacher", "instructor"]}>
                        <InstructorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Subject join route - accessible to all users */}
                  <Route
                    path="/join-subject/:teacherId/:subjectId"
                    element={<JoinSubject />}
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFoundRedirect />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Router>
      </PDFProvider>
    </ThemeProvider>
  );
}
