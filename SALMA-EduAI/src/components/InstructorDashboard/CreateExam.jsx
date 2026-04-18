import { Link } from "react-router-dom";
import { FileText, BookOpen, Wand2, ArrowRight } from "lucide-react";

export default function CreateExam() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          Create New Exam
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your preferred method to create comprehensive assessments for your students
        </p>
      </div>

      {/* Exam Creation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Custom Exam */}
        <Link to="/create" className="group">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-8 text-white relative">
              <div className="absolute top-4 right-4 opacity-20">
                <Wand2 className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <FileText className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Custom Exam</h3>
                <p className="text-sm opacity-90">Design tailored questions for specific learning objectives</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Generate targeted questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Customize difficulty levels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Focus on specific topics</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quick & Targeted</span>
                  <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Full Exam */}
        <Link to="/create/full" className="group">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-8 text-white relative">
              <div className="absolute top-4 right-4 opacity-20">
                <BookOpen className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <BookOpen className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Full Exam</h3>
                <p className="text-sm opacity-90">Create comprehensive assessments from course materials</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Upload course materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Auto-generate from content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Comprehensive coverage</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Complete & Detailed</span>
                  <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
