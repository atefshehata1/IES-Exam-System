// No React import needed for React 17+

const GeneratedQuestion = ({ question, onCheckboxChange, onEdit, onDelete }) => {
  // Function to determine grade color based on numeric value
  const getGradeColor = (grade) => {
    if (grade >= 20) return "bg-red-100 text-red-800"; // A equivalent
    if (grade >= 15) return "bg-blue-100 text-blue-800"; // B equivalent
    if (grade >= 10) return "bg-cyan-100 text-cyan-800"; // C equivalent
    if (grade >= 5) return "bg-green-100 text-green-800"; // D equivalent
    return "bg-rose-100 text-rose-800";  // F equivalent
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-200">
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={question.isSelected}
          onChange={() => onCheckboxChange(question.id)}
          className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <div className="ml-3 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">
              {question.question}
            </h3>
            <div className="flex items-center space-x-2">
              {typeof question.grade === "number" && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(
                    question.grade
                  )}`}
                >
                  Grade: {question.grade}
                </span>
              )}
            </div>
          </div>
          <p className="mt-2 text-gray-600">{question.answer}</p>
          {question.source && (
            <div className="mt-2 text-xs text-gray-500">
              Source: {question.source}
            </div>
          )}          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(question)}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(question.id)}
                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedQuestion;
