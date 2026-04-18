import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, Users, TrendingUp } from "lucide-react";

export default function CorrectExam() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          Grade & Correct Exams
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access the grading interface to review and correct student submissions
        </p>
      </div>

      {/* Grades Link */}
      <div className="max-w-3xl mx-auto">
        <Link to="/grades" className="group block">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 p-12 text-white relative">
              <div className="absolute top-6 right-6 opacity-20">
                <GraduationCap className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <GraduationCap className="w-16 h-16 mb-6" />
                <h3 className="text-3xl font-bold mb-3">Grade Students</h3>
                <p className="text-lg opacity-90">Access the comprehensive grading interface to review and correct all student submissions</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Upload and review exam submissions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">AI-powered grading assistance</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Student performance analytics</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Export and share results</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-600 font-medium">Complete Grading Solution</span>
                  <ArrowRight className="w-6 h-6 text-purple-500 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
