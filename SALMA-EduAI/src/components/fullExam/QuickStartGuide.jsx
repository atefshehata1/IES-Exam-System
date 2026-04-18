// QuickStartGuide.jsx
import { useState } from "react";
import { Upload, Settings, Sparkles, CheckCircle, X, HelpCircle } from "lucide-react";

export default function QuickStartGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 mb-8 border border-blue-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="bg-blue-500 p-2 rounded-lg mr-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Quick Start Guide</h3>
            <p className="text-sm text-blue-700">Get started in 4 simple steps</p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">1. Upload PDFs</h4>
          <p className="text-xs text-gray-600">Select your course materials or documents</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">2. Configure</h4>
          <p className="text-xs text-gray-600">Choose language and settings</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">3. Generate</h4>
          <p className="text-xs text-gray-600">AI creates 20-30 questions automatically</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">4. Select & Save</h4>
          <p className="text-xs text-gray-600">Review and add to your collection</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
        <div className="flex items-center text-sm text-blue-800">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="font-medium">Pro Tip:</span>
          <span className="ml-1">Upload multiple related PDFs for comprehensive question coverage</span>
        </div>
      </div>
    </div>
  );
}
