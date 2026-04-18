import PDFViewer from '../components/CreateExams/PdfViewer';

function CreateExam() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Page Header */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* <Header /> */}
        </div>
      </div>

      {/* Workflow Guide */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">How to Create Custom Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Upload PDF Documents</h3>
                <p className="text-sm text-gray-600">Upload one or more PDF files containing your course material. Each file can be up to 50MB.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Select Text Content</h3>
                <p className="text-sm text-gray-600">Highlight specific text from your PDFs that you want to generate questions about.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Generate & Review</h3>
                <p className="text-sm text-gray-600">AI will create questions from your selected content. Review, edit, and save them to your collection.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-amber-800 font-medium">💡 Pro Tip</p>
                <p className="text-sm text-amber-700 mt-1">For best results, select clear, well-structured content. The AI generates better questions from detailed explanations and comprehensive text sections.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main PDF Viewer */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <PDFViewer />
        </div>
      </div>
    </div>
  );
}

export default CreateExam;
