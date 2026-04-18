// src/components/PDFViewer/PDFContent.jsx
import { Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Viewer } from "@react-pdf-viewer/core";
import * as pdfjs from "pdfjs-dist";
import { usePDFContext } from "../../context/PDFContext";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Set the worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFContent = ({ currentPdf, pdfContainerRef, onTextSelection }) => {
  const { currentPage, setCurrentPage } = usePDFContext();
  
  // Create defaultLayoutPlugin with initial page
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    // Configure the plugin if needed
  });
  
  // Track page changes
  const handlePageChange = (e) => {
    // The page number from the event is 0-indexed, but we store it as 1-indexed
    setCurrentPage(e.currentPage + 1);
  };
  
  return (
    <div className="flex-1 h-full relative" ref={pdfContainerRef}>
      {currentPdf ? (
        <div className="flex flex-col h-full">
          <div className="py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">{currentPdf.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Click and drag to select text for question generation</p>
              </div>
              <div className="flex items-center space-x-2">
                {currentPdf.serverStored ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Saved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Temporary
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div 
            className="flex-1 overflow-auto"
            onMouseUp={onTextSelection}
          >
            <Worker
              workerUrl={`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}
            >
              <div className="h-full">
                <Viewer
                  fileUrl={currentPdf.url}
                  plugins={[defaultLayoutPluginInstance]}
                  onPageChange={handlePageChange}
                  initialPage={currentPage - 1} // Set initial page (0-indexed)
                />
              </div>
            </Worker>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-6">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Questions?</h3>
            <p className="text-gray-600 mb-6">Select a PDF from your library or upload new documents to get started with AI-powered question generation.</p>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Quick Tip</span>
              </div>
              <p className="text-sm text-gray-700">
                For best results, upload PDFs with clear, readable text content. The AI works best with well-formatted educational materials.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFContent;