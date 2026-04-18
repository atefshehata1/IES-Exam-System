
// ExamSettingsForm.jsx
import { Sparkles, FileText } from "lucide-react";

export default function ExamSettingsForm({
    generateQuestions,
    isGenerating,
    selectedFileIds
  }) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Generation Settings</h2>
            <p className="text-sm text-gray-600">Configure your exam generation preferences</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <FileText className="w-4 h-4 mr-2 text-green-500" />
              Expected Output
            </label>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 shadow-sm"></div>
                <span className="font-semibold text-green-800">20-30 comprehensive questions</span>
              </div>
              <div className="text-xs text-green-700 ml-6 opacity-90">
                Generated automatically from your PDF content using AI
              </div>
              <div className="flex items-center mt-3 text-xs text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ready for review and customization
              </div>
            </div>
          </div>
        </div>

        {/* File Selection Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm mr-4">
                {selectedFileIds.length}
              </div>
              <div>
                <span className="text-base font-semibold text-blue-900">
                  {selectedFileIds.length} PDF{selectedFileIds.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center text-sm text-blue-700 mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ready for question generation
                </div>
              </div>
            </div>
            <div className="text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <button
          onClick={generateQuestions}
          disabled={selectedFileIds.length === 0 || isGenerating}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
            selectedFileIds.length === 0 || isGenerating
              ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
              : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] border border-blue-500"
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              <span>Generating Questions...</span>
              <div className="ml-2 flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-3" />
              <span>Generate Questions from PDFs</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}
        </button>
        
        {selectedFileIds.length === 0 && (
          <div className="flex items-center mt-4 text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200 shadow-sm">
            <div className="w-5 h-5 bg-amber-500 rounded-full mr-3 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <span className="font-medium">Please select at least one PDF file</span>
              <div className="text-xs text-amber-600 mt-1">Choose your PDF files above to start generating questions</div>
            </div>
          </div>
        )}
      </div>
    );
  }
  