
// FileUploadSection.jsx
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export default function FileUploadSection({ 
  files, 
  selectedFileIds, 
  handleFileUpload, 
  removeFile, 
  toggleFileSelection 
}) {
  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file type icon color
  const getFileTypeColor = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return 'text-red-500';
      case 'doc':
      case 'docx': return 'text-blue-500';
      case 'txt': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Upload Content Files</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload PDF, DOC, DOCX, or TXT files to generate exam questions from their content.
        </p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-lg font-medium text-gray-700 mb-2">
            Choose files to upload
          </div>
          <div className="text-sm text-gray-500 mb-4">
            Drag and drop files here, or click to browse
          </div>
          <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Supports PDF, DOC, DOCX, TXT • Max 50MB per file
          </div>
        </label>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Uploaded Files ({files.length})
            </h3>
            <div className="text-xs text-gray-500">
              {selectedFileIds.length} of {files.length} selected
            </div>
          </div>
          
          <div className="border rounded-lg divide-y divide-gray-200 bg-white shadow-sm">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center flex-1 min-w-0">
                  <input
                    type="checkbox"
                    id={`file-${file.id}`}
                    checked={selectedFileIds.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3 flex-shrink-0"
                  />
                  <div className="flex items-center min-w-0 flex-1">
                    <FileText className={`w-4 h-4 mr-3 flex-shrink-0 ${getFileTypeColor(file.name)}`} />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`file-${file.id}`}
                        className="text-sm font-medium cursor-pointer truncate block"
                        title={file.name}
                      >
                        {file.name}
                      </label>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.file?.size)}
                        </span>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(file.id)}
                  className="ml-3 text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {selectedFileIds.length === 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700">
                Please select at least one file to generate questions from.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}