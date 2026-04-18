import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionsDisplay/QuestionCard";
import QuestionEditor from "../components/QuestionGenerator/QuestionEditor";
import NotificationManager from "../components/Notification";

export default function QuestionsDisplay() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [examName, setExamName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const location = useLocation();
  const apiUrl = "http://localhost:5000";
  const processedLocationRef = useRef(null);

  // Initialize notification manager
  const { addNotification, NotificationList } = NotificationManager();

  // Calculate total marks from all questions
  const fullMark = questions.reduce((total, question) => {
    return total + (question.grade || 0);
  }, 0);
  useEffect(() => {
    const executionId = Math.random().toString(36).substr(2, 9);

    // Create a unique key for the current location state
    const locationStateKey = location.state
      ? JSON.stringify(location.state)
      : "no-state";

    // Check if we've already processed this exact location state
    if (processedLocationRef.current === locationStateKey) {
      return;
    }

    // Mark this location state as processed
    processedLocationRef.current = locationStateKey;

    // Load user information and extract teacher ID
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Check different possible ID fields
        const id = user.id || user._id || user.teacherId;
        if (id) {
          setTeacherId(id);
        } else {
          console.warn("Could not find teacher ID in user object");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    } // Load questions from sessionStorage
    const savedQuestions = sessionStorage.getItem("selectedQuestions");
    const initialQuestions = savedQuestions ? JSON.parse(savedQuestions) : [];

    console.log(
      `DEBUG: [${executionId}] Loaded ${initialQuestions.length} questions from sessionStorage`
    );

    // Check if we're coming from the generator with new questions
    if (location.state?.newQuestions) {
      console.log(
        `DEBUG: [${executionId}] Received new questions count:`,
        location.state.newQuestions.length
      );
      console.log(
        `DEBUG: [${executionId}] Existing questions count:`,
        initialQuestions.length
      );

      // Capture language from navigation state if provided
      // Note: Language handling removed as new endpoint doesn't use it

      // Show success message if provided
      if (location.state.successMessage) {
        addNotification(location.state.successMessage, "success");
      }

      // Since we now generate unique IDs with timestamps, we can simply append
      // But let's double-check for any actual duplicates just in case
      const existingIds = new Set(initialQuestions.map((q) => q.id));
      const trulyNewQuestions = location.state.newQuestions.filter((newQ) => {
        if (existingIds.has(newQ.id)) {
          console.log(
            `DEBUG: [${executionId}] Found actual duplicate ID (should be rare):`,
            newQ.id
          );
          return false;
        }
        return true;
      });

      console.log(
        `DEBUG: [${executionId}] Truly new questions count:`,
        trulyNewQuestions.length
      );

      // Additional safety check: ensure we don't add empty question lists
      if (trulyNewQuestions.length === 0) {
        console.log(
          `DEBUG: [${executionId}] No new questions to add, keeping existing state`
        );
        setQuestions(initialQuestions);
        return;
      }

      // Combine existing questions with new ones
      const combinedQuestions = [...initialQuestions, ...trulyNewQuestions];

      console.log(
        `DEBUG: [${executionId}] Final combined questions count:`,
        combinedQuestions.length
      );
      console.log(
        `DEBUG: [${executionId}] Combined questions IDs:`,
        combinedQuestions.map((q) => q.id)
      );

      setQuestions(combinedQuestions);
      sessionStorage.setItem(
        "selectedQuestions",
        JSON.stringify(combinedQuestions)
      );
      // Clear location state to prevent reappending on refresh
      window.history.replaceState({}, document.title);
    } else {
      console.log(
        `DEBUG: [${executionId}] No new questions, loading existing ${initialQuestions.length} questions`
      );
      setQuestions(initialQuestions);
    }
  }, [location.state, addNotification]);

  // Cleanup ref when component unmounts
  useEffect(() => {
    return () => {
      processedLocationRef.current = null;
    };
  }, []);

  // Debug effect to track when questions change
  useEffect(() => {
    console.log(
      "DEBUG: Questions state changed, current count:",
      questions.length
    );
    console.log(
      "DEBUG: Current question IDs:",
      questions.map((q) => `${q.id} - ${q.question?.substring(0, 50)}...`)
    );
  }, [questions]);

  // Load available subjects for the teacher
  const loadAvailableSubjects = async () => {
    setLoadingSubjects(true);

    try {
      const currentTeacherId = getCurrentTeacherId();
      console.log("DEBUG: Loading subjects for teacher:", currentTeacherId);

      // Call the API endpoint to get teacher's subjects
      const response = await fetch(
        `${apiUrl}/teachers/${currentTeacherId}/subjects`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("DEBUG: Loaded subjects from API:", data);

        if (data.subjects && data.subjects.length > 0) {
          // Map the response format to our expected format
          const mappedSubjects = data.subjects.map((subject) => ({
            _id: subject.id, // Your API returns 'id', not '_id'
            name: subject.name,
            students_count: subject.students_count,
            exams_count: subject.exams_count,
          }));

          setAvailableSubjects(mappedSubjects);
          console.log("DEBUG: Mapped subjects:", mappedSubjects);

          // If there's only one subject, select it automatically
          if (mappedSubjects.length === 1) {
            setSubjectId(mappedSubjects[0]._id);
            console.log("DEBUG: Auto-selected subject:", mappedSubjects[0]._id);
          }
          return;
        } else {
          console.log("DEBUG: No subjects found for teacher");
          // No subjects found, show appropriate message
          setAvailableSubjects([]);
          addNotification(
            "No subjects found. Please contact administrator to assign subjects.",
            "warning"
          );
          return;
        }
      } else {
        console.log("DEBUG: API call failed with status:", response.status);
        throw new Error(`API call failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);

      // Try fallback to localStorage as backup
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log(
            "DEBUG: Trying localStorage fallback, user object:",
            user
          );

          // Look for subject in various possible fields
          const fallbackSubjectId =
            user.subjectId ||
            user.subject ||
            user.subjects?.[0]?._id ||
            user.subjects?.[0];

          if (fallbackSubjectId) {
            console.log(
              "DEBUG: Found subject in localStorage:",
              fallbackSubjectId
            );
            setSubjectId(fallbackSubjectId);

            // Create a subject object for display
            const subjectName =
              user.subjects?.[0]?.name || user.subjectName || "Your Subject";
            setAvailableSubjects([
              { _id: fallbackSubjectId, name: subjectName },
            ]);
            return;
          }
        } catch (parseError) {
          console.error("Error parsing user for fallback subject:", parseError);
        }
      }

      // Final fallback - create a default subject
      console.log("DEBUG: Using final fallback subject");
      const defaultSubjectId = "default-subject-id";
      setSubjectId(defaultSubjectId);
      setAvailableSubjects([
        { _id: defaultSubjectId, name: "General Subject" },
      ]);
      addNotification(
        "Could not load subjects. Using default subject.",
        "warning"
      );
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Get current teacher ID - with fallback
  const getCurrentTeacherId = () => {
    if (teacherId) return teacherId;

    // If teacherId state is not set, try to get it directly from localStorage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user._id || user.teacherId || "fallback-teacher-id";
      }
    } catch (error) {
      console.error("Error accessing teacher ID:", error);
    }

    // If all else fails, return a fallback ID or show an error
    addNotification(
      "Could not determine teacher ID. Please login again.",
      "error"
    );
    return "fallback-teacher-id";
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
  };

  const handleSaveEdit = (editedQuestion) => {
    const updatedQuestions = questions.map((q) =>
      q.id === editedQuestion.id ? editedQuestion : q
    );
    setQuestions(updatedQuestions);
    sessionStorage.setItem(
      "selectedQuestions",
      JSON.stringify(updatedQuestions)
    );
    setEditingQuestion(null);
    addNotification("Question updated successfully", "success");
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestions(updatedQuestions);
      sessionStorage.setItem(
        "selectedQuestions",
        JSON.stringify(updatedQuestions)
      );
      addNotification("Question deleted successfully", "info");
    }
  };
  const createAndSaveExam = async () => {
    if (!showExamForm) {
      console.log("DEBUG: First click - showing exam form modal");
      // First click - show the form modal
      setShowExamForm(true);
      // Load available subjects when showing the form
      await loadAvailableSubjects();
      return;
    }

    console.log("DEBUG: Form submitted with values:", { 
      examName, 
      fullMark: fullMark, 
      calculatedFromQuestions: true 
    });
    console.log("DEBUG: examName type:", typeof examName, "value:", examName);
    console.log("DEBUG: Available questions:", questions.length);

    // Form submit handler
    console.log("DEBUG: Form validation starting...");
    console.log(
      "DEBUG: Current state - examName:",
      examName,
      "subjectId:",
      subjectId,
      "questions.length:",
      questions.length
    );

    if (questions.length === 0) {
      console.log("DEBUG: No questions available - showing warning");
      addNotification("No questions available to save", "warning");
      return;
    }

    if (!examName) {
      console.log("DEBUG: Empty or invalid exam name - showing warning");
      addNotification("Please enter an exam name", "warning");
      return;
    }

    if (!subjectId && availableSubjects.length > 0) {
      console.log(
        "DEBUG: No subject selected but subjects are available - showing warning"
      );
      addNotification("Please select a subject", "warning");
      return;
    }

    // If no subjects are available but we have a fallback subjectId, that's okay
    if (!subjectId && availableSubjects.length === 0) {
      console.log("DEBUG: No subjects available and no fallback subjectId");
      addNotification(
        "No subject available. Please contact administrator.",
        "error"
      );
      return;
    }

    if (!selectedLanguage) {
      console.log("DEBUG: No language selected - showing warning");
      addNotification("Please select a language", "warning");
      return;
    }

    try {
      console.log("DEBUG: Starting exam creation process");
      setIsLoading(true);
      const currentTeacherId = getCurrentTeacherId();
      console.log("DEBUG: Using teacher ID:", currentTeacherId);

      // Prepare questions data for the new endpoint with comprehensive validation
      const questionsData = questions.map((question, index) => {
        console.log(`DEBUG: Processing question ${index}:`, question);
        return {
          question:
            question.question && typeof question.question === "string"
              ? question.question.trim()
              : "",
          answer:
            question.answer && typeof question.answer === "string"
              ? question.answer.trim()
              : "",
          grade:
            question.grade && typeof question.grade === "number"
              ? question.grade
              : 10,
        };
      });

      console.log("DEBUG: Prepared questions data:", questionsData);
      console.log("DEBUG: Subject ID being sent:", subjectId);
      console.log("DEBUG: Subject ID type:", typeof subjectId);
      console.log("DEBUG: Exam name being sent:", examName);
      console.log("DEBUG: Exam name type:", typeof examName);

      // Prepare the request body with full validation
      const requestBody = {
        exam_name: examName || "",
        subject: subjectId || "",
        questions: questionsData,
        students: [],
        lang: selectedLanguage, // Include language for PDF generation
      };
      console.log("DEBUG: Full request body:", requestBody);

      // Additional validation to ensure we have a valid subject
      if (!requestBody.subject) {
        throw new Error("Subject ID is required and cannot be empty");
      }

      // Create exam with questions in one operation using the new endpoint
      console.log("DEBUG: Creating exam with questions using new endpoint");
      const createExamEndpoint = `${apiUrl}/teachers/${currentTeacherId}/exams/create-with-questions`;
      console.log("DEBUG: Calling endpoint:", createExamEndpoint);

      const createExamResponse = await fetch(createExamEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log(
        "DEBUG: Create exam response status:",
        createExamResponse.status
      );

      if (!createExamResponse.ok) {
        let errorData;
        let errorText = "";

        try {
          errorText = await createExamResponse.text();
          console.error("DEBUG: Raw response text:", errorText);
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          console.error("DEBUG: Could not parse error response:", parseError);
          errorData = { message: errorText || "Unknown error occurred" };
        }

        console.error("DEBUG: Failed to create exam. Error:", errorData);
        console.error("DEBUG: Response status:", createExamResponse.status);
        console.error("DEBUG: Response headers:", createExamResponse.headers);

        throw new Error(
          errorData.message || "Failed to create exam with questions"
        );
      }

      const responseData = await createExamResponse.json();
      console.log("DEBUG: Create exam response data:", responseData);

      // Store the exam ID for future reference
      if (responseData.exam?._id) {
        localStorage.setItem("examId", responseData.exam._id);
        console.log(
          "DEBUG: Stored exam ID in localStorage:",
          responseData.exam._id
        );
      }

      // Clear questions after successful submission
      console.log("DEBUG: Clearing questions from state and session storage");
      setQuestions([]);
      sessionStorage.removeItem("selectedQuestions");

      // Reset form and close it
      console.log("DEBUG: Resetting form and closing modal");
      setExamName("");
      setSubjectId("");
      setShowExamForm(false);

      // Show success notification
      console.log("DEBUG: Showing success notification");
      addNotification(
        responseData.message || `Exam "${examName}" created successfully!`,
        "success"
      );

      // Display PDF if available
      if (responseData.base64Pdf) {
        console.log("DEBUG: Processing PDF data for display and download");
        // Convert Base64 to Blob
        const byteCharacters = atob(responseData.base64Pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Create Object URL and Open in New Tab
        const blobUrl = URL.createObjectURL(blob);
        console.log("DEBUG: Created blob URL for PDF:", blobUrl);
        window.open(blobUrl, "_blank"); // Open PDF in a new tab
        console.log("DEBUG: Opened PDF in new tab");

        // Create and trigger download
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = `${examName}.pdf`;
        console.log(
          "DEBUG: Triggering PDF download with filename:",
          `${examName}.pdf`
        );
        downloadLink.click();
      } else {
        console.log("DEBUG: No PDF data available");
        addNotification(
          "Exam created but PDF not returned. Please check with administrator.",
          "warning"
        );
      }
    } catch (error) {
      console.error("DEBUG: Error in createAndSaveExam:", error);
      addNotification(`Failed to create exam: ${error.message}`, "error");
      setError(error.message);
    } finally {
      console.log("DEBUG: Exam creation process finished");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-10">
      {/* Notification component */}
      <NotificationList />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Your Questions</h1>

        <div className="flex space-x-4">
          <Link
            to="/create"
            state={{ existingQuestions: questions }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Generate More Questions
          </Link>{" "}
        </div>
      </div>

      {/* Questions Summary Card */}
      {questions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {questions.length}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {questions.length} Question{questions.length !== 1 ? 's' : ''} Ready
                </h3>
                <p className="text-sm text-blue-700">
                  Total exam marks: {fullMark} points
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Average per question:</p>
              <p className="text-lg font-semibold text-blue-800">
                {questions.length > 0 ? (fullMark / questions.length).toFixed(1) : 0} points
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Teacher ID warning if not found */}
      {!teacherId && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Teacher ID not found. Some features may not work properly.
                Please log in again.
              </p>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            No questions found
          </h2>{" "}
          <p className="mt-1 text-gray-500">
            You haven't created any questions yet.
          </p>
        </div>
      )}
      {/* Question Editor Modal */}
      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleSaveEdit}
          onCancel={() => setEditingQuestion(null)}
        />
      )}
      {/* Create and Save Exam Form */}
      {showExamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Exam</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAndSaveExam();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="examName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Exam Name
                </label>
                <input
                  type="text"
                  id="examName"
                  value={examName || ""}
                  onChange={(e) => setExamName(e.target.value || "")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Subject
                </label>
                {loadingSubjects ? (
                  <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500">
                    Loading subjects...
                  </div>
                ) : availableSubjects.length > 0 ? (
                  <select
                    id="subject"
                    value={subjectId}
                    onChange={(e) => {
                      console.log(
                        "DEBUG: Subject selection changed to:",
                        e.target.value
                      );
                      setSubjectId(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name} ({subject.students_count || 0} students,{" "}
                        {subject.exams_count || 0} exams)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full border border-red-300 rounded-md px-3 py-2 bg-red-50 text-red-700">
                    No subjects available. Please contact administrator.
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fullMark"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Full Mark (Auto-calculated)
                </label>
                <input
                  type="number"
                  id="fullMark"
                  value={fullMark}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Total marks calculated from all questions: {fullMark} points
                  {fullMark === 0 && " (No questions added yet)"}
                </p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="language"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ar">🇸🇦 العربية (Arabic)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowExamForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    loadingSubjects ||
                    !examName ||
                    !examName ||
                    (!subjectId && availableSubjects.length > 0) ||
                    questions.length === 0 ||
                    !teacherId ||
                    !selectedLanguage
                  }
                  className={`px-4 py-2 rounded-md font-medium ${
                    isLoading ||
                    loadingSubjects ||
                    !examName ||
                    !examName ||
                    (!subjectId && availableSubjects.length > 0) ||
                    questions.length === 0 ||
                    !teacherId ||
                    !selectedLanguage
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500 text-white"
                  }`}
                >
                  {isLoading
                    ? "Creating..."
                    : loadingSubjects
                    ? "Loading..."
                    : "Create & Save Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Action buttons */}
      <div className="flex justify-end mt-6 gap-2">
        {" "}
        <button
          onClick={createAndSaveExam}
          disabled={questions.length === 0 || !teacherId || isLoading}
          className={`py-2 px-4 rounded-md font-medium ${
            questions.length === 0 || !teacherId || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {isLoading ? "Processing..." : "Create & Save Exam"}
        </button>
      </div>
    </div>
  );
}
