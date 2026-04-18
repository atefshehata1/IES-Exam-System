import { useState } from "react";
import { Copy, CheckCircle, Link, Users, BookOpen, Share2 } from "lucide-react";

export default function SubjectInviteLink({ subject, teacherId, onClose, standalone = false }) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Generate the invite link
  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/join-subject/${teacherId}/${subject.id}`;
  };

  const inviteLink = generateInviteLink();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleCloseModal = () => {
    if (standalone && onClose) {
      onClose();
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Only show the trigger button if not in standalone mode */}
      {!standalone && (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Link</span>
        </button>
      )}

      {/* Show modal content either when showModal is true or in standalone mode */}
      {(showModal || standalone) && (
        <div className={standalone ? "" : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"}>
          <div className={standalone ? "w-full p-6" : "bg-white rounded-2xl shadow-xl max-w-md w-full p-6"}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                  <Link className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Share Subject Link
                  </h3>
                  <p className="text-sm text-gray-600">{subject.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Share this link with students to let them join your class
                automatically.
              </p>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded border px-3 py-2 text-sm font-mono text-gray-700 overflow-hidden">
                    {inviteLink}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center space-x-1 px-3 py-2 rounded transition-all duration-200 ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
