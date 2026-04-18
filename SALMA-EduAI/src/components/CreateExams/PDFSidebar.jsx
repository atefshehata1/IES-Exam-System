// src/components/PDFViewer/PDFSidebar.jsx
const PDFSidebar = ({
  pdfFiles,
  currentPdf,
  fileInputRef,
  onFileChange,
  onPdfSelect,
  onPdfDelete,
  triggerFileInput,
  isUploading,
  isLoading
}) => {
  const handleDeleteClick = (e, pdf) => {
    e.stopPropagation(); // Prevent selecting the PDF when clicking delete
    if (window.confirm(`Are you sure you want to delete "${pdf.name}"?`)) {
      onPdfDelete(pdf);
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-64 h-full bg-white shadow-md flex flex-col border-r border-gray-200">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          onChange={onFileChange}
          className="hidden"
          multiple
        />
        <button 
          className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] ${(isUploading || isLoading) ? 'opacity-70 cursor-not-allowed scale-100' : ''}`}
          onClick={triggerFileInput}
          disabled={isUploading || isLoading}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload PDF(s)
            </div>
          )}
        </button>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Max 50MB per file • Multiple files supported
        </p>
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">PDF Library</h2>
          <p className="text-xs text-gray-600">{pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''}</p>
        </div>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading && pdfFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-sm italic">Loading your PDFs...</p>
          </div>
        ) : pdfFiles.length > 0 ? (
          <div className="space-y-1 p-2">
            {pdfFiles.map((pdf, index) => (
              <div
                key={pdf.id || index}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group border ${
                  currentPdf?.name === pdf.name 
                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                    : "border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                }`}
                onClick={() => onPdfSelect(pdf)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium text-gray-900 truncate" title={pdf.name}>
                      {pdf.name}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      {pdf.file && (
                        <span className="text-xs text-gray-500">
                          {formatFileSize(pdf.file.size)}
                        </span>
                      )}
                      <div className="flex items-center">
                        {pdf.serverStored ? (
                          <div className="flex items-center text-green-600">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">Saved</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">Temporary</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(e, pdf)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 p-1.5 rounded-md"
                    title="Delete PDF"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 p-4">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm italic text-center">No PDFs uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1 text-center">Click "Upload PDF(s)" above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFSidebar;