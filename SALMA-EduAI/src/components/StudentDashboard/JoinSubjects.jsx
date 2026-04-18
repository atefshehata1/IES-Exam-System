import { useState } from "react";
import { Link, Users, BookOpen, Search, Plus } from "lucide-react";
import JoinSubjectNotification from "../common/JoinSubjectNotification";

export default function JoinSubjects() {
  const [inviteLink, setInviteLink] = useState("");
  const [notification, setNotification] = useState(null);

  const handleJoinViaLink = () => {
    if (!inviteLink.trim()) {
      setNotification({
        message: "Please enter a valid invite link",
        type: "error"
      });
      return;
    }

    try {
      // Extract the teacher and subject ID from the link
      const url = new URL(inviteLink);
      const pathParts = url.pathname.split('/');
      
      if (pathParts.length >= 4 && pathParts[1] === 'join-subject') {
        const teacherId = pathParts[2];
        const subjectId = pathParts[3];
        
        // Navigate to the join subject page
        window.location.href = `/join-subject/${teacherId}/${subjectId}`;
      } else {
        setNotification({
          message: "Invalid invite link format",
          type: "error"
        });
      }
    } catch (error) {
      setNotification({
        message: "Invalid invite link format",
        type: "error"
      });
    }
  };

  return (
    <div className="space-y-8">
      <JoinSubjectNotification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Plus className="w-8 h-8 mr-3 text-sky-600" />
            Join Subjects
          </h1>
          <p className="text-gray-600 mt-2">
            Join new subjects using invite links from your teachers
          </p>
        </div>
      </div>

      {/* Join via Link Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
            <Link className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Join via Invite Link</h2>
            <p className="text-gray-600 text-sm">
              Enter the invite link shared by your teacher
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="inviteLink" className="block text-sm font-medium text-gray-700 mb-2">
              Invite Link
            </label>
            <input
              type="url"
              id="inviteLink"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="https://yourapp.com/join-subject/teacher-id/subject-id"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleJoinViaLink}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Join Subject</span>
          </button>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-200 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-sky-600" />
          How to Join Subjects
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="text-gray-700">
                <strong>Get the invite link</strong> from your teacher via email, messaging app, or direct sharing
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="text-gray-700">
                <strong>Paste the link</strong> in the input field above or click on the link directly
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="text-gray-700">
                <strong>Click "Join Subject"</strong> to be automatically enrolled in the class
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
