import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Edit3,
  Save,
  X,
  Camera,
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthProvider";
import { studentApi } from "../../service/apiService";
import Toast from "../common/Toast";

export default function StudentProfile() {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    student_id: "",
    enrolled_subjects_count: 0,
    teachers_count: 0,
    total_exams_taken: 0,
    overall_average_percentage: 0,
    total_grade_points: 0,
    total_max_grade_points: 0
  });

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Load complete profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser?.id) return;

      try {
        setIsLoading(true);
        const response = await studentApi.getStudentProfile(currentUser.id);
        
        if (response.student) {
          setProfileData(response.student);
          setEditData({
            name: response.student.name || "",
            email: response.student.email || "",
            phone: response.student.phone || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setToast({
          show: true,
          message: "Failed to load profile data",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser?.id) return;

    // Validate required fields
    if (!editData.name?.trim()) {
      setToast({
        show: true,
        message: "Name is required",
        type: "error"
      });
      return;
    }

    if (!editData.email?.trim()) {
      setToast({
        show: true,
        message: "Email is required",
        type: "error"
      });
      return;
    }

    if (!editData.phone?.trim()) {
      setToast({
        show: true,
        message: "Phone number is required",
        type: "error"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Send all required fields plus bio
      const updateData = {
        name: editData.name.trim(),
        email: editData.email.trim(),
        phone: editData.phone.trim(),
      };

      const response = await studentApi.updateStudentProfile(currentUser.id, updateData);
      
      if (response.student) {
        setProfileData(response.student);
        
        // Update the user context with new name and email for navbar/sidebar
        updateUser({
          name: response.student.name,
          email: response.student.email
        });
        
        setToast({
          show: true,
          message: response.message || "Profile updated successfully",
          type: "success"
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Failed to update profile",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: profileData.name || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-sky-100 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "success" })}
        />
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Student Profile
              </h1>
              <p className="text-gray-600">
                Manage your personal information and academic details
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isEditing
                ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 hover:from-red-100 hover:to-rose-100"
                : "bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-700 border border-sky-200 hover:from-sky-100 hover:to-indigo-100"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isEditing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-4 border-sky-200 shadow-lg flex items-center justify-center text-3xl font-bold">
                  {(isEditing ? editData.name : profileData.name)
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase() || "U"}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-2 rounded-lg shadow-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-300">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {(isEditing ? editData.name : profileData.name) || "Student"}
              </h2>
         
            </div>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  ) : (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-100">
                      <User className="w-4 h-4 text-sky-600" />
                      <span className="text-gray-800">
                        {profileData.name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-100">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <span className="text-gray-800">
                        {profileData.email || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-100">
                      <Phone className="w-4 h-4 text-sky-600" />
                      <span className="text-gray-800">
                        {profileData.phone || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Teachers Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Connected Teachers
                  </label>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-100">
                    <User className="w-4 h-4 text-sky-600" />
                    <span className="text-gray-800">
                      {profileData.teachers_count || 0} teachers
                    </span>
                  </div>
                </div>

             
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Academic Statistics */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-sky-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-xl shadow-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Academic Statistics</h3>
            <p className="text-gray-600">Your performance overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Exams */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-800">
                {profileData.total_exams_taken || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-700">Total Exams</p>
          </div>

          {/* Overall Average */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-800">
                {profileData.overall_average_percentage || 0}%
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-700">Overall Average</p>
          </div>

          {/* Enrolled Subjects */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-800">
                {profileData.enrolled_subjects_count || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-yellow-700">Enrolled Subjects</p>
          </div>

          {/* Grade Points */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-purple-800">
                {profileData.total_grade_points || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-purple-700">Total Points</p>
          </div>
        </div>

        {/* Performance Details */}
        {profileData.total_exams_taken > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Performance Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">
                  Points Earned: <strong>{profileData.total_grade_points}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">
                  Total Possible: <strong>{profileData.total_max_grade_points}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-700">
                  Connected Teachers: <strong>{profileData.teachers_count}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
