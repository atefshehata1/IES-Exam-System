// CreateFullExamPage.jsx - Main Component
import { useState } from "react";
import { ArrowLeft, AlertCircle, CheckCircle, Upload, Settings, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileUploadSection from "../components/fullExam/FileUploadSection";
import ExamSettingsForm from "../components/fullExam/ExamSettingsForm";
import GeneratedQuestions from "../components/fullExam/GeneratedQuestions";
import QuickStartGuide from "../components/fullExam/QuickStartGuide";
import NotificationManager from "../components/Notification";

export default function CreateFullExam() {
  const [files, setFiles] = useState([]);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const url = "http://localhost:5000";
  const navigate = useNavigate();

  // Initialize notification manager
  const { addNotification, NotificationList } = NotificationManager();

  // Handle file upload with duplicate checking
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    // Validate file types
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const invalidFiles = newFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !allowedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      const invalidNames = invalidFiles.map(f => f.name).join(', ');
      addNotification(`Invalid file type(s): ${invalidNames}. Please select PDF, DOC, DOCX, or TXT files only.`, "error");
      return;
    }

    // Validate file sizes (50MB limit per file)
    const maxSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map(f => f.name).join(', ');
      addNotification(`File(s) too large: ${oversizedNames}. Maximum file size is 50MB per file.`, "error");
      return;
    }

    // Check for duplicates by comparing file names
    const existingNames = new Set(files.map(file => file.name));
    const duplicateFiles = [];
    const uniqueFiles = [];

    newFiles.forEach(file => {
      if (existingNames.has(file.name)) {
        duplicateFiles.push(file.name);
      } else {
        uniqueFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file: file,
          name: file.name,
        });
        existingNames.add(file.name); // Prevent duplicates within the same batch
      }
    });

    // Show notifications for duplicates
    if (duplicateFiles.length > 0) {
      const duplicateMessage = duplicateFiles.length === 1 
        ? `File "${duplicateFiles[0]}" is already uploaded.`
        : `Files ${duplicateFiles.map(name => `"${name}"`).join(', ')} are already uploaded.`;
      addNotification(`${duplicateMessage} ${uniqueFiles.length > 0 ? 'Other files will be added.' : 'No new files were added.'}`, "warning");
    }

    // Add only unique files
    if (uniqueFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
      addNotification(`Successfully added ${uniqueFiles.length} file${uniqueFiles.length > 1 ? 's' : ''}.`, "success");
    }

    // Clear the file input for better UX
    e.target.value = '';
  };

  // Remove a file from the list
  const removeFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
    setSelectedFileIds((prevIds) => prevIds.filter((id) => id !== fileId));
  };

  // Toggle file selection
  const toggleFileSelection = (fileId) => {
    setSelectedFileIds((prevIds) =>
      prevIds.includes(fileId)
        ? prevIds.filter((id) => id !== fileId)
        : [...prevIds, fileId]
    );
  };

  // Generate questions based on selected files and settings
  const generateQuestions = async () => {
    // Reset previous errors
    setError(null);
    
    // Validation checks
    if (selectedFileIds.length === 0) {
      const errorMsg = "Please select at least one PDF file to generate questions.";
      setError(errorMsg);
      addNotification(errorMsg, "warning");
      return;
    }

    setIsGenerating(true);
    setUploadProgress(0);
    setGenerationProgress(0);
    setCurrentStep(2); // Move to upload step

    try {
      // Get teacher ID from localStorage with enhanced error handling
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("Authentication required. Please log in again to continue.");
      }

      let user;
      try {
        user = JSON.parse(userStr);
      } catch (parseError) {
        console.error("Failed to parse user data:", parseError);
        throw new Error("Invalid user session. Please log in again.");
      }

      const teacherId = user.id || user._id || user.teacherId;
      if (!teacherId) {
        throw new Error("Teacher identification not found. Please log in again.");
      }

      // Get user token for authentication
      const userToken = user.token;
      if (!userToken) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      addNotification("Starting PDF upload...", "info");

      // Step 1: Upload selected PDFs to teacher's collection first
      const selectedFiles = files.filter((f) => selectedFileIds.includes(f.id));
      
      if (selectedFiles.length === 0) {
        throw new Error("No valid files selected. Please refresh and try again.");
      }

      // Check file sizes (optional - adjust limit as needed)
      const maxFileSize = 50 * 1024 * 1024; // 50MB
      const oversizedFiles = selectedFiles.filter(fileObj => fileObj.file.size > maxFileSize);
      if (oversizedFiles.length > 0) {
        throw new Error(`Some files are too large. Maximum file size is 50MB. Please reduce file sizes and try again.`);
      }

      const formData = new FormData();
      
      selectedFiles.forEach((fileObj) => {
        if (!fileObj.file) {
          throw new Error(`Invalid file: ${fileObj.name}. Please re-upload and try again.`);
        }
        formData.append("pdf", fileObj.file);
      });

      setUploadProgress(30);
      
      let uploadResponse;
      try {
        uploadResponse = await fetch(`${url}/teachers/${teacherId}/uploads`, {
          method: "POST",
          headers: {
            ...(userToken && { "Authorization": `Bearer ${userToken}` }),
          },
          body: formData,
        });
      } catch (networkError) {
        console.error("Network error during upload:", networkError);
        throw new Error("Network connection failed. Please check your internet connection and try again.");
      }

      setUploadProgress(100);

      if (!uploadResponse.ok) {
        let errorMessage = "Failed to upload PDFs to server";
        try {
          const errorData = await uploadResponse.json();
          
          // Handle specific error codes
          if (uploadResponse.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
          } else if (uploadResponse.status === 413) {
            errorMessage = "Files are too large. Please reduce file sizes and try again.";
          } else if (uploadResponse.status === 415) {
            errorMessage = "Invalid file format. Please ensure all files are valid PDFs.";
          } else if (uploadResponse.status >= 500) {
            errorMessage = "Server error occurred. Please try again in a few moments.";
          } else {
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Upload failed with status ${uploadResponse.status}. Please try again.`;
        }
        throw new Error(errorMessage);
      }

      addNotification("PDFs uploaded successfully! Generating questions...", "success");
      setCurrentStep(3); // Move to generation step
      
      // Step 2: Now call the generation API with PDF names
      const pdfNames = selectedFiles.map((fileObj) => fileObj.name);

      if (pdfNames.length === 0) {
        throw new Error("No PDF names available for generation. Please try uploading again.");
      }

      const requestBody = { 
        pdfNames: pdfNames,
        lang: "en" // Default language, will be set later when creating exam
      };
      // Call the new full exam generation endpoint
      setGenerationProgress(20);
      
      let response;
      try {
        response = await fetch(`${url}/teachers/${teacherId}/exams/genqa_full`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(userToken && { "Authorization": `Bearer ${userToken}` }),
          },
          body: JSON.stringify(requestBody),
        });
      } catch (networkError) {
        console.error("Network error during generation:", networkError);
        throw new Error("Network connection failed during question generation. Please check your connection and try again.");
      }

      setGenerationProgress(80);

      if (!response.ok) {
        let errorMessage = "Failed to generate questions from PDFs";
        try {
          const errorData = await response.json();
          
          // Handle specific error codes
          if (response.status === 401) {
            errorMessage = "Authentication expired. Please log in again.";
          } else if (response.status === 400) {
            errorMessage = errorData.message || "Invalid request. Please check your PDF files and try again.";
          } else if (response.status === 404) {
            errorMessage = "Question generation service not available. Please try again later.";
          } else if (response.status === 429) {
            errorMessage = "Too many requests. Please wait a moment and try again.";
          } else if (response.status >= 500) {
            errorMessage = "Server error during question generation. Please try again in a few moments.";
          } else {
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (parseError) {
          // Unable to parse error response
          errorMessage = `Generation failed with status ${response.status}. Please try again.`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse generation response:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      setGenerationProgress(100);
      
      // Handle the response - it might be an array directly or an object with questions
      let questionsArray;
      
      if (Array.isArray(data)) {
        questionsArray = data;
      } else if (data && data.questions && Array.isArray(data.questions)) {
        questionsArray = data.questions;
      } else if (data && typeof data === 'object') {
        // Handle case where response might have different structure
        throw new Error("Unexpected response format from server. Please contact support if this persists.");
      } else {
        console.error("Invalid response format - expected questions array or object with questions property");
        throw new Error("Invalid response format from server. Please try again.");
      }
      
      if (!questionsArray || questionsArray.length === 0) {
        throw new Error("No questions could be generated from the selected PDFs. Please ensure your PDFs contain readable text content and try again.");
      }

      // Validate question structure
      const invalidQuestions = questionsArray.filter((q, index) => {
        const hasQuestion = q.question || q.questionText || q.text;
        const hasAnswer = q.answer || q.correctAnswer || q.solution;
        if (!hasQuestion || !hasAnswer) {
          console.warn(`Question ${index + 1} missing required fields:`, q);
          return true;
        }
        return false;
      });

      if (invalidQuestions.length > 0) {
        console.warn(`Found ${invalidQuestions.length} invalid questions out of ${questionsArray.length}`);
        // Filter out invalid questions
        questionsArray = questionsArray.filter((q) => {
          const hasQuestion = q.question || q.questionText || q.text;
          const hasAnswer = q.answer || q.correctAnswer || q.solution;
          return hasQuestion && hasAnswer;
        });
        
        if (questionsArray.length === 0) {
          throw new Error("All generated questions were invalid. Please try with different PDF content.");
        }
      }

      // Transform the backend data structure to match our frontend needs
      const formattedQuestions = questionsArray.map((q, index) => {
        try {
          return {
            id: `full-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
            question: q.question || q.questionText || q.text || "Question content unavailable",
            answer: q.answer || q.correctAnswer || q.solution || "Answer unavailable",
            isSelected: false, // Initially not selected - user will choose
            grade: parseInt(q.grade) || 10, // Ensure grade is a number, use API grade or default
            source: q.source || `Generated from ${pdfNames.join(", ")}`,
          };
        } catch (processingError) {
          // Return a default question structure
          return {
            id: `full-error-${Date.now()}-${index}`,
            question: "Question processing failed",
            answer: "Please regenerate questions",
            isSelected: false,
            grade: 10,
            source: "Error during processing",
          };
        }
      });

      // Final validation
      const validQuestions = formattedQuestions.filter(q => 
        q.question !== "Question content unavailable" && 
        q.answer !== "Answer unavailable" &&
        q.question !== "Question processing failed"
      );

      if (validQuestions.length === 0) {
        throw new Error("No valid questions could be processed. Please try again or contact support.");
      }

      if (validQuestions.length < formattedQuestions.length) {
        const invalidCount = formattedQuestions.length - validQuestions.length;
        addNotification(`Warning: ${invalidCount} questions could not be processed properly`, "warning");
      }

      setQuestions(validQuestions);
      setShowQuestions(true); // Show the questions for selection
      setCurrentStep(4); // Move to selection step
      setSuccessMessage(`Successfully generated ${validQuestions.length} questions! Review and select the ones you want to add to your collection.`);
      addNotification(`🎉 Generated ${validQuestions.length} questions successfully!`, "success");

    } catch (error) {
      console.error("Error generating questions:", error);
      
      // Enhanced error handling with user-friendly messages
      let userFriendlyMessage = error.message || "An unexpected error occurred";
      
      // Reset progress indicators on error
      setUploadProgress(0);
      setGenerationProgress(0);
      setCurrentStep(1);
      
      // Handle specific error types
      if (error.message.includes("Authentication") || error.message.includes("log in")) {
        userFriendlyMessage = "Your session has expired. Please log in again to continue.";
        // Optional: Redirect to login page
        // navigate("/login");
      } else if (error.message.includes("Network") || error.message.includes("connection")) {
        userFriendlyMessage = "Connection failed. Please check your internet connection and try again.";
      } else if (error.message.includes("file") || error.message.includes("PDF")) {
        userFriendlyMessage = "There was an issue with your PDF files. Please check your files and try again.";
      } else if (error.message.includes("Server error") || error.message.includes("500")) {
        userFriendlyMessage = "Server is temporarily unavailable. Please try again in a few moments.";
      }
      
      setError(userFriendlyMessage);
      addNotification(`Error: ${userFriendlyMessage}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle saving selected questions - navigate to DisplayQuestions page
  const saveSelectedQuestions = (selectedQuestions) => {
    console.log("Adding selected questions to collection:", selectedQuestions);
    
    try {
      // Validation
      if (!selectedQuestions || selectedQuestions.length === 0) {
        const errorMsg = "Please select at least one question before saving.";
        setError(errorMsg);
        addNotification(errorMsg, "warning");
        return;
      }

      // Validate question structure
      const invalidQuestions = selectedQuestions.filter(q => 
        !q.question || !q.answer || !q.id
      );
      
      if (invalidQuestions.length > 0) {
        const errorMsg = `${invalidQuestions.length} questions have missing data. Please regenerate questions and try again.`;
        setError(errorMsg);
        addNotification(errorMsg, "error");
        return;
      }

      addNotification(`Adding ${selectedQuestions.length} questions to your collection...`, "info");

      // Navigate to DisplayQuestions page with the selected questions
      navigate("/questions", {
        state: {
          newQuestions: selectedQuestions,
          addToExisting: true,
          successMessage: `🎉 Successfully added ${selectedQuestions.length} questions to your collection! You can now create an exam with them.`,
        },
      });
    } catch (navError) {
      console.error("Error during navigation:", navError);
      const errorMsg = "Failed to save questions. Please try again.";
      setError(errorMsg);
      addNotification(errorMsg, "error");
    }
  };

  // Toggle back to file selection view
  const goBackToFileSelection = () => {
    setShowQuestions(false);
    setCurrentStep(1);
    setSuccessMessage("");
    setError(null); // Clear any errors when going back
  };

  // Clear all errors and reset state
  const clearErrorsAndReset = () => {
    setError(null);
    setIsGenerating(false);
    setUploadProgress(0);
    setGenerationProgress(0);
    setCurrentStep(1);
    setSuccessMessage("");
  };

  // Retry last operation
  const retryLastOperation = () => {
    setError(null);
    if (selectedFileIds.length > 0) {
      generateQuestions();
    } else {
      addNotification("Please select PDF files first", "warning");
    }
  };


  // Progress Bar Component
  const ProgressBar = ({ progress, label, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification component */}
      <NotificationList />
      
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Generate Questions from PDFs
      </h1>

     

      {/* Step Indicator */}
      {/* <StepIndicator /> */}

      {/* Quick Start Guide */}
      {currentStep === 1 && <QuickStartGuide />}

      {/* Error Display Section */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Occurred</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setError(null)}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors font-medium"
                >
                  Dismiss
                </button>
                {error.includes("log in") && (
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                  >
                    Go to Login
                  </button>
                )}
                {(error.includes("connection") || error.includes("Network") || error.includes("Server")) && (
                  <button
                    onClick={retryLastOperation}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                  >
                    Try Again
                  </button>
                )}
                {error.includes("PDF") && (
                  <button
                    onClick={clearErrorsAndReset}
                    className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                  >
                    Reset & Start Over
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && !error && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
          <div className="flex">
            <CheckCircle className="text-green-500 w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      {isGenerating && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Processing Your Request...</h3>
          {currentStep === 2 && (
            <ProgressBar 
              progress={uploadProgress} 
              label="Uploading PDFs to server" 
              color="blue" 
            />
          )}
          {currentStep === 3 && (
            <>
              <ProgressBar 
                progress={100} 
                label="Upload Complete" 
                color="green" 
              />
              <ProgressBar 
                progress={generationProgress} 
                label="Generating questions with AI" 
                color="orange" 
              />
            </>
          )}
          <div className="mt-4 text-sm text-gray-600">
            Please don't close this page while processing...
          </div>
        </div>
      )}

    

      {!showQuestions ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 gap-8">
              <FileUploadSection
                files={files}
                selectedFileIds={selectedFileIds}
                handleFileUpload={handleFileUpload}
                removeFile={removeFile}
                toggleFileSelection={toggleFileSelection}
              />

              <ExamSettingsForm
                generateQuestions={generateQuestions}
                isGenerating={isGenerating}
                selectedFileIds={selectedFileIds}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Generated Questions
              </h1>
              <p className="text-gray-600 mt-2">
                Review the generated questions and select the ones you want to add to your collection
              </p>
            </div>
            <button
              onClick={goBackToFileSelection}
              className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to PDF Selection
            </button>
          </div>

          <GeneratedQuestions
            questions={questions}
            saveSelectedQuestions={saveSelectedQuestions}
          />
        </>
      )}
    </div>
  );
}