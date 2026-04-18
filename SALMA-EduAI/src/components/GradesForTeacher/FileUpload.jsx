// file upload component for uploading answer sheets in PDF format
import { useState, useRef } from "react";
import { Upload, X, Image, FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export function FileUpload({
  files,
  setFiles,
  handleEvaluate,
  isEvaluating,
  selectedExam,
  gradingProgress = 0,
  processingStatus = ''
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (selectedFiles) => {
    // Reset any previous errors
    setUploadError('');
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setUploadError(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Please upload only JPG, PNG, or PDF files.`);
      return;
    }

    // Validate file sizes (10MB limit per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setUploadError(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum file size is 10MB per file.`);
      return;
    }
    
    // Validate file count if exam is selected
    if (selectedExam && selectedFiles.length > selectedExam.num_of_questions) {
      setUploadError(`Too many files! This exam has ${selectedExam.num_of_questions} questions. Please select exactly ${selectedExam.num_of_questions} files.`);
      return;
    }

    // Check for duplicate file names
    const fileNames = new Set();
    const duplicates = [];
    
    selectedFiles.forEach(file => {
      if (fileNames.has(file.name)) {
        duplicates.push(file.name);
      } else {
        fileNames.add(file.name);
      }
    });

    if (duplicates.length > 0) {
      setUploadError(`Duplicate files detected: ${duplicates.join(', ')}. Please select unique files.`);
      return;
    }
    
    setFiles(selectedFiles);
  };

  const handleInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFileUpload(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploadError('');
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    return <FileText className="w-4 h-4 text-red-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Question Answer Photos</h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700 mb-1">
          📸 One Photo Per Question
        </h3>
        <p className="text-xs text-blue-600">
          Upload one photo for each question's answer. Photos will be matched to questions based on upload order.
        </p>
      </div>

      {/* Selected Exam Info */}
      {selectedExam && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Selected Exam:
          </h3>
          <p className="text-sm text-gray-900 font-medium">
            {selectedExam.name}
          </p>
          <p className="text-xs text-gray-600">
            {selectedExam.num_of_questions} questions • Upload exactly {selectedExam.num_of_questions} photos
          </p>
          <div className="mt-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              files.length === selectedExam.num_of_questions 
                ? 'bg-green-100 text-green-700' 
                : files.length > selectedExam.num_of_questions
                  ? 'bg-red-100 text-red-700'
                  : 'bg-orange-100 text-orange-700'
            }`}>
              {files.length === selectedExam.num_of_questions 
                ? `✅ Perfect! ${files.length} of ${selectedExam.num_of_questions} photos` 
                : files.length > selectedExam.num_of_questions
                  ? `❌ Too many: ${files.length}/${selectedExam.num_of_questions} photos`
                  : `⏳ Need ${selectedExam.num_of_questions - files.length} more photos`
              }
            </div>
          </div>
        </div>
      )}

      {/* Drag and Drop Upload Area */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Upload Question Answer Photos (JPG, PNG, PDF)
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleInputChange}
            disabled={isEvaluating}
            className="hidden"
          />
          
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isEvaluating}
            >
              browse to upload
            </button>
          </p>
          <p className="text-xs text-gray-500">
            📋 Upload photos in order: Photo 1 = Question 1 answer, Photo 2 = Question 2 answer, etc.
          </p>
          {selectedExam && (
            <p className="text-xs text-blue-600 mt-1">
              📸 Upload exactly {selectedExam.num_of_questions} photos for this exam • Max 10MB per file
            </p>
          )}
        </div>

        {/* Upload Error Display */}
        {uploadError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Question Answer Photos ({files.length}):
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="ml-2 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-medium text-sm">Q{index + 1}:</span>
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={isEvaluating}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar and Status During Evaluation */}
      {isEvaluating && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {processingStatus || 'Processing...'}
            </span>
          </div>
          
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${gradingProgress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-blue-600">
              Processing {files.length} answer sheet{files.length !== 1 ? 's' : ''} for "{selectedExam?.name}"
            </span>
            <span className="text-xs text-blue-600 font-medium">
              {gradingProgress}%
            </span>
          </div>
        </div>
      )}

      {/* Evaluate Button */}
      <button
        onClick={handleEvaluate}
        disabled={
          !selectedExam || 
          files.length === 0 || 
          files.length !== selectedExam?.num_of_questions || 
          isEvaluating ||
          uploadError
        }
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
          !selectedExam || 
          files.length === 0 || 
          files.length !== selectedExam?.num_of_questions || 
          isEvaluating ||
          uploadError
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {isEvaluating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Evaluating Submissions...</span>
          </>
        ) : (
          <>
            {files.length === selectedExam?.num_of_questions ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>
              {selectedExam && files.length === selectedExam.num_of_questions
                ? "Evaluate Submissions"
                : !selectedExam
                  ? "Select an Exam First"
                  : files.length === 0
                    ? "Upload Photos First"
                    : `Upload ${selectedExam.num_of_questions - files.length} More Photos`
              }
            </span>
          </>
        )}
      </button>

      {/* Status Messages */}
      {!selectedExam && (
        <p className="text-xs text-red-600 mt-2 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          Please select an exam before uploading files
        </p>
      )}

      {selectedExam && files.length > 0 && files.length !== selectedExam.num_of_questions && (
        <p className="text-xs text-amber-600 mt-2 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {files.length < selectedExam.num_of_questions 
            ? `Upload ${selectedExam.num_of_questions - files.length} more photos to match the ${selectedExam.num_of_questions} questions in this exam`
            : `Too many photos! Remove ${files.length - selectedExam.num_of_questions} photos to match the ${selectedExam.num_of_questions} questions`
          }
        </p>
      )}
    </div>
  );
}
