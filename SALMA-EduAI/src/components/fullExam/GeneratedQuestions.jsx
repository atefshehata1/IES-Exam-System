
// GeneratedQuestions.jsx
import { useState } from "react";
import { Edit, Save, X, CheckCircle, Circle, Plus, Eye } from "lucide-react";

export default function GeneratedQuestions({ questions, saveSelectedQuestions }) {
  const [selectedQuestionIds, setSelectedQuestionIds] = useState(
    questions.map(q => q.id) // Select all by default
  );
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [previewMode, setPreviewMode] = useState(false);

  // Toggle question selection
  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestionIds(prevIds => 
      prevIds.includes(questionId)
        ? prevIds.filter(id => id !== questionId)
        : [...prevIds, questionId]
    );
  };

  // Select all questions
  const selectAll = () => {
    setSelectedQuestionIds(questions.map(q => q.id));
  };

  // Deselect all questions
  const selectNone = () => {
    setSelectedQuestionIds([]);
  };

  // Start editing a question
  const startEditing = (question) => {
    setEditingId(question.id);
    setEditData(question);
  };

  // Save edited question
  const saveEdit = () => {
    questions = questions.map(q => 
      q.id === editingId ? editData : q
    );
    setEditingId(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Handle saving all selected questions
  const handleSaveSelected = () => {
    const selectedQuestions = questions.filter(q => 
      selectedQuestionIds.includes(q.id)
    );
    saveSelectedQuestions(selectedQuestions);
  };

  return (
    <div>
      {/* Header with controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Generated Questions</h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedQuestionIds.length} of {questions.length} questions selected
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={selectNone}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Select None
              </button>
            </div>
            
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                previewMode 
                  ? "bg-green-100 text-green-700 hover:bg-green-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Eye className="w-4 h-4 mr-1" />
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>
            
            <button
              onClick={handleSaveSelected}
              disabled={selectedQuestionIds.length === 0}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
                selectedQuestionIds.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Selected to Collection
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          const isSelected = selectedQuestionIds.includes(question.id);
          const isEditing = editingId === question.id;
          
          return (
            <div 
              key={question.id} 
              className={`border rounded-lg shadow-sm transition-all ${
                isSelected 
                  ? "border-green-300 bg-green-50 shadow-md" 
                  : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              {isEditing ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={editData.question}
                      onChange={(e) => setEditData({...editData, question: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={editData.answer}
                      onChange={(e) => setEditData({...editData, answer: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <input
                      type="number"
                      value={editData.grade || 10}
                      onChange={(e) => setEditData({...editData, grade: parseInt(e.target.value)})}
                      className="w-24 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={cancelEdit}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                    <button 
                      onClick={saveEdit}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start">
                    <button
                      onClick={() => toggleQuestionSelection(question.id)}
                      className="mt-1 mr-4 focus:outline-none"
                    >
                      {isSelected ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-3">
                              Question {index + 1}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Grade: {question.grade || 10}
                            </span>
                          </div>
                          
                          <div 
                            className={`cursor-pointer ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                            onClick={() => toggleQuestionSelection(question.id)}
                          >
                            <div className="font-medium text-lg mb-3 leading-relaxed">
                              {question.question}
                            </div>
                            
                            {(previewMode || isSelected) && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="text-sm font-medium text-gray-600 mb-1">Answer:</div>
                                <div className="text-gray-800">{question.answer}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {!previewMode && (
                          <button 
                            onClick={() => startEditing(question)}
                            className="ml-4 flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {question.source && (
                        <div className="mt-3 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                          Source: {question.source}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 bg-white border rounded-lg p-4 sticky bottom-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{selectedQuestionIds.length}</span> of{" "}
            <span className="font-medium">{questions.length}</span> questions selected
          </div>
          
          <button
            onClick={handleSaveSelected}
            disabled={selectedQuestionIds.length === 0}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
              selectedQuestionIds.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add {selectedQuestionIds.length} Question{selectedQuestionIds.length !== 1 ? 's' : ''} to Collection
          </button>
        </div>
      </div>
    </div>
  );
}