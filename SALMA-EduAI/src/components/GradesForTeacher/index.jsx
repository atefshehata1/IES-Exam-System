// main component for the Grades page
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useNotifications } from "../../hooks/useNotifications";
import { Header } from "./Header";
import { FileUpload } from "./FileUpload";
import { StudentsTable } from "./StudentsTable";
import { StudentDetail } from "./StudentDetail";
import { EmptyState } from "./EmptyState";
import { ExamSelector } from "./ExamSelector";
import { StudentSelector } from "./StudentSelector";
import { Notification } from "../Notification";

export default function Grades() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [studentsData, setStudentsData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState(null);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');

  // Use the stable notifications hook
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Helper function to safely get current user - stable with useCallback
  const getCurrentUser = useCallback(() => {
    try {
      return currentUser || JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }, [currentUser]);

  const fetchTeacherExams = useCallback(async () => {
    setIsLoadingExams(true);
    setError(null);

    try {
      const user = getCurrentUser();

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:5000/teachers/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`Failed to fetch exams: ${response.status}`);
      }

      const data = await response.json();
      console.log("Teacher exams data:", data);

      setExams(data.exams || []);
    } catch (err) {
      console.error("Error fetching exams:", err);

      // Handle authentication errors
      if (
        err.message.includes("not authenticated") ||
        err.message.includes("Authentication failed")
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        addNotification("Session expired. Please log in again.", "error");
        navigate("/login");
        return;
      }

      const errorMessage = "Failed to load exams. Please try again.";
      setError(errorMessage);
      addNotification(errorMessage, "error");
    } finally {
      setIsLoadingExams(false);
    }
  }, [getCurrentUser, navigate, addNotification]);

  // Check authentication on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !user.id || !user.token) {
      setError("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }
    fetchTeacherExams();
  }, [getCurrentUser, navigate, fetchTeacherExams]);

  // Separate effect to handle exam selection changes
  useEffect(() => {
    if (selectedExam) {
      // Reset other states when selecting a new exam
      setStudentsData(null);
      setSelectedStudent(null);
      setFiles([]);
      setSelectedStudentForGrading(null);
      setError(null);
    }
  }, [selectedExam]);
  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    addNotification(`Selected exam: ${exam.name}`, "info");
  };

  const handleStudentSelect = (student) => {
    setSelectedStudentForGrading(student);
    setError(null);
  };
  const handleEvaluate = async () => {
    if (!selectedExam) {
      const errorMessage = "Please select an exam first";
      setError(errorMessage);
      addNotification(errorMessage, "warning");
      return;
    }

    if (!selectedStudentForGrading) {
      const errorMessage = "Please select a student first";
      setError(errorMessage);
      addNotification(errorMessage, "warning");
      return;
    }

    if (files.length === 0) {
      const errorMessage = "Please upload answer sheet photos";
      setError(errorMessage);
      addNotification(errorMessage, "warning");
      return;
    }

    // Validate that the number of uploaded photos matches the number of questions
    if (files.length !== selectedExam.num_of_questions) {
      const errorMessage = `This exam has ${selectedExam.num_of_questions} questions. Please upload exactly ${selectedExam.num_of_questions} photos (one photo per question).`;
      setError(errorMessage);
      addNotification(errorMessage, "warning");
      return;
    }

    setIsEvaluating(true);
    setGradingProgress(0);
    setProcessingStatus('Preparing for evaluation...');
    setError(null);
    setStudentsData(null);
    setSelectedStudent(null);

    try {
      const user = getCurrentUser();

      if (!user || !user.id || !user.token) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const studentId = selectedStudentForGrading.id || selectedStudentForGrading._id;

      setProcessingStatus('Uploading answer sheets...');
      setGradingProgress(20);
      
      // Create FormData for all the question photos
      const formData = new FormData();
      // Add all photos to the form data - each photo represents one question answer
      files.forEach((file) => {
        formData.append("images", file);
      });

      addNotification(
        `Starting evaluation for ${selectedStudentForGrading.name} - ${files.length} answer sheets`,
        "info"
      );

      console.log(
        `Uploading ${files.length} photos for ${
          selectedExam.num_of_questions
        } questions for student: ${
          selectedStudentForGrading.name || selectedStudentForGrading.firstName
        } (ID: ${studentId})`
      );

      setProcessingStatus('AI is analyzing answers...');
      setGradingProgress(60);

      // Call the grading endpoint with all photos at once
      const response = await fetch(
        `http://localhost:5000/teachers/${user.id}/exams/${selectedExam._id}/grade/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      setGradingProgress(90);
      setProcessingStatus('Finalizing results...');

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        let errorMessage = "Failed to grade exam";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const gradingData = await response.json();
      console.log("Grading result:", gradingData);
      
      setGradingProgress(100);
      setProcessingStatus('Evaluation complete!');

      // Process the single student's grading result
      const studentResult = {
        id: studentId,
        name:
          selectedStudentForGrading.name ||
          selectedStudentForGrading.firstName +
            " " +
            (selectedStudentForGrading.lastName || ""),
        totalGrade: gradingData.total_grade,
        maxTotalGrade: gradingData.max_total_grade,
        percentage: (
          (gradingData.total_grade / gradingData.max_total_grade) *
          100
        ).toFixed(1),
        questionDetails: gradingData.question_details || [],
        examTitle: selectedExam.title,
      };

      // Set the processed student data as an array with one student
      setStudentsData([studentResult]);
      
      // Show success notification
      addNotification(
        `Successfully evaluated ${selectedStudentForGrading.name}! Score: ${studentResult.percentage}%`,
        "success"
      );
      
      // Clear files after successful evaluation
      setFiles([]);
      
    } catch (err) {
      console.error("Error during evaluation:", err);

      // Handle authentication errors
      if (
        err.message.includes("not authenticated") ||
        err.message.includes("Authentication failed")
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        addNotification("Session expired. Please log in again.", "error");
        navigate("/login");
        return;
      }

      const errorMessage = err.message || "Failed to evaluate exam. Please try again.";
      setError(errorMessage);
      addNotification(errorMessage, "error");
    } finally {
      setIsEvaluating(false);
      setGradingProgress(0);
      setProcessingStatus('');
    }
  };

  const handleStudentClick = async (studentId) => {
    try {
      setError(null);

      // Find the student data
      const studentData = studentsData.find((s) => s.id === studentId);
      if (!studentData) {
        setError("Student data not found");
        return;
      }

      // Use the detailed question information already available from the grading response
      const detailedQuestions = studentData.questionDetails.map(
        (detail, index) => ({
          questionId: detail.question_id,
          questionText: detail.question_text,
          grade: detail.grade,
          maxGrade: detail.max_grade,
          explanation: detail.explanation,
          studentAnswer: detail.student_answer,
          idealAnswer: detail.ideal_answer,
          questionNumber: index + 1,
        })
      );

      setSelectedStudent({
        studentId: studentId,
        studentName: studentData.name,
        fileName: studentData.fileName,
        totalGrade: studentData.totalGrade,
        maxTotalGrade: studentData.maxTotalGrade,
        percentage: studentData.percentage,
        questions: detailedQuestions,
      });
    } catch (err) {
      console.error("Error processing student details:", err);
      setError("Failed to load student details");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 flex-1 mt-8">
      {/* Notification components */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      
      <Header selectedExam={selectedExam} />
      {/* Exam Selection Section */}
      <div className="mb-8">
        <ExamSelector
          exams={exams}
          selectedExam={selectedExam}
          onExamSelect={handleExamSelect}
          isLoading={isLoadingExams}
          error={error}
        />
      </div>{" "}
      {/* Only show file upload and grading if an exam is selected */}
      {selectedExam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {/* Student Selection */}
            <StudentSelector
              teacherId={getCurrentUser()?.id}
              selectedStudent={selectedStudentForGrading}
              onStudentSelect={handleStudentSelect}
              error={null}
            />

            <FileUpload
              files={files}
              setFiles={setFiles}
              handleEvaluate={handleEvaluate}
              isEvaluating={isEvaluating}
              selectedExam={selectedExam}
              gradingProgress={gradingProgress}
              processingStatus={processingStatus}
            />
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}            {studentsData ? (
              <StudentsTable
                studentsData={studentsData}
                handleStudentClick={handleStudentClick}
                selectedExam={selectedExam}
              />
            ) : (
              <EmptyState />
            )}            {selectedStudent && (
              <StudentDetail 
                selectedStudent={selectedStudent} 
                selectedExam={selectedExam}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
