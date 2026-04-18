import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuestionEditor from "../components/QuestionGenerator/QuestionEditor";
import GeneratedQuestion from "../components/QuestionGenerator/GeneratedQuestion";
import { usePDFContext } from "../context/PDFContext";
import { useAuth } from "../context/AuthProvider";

export default function QuestionGenerator() {
  const { selectedText, currentPdf } = usePDFContext();
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState(selectedText || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const topicInputRef = useRef(null);
  // const url = "https://localhost:7102";
  // Helper function to safely get current user
  const getCurrentUser = useCallback(() => {
    try {
      return currentUser || JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }, [currentUser]);
  useEffect(() => {
    if (selectedText && topicInputRef.current) {
      topicInputRef.current.focus();
    }
  }, [selectedText]);

  // Check authentication on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !user.id || !user.token) {
      setError("Authentication required. Please log in again.");
      navigate("/login");
    }
  }, [currentUser, navigate, getCurrentUser]);

  const generateQuestions = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Get current user from localStorage or context
      const user = getCurrentUser();

      if (!user || !user.id) {
        throw new Error("User not authenticated. Please log in again.");
      }

      // Updated API endpoint to use dynamic teacher ID
      const response = await fetch(
        `http://localhost:5000/teachers/${user.id}/exams/genqa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            pdfName: currentPdf ? currentPdf.name : null,
            paragraph: topic, // Changed from selectedText to paragraph to match backend
            lang: "en", // Default language
          }),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();

      // Process the returned questions based on the actual API response structure
      let formattedQuestions = [];
      if (data && Array.isArray(data)) {
        // If data is directly an array of questions
        formattedQuestions = data.map((q, index) => ({
          id:
            q.id ||
            `question-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}-${index}`,
          question:
            q.question || q.questionText || q.text || "Question not available",
          answer: q.answer || q.correctAnswer || "Answer not available",
          isSelected: true, // Auto-select all generated questions
          grade: q.grade || q.points || 10, // Use API grade or default
          source: currentPdf ? currentPdf.name : "PDF Source",
        }));
      } else if (data && data.questions && Array.isArray(data.questions)) {
        // If data has a questions property that contains the array
        formattedQuestions = data.questions.map((q, index) => ({
          id:
            q.id ||
            `question-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}-${index}`,
          question:
            q.question || q.questionText || q.text || "Question not available",
          answer: q.answer || q.correctAnswer || "Answer not available",
          isSelected: true,
          grade: q.grade || q.points || 10,
          source: currentPdf ? currentPdf.name : "PDF Source",
        }));
      } else if (data && typeof data === "object") {
        // If data is a single question object, wrap it in an array
        formattedQuestions = [
          {
            id:
              data.id ||
              `question-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}-single`,
            question:
              data.question ||
              data.questionText ||
              data.text ||
              "Question not available",
            answer: data.answer || data.correctAnswer || "Answer not available",
            isSelected: true,
            grade: data.grade || data.points || 10,
            source: currentPdf ? currentPdf.name : "PDF Source",
          },
        ];
      } else {
        throw new Error("Invalid response format from API");
      }

      if (formattedQuestions.length === 0) {
        throw new Error(
          "No questions were generated. Please try with different content."
        );
      }

      // Set the newly generated questions (don't merge with existing ones here)
      setGeneratedQuestions(formattedQuestions);

    } catch (err) {
      console.error("Error generating questions:", err);

      // Handle specific authentication errors
      if (
        err.message.includes("not authenticated") ||
        err.message.includes("Authentication failed")
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.message || "Failed to generate questions. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };
  const handleCheckboxChange = (id) => {
    setGeneratedQuestions(
      generatedQuestions.map((q) =>
        q.id === id ? { ...q, isSelected: !q.isSelected } : q
      )
    );
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
  };
  const handleSaveEdit = (editedQuestion) => {
    setGeneratedQuestions(
      generatedQuestions.map((q) =>
        q.id === editedQuestion.id ? editedQuestion : q
      )
    );
    setEditingQuestion(null);
  };
  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleSaveQuestions = () => {
    const selectedQuestions = generatedQuestions.filter((q) => q.isSelected);
    navigate("/questions", {
      state: {
        newQuestions: selectedQuestions,
      },
    });
  };

  const handleBackToPDF = () => {
    navigate("/create");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Question Generator</h1>
        <button
          onClick={handleBackToPDF}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to PDF
        </button>
      </div>{" "}
      {currentPdf && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Source: {currentPdf.name}</p>
          {currentUser && (
            <p className="text-xs text-gray-500">
              Logged in as: {currentUser.email || "User"}
            </p>
          )}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <textarea
              ref={topicInputRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for the questions"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="8"
            />
          </div>
        </div>
        <button
          onClick={generateQuestions}
          disabled={!topic || isGenerating}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            !topic || isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isGenerating ? "Generating..." : "Generate Questions"}
        </button>
        {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
      </div>
      {generatedQuestions.length > 0 && (
        <div className="mb-8">
          {" "}
          <div className="flex justify-between items-center mb-4">
            {" "}
            <h2 className="text-xl font-semibold">
              Generated Questions ({generatedQuestions.length})
            </h2>
            <button
              onClick={handleSaveQuestions}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Save Selected Questions
            </button>
          </div>{" "}
          <div className="space-y-4">
            {generatedQuestions.map((question) => (
              <GeneratedQuestion
                key={question.id}
                question={question}
                onCheckboxChange={handleCheckboxChange}
                onEdit={handleEditQuestion}
              />
            ))}
          </div>
        </div>
      )}
      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
