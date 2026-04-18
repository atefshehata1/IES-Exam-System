import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, BookOpen, Save, Edit2, Camera, Plus, X, RefreshCw, Users, FileText, GraduationCap } from "lucide-react";
import { teacherApi } from "../../service/apiService";
import { useAuth } from "../../context/AuthProvider";

export default function InstructorProfile() {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    subjects_count: 0,
    exams_count: 0,
    students_count: 0,
    pdfs_count: 0
  });

  // Fetch teacher profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id) return;
      
      try {
        setProfileLoading(true);
        const response = await teacherApi.getTeacherProfile(currentUser.id);
        setProfile(response.teacher);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile information");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser?.id]);

  // Fetch teacher subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        const response = await teacherApi.getTeacherSubjects(currentUser.id);
        setSubjects(response.subjects || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [currentUser?.id]); // Only depend on currentUser.id

  const handleAddSubject = async () => {
    if (!newSubject.trim() || !currentUser?.id) return;

    try {
      setLoading(true);
      setError("");
      await teacherApi.addSubjectToTeacher(currentUser.id, newSubject.trim());
      
      // Refresh subjects list
      const subjectsResponse = await teacherApi.getTeacherSubjects(currentUser.id);
      setSubjects(subjectsResponse.subjects || []);
      
      // Refresh profile data to update counts
      const profileResponse = await teacherApi.getTeacherProfile(currentUser.id);
      setProfile(profileResponse.teacher);
      
      setNewSubject("");
      setIsAddingSubject(false);
    } catch (err) {
      console.error("Error adding subject:", err);
      setError(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      // Validate required fields
      if (!profile.name || !profile.name.trim()) {
        setError("Name is required");
        return;
      }
      if (!profile.email || !profile.email.trim()) {
        setError("Email is required");
        return;
      }
      if (!profile.phone || !profile.phone.trim()) {
        setError("Phone number is required");
        return;
      }

      const updateData = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        bio: profile.bio?.trim() || ""
      };

      const response = await teacherApi.updateTeacherProfile(currentUser.id, updateData);
      setProfile(response.teacher);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Update user info in AuthContext to refresh navbar and sidebar
      updateUser({
        name: response.teacher.name,
        email: response.teacher.email
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          Instructor Profile
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your personal information and academic profile
        </p>
      </div>

      {/* Loading State */}
      {profileLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            <p className="text-gray-600 text-sm">Loading profile...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage("")}
                className="ml-2 text-green-500 hover:text-green-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6 space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-sky-200 hover:bg-sky-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mt-4">{profile.name}</h2>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                  </button>
                  
                  {isEditing && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-sky-100 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-sky-600" />
                      </div>
                      <span className="text-gray-700">Subjects</span>
                    </div>
                    <span className="font-semibold text-gray-800">{profile.subjects_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700">Students</span>
                    </div>
                    <span className="font-semibold text-gray-800">{profile.students_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-700">Exams</span>
                    </div>
                    <span className="font-semibold text-gray-800">{profile.exams_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-gray-700">PDFs</span>
                    </div>
                    <span className="font-semibold text-gray-800">{profile.pdfs_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button
                      onClick={() => setError("")}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profile.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profile.email}</div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profile.phone}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Biography</h3>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about yourself, your experience, and teaching philosophy..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profile.bio || "No biography provided yet. Click 'Edit Profile' to add one."}
                  </p>
                )}
              </div>

              {/* Subjects */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Teaching Subjects
                  </h3>
                  <button
                    onClick={() => setIsAddingSubject(true)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                    {error}
                    <button
                      onClick={() => setError("")}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4 inline" />
                    </button>
                  </div>
                )}

                {isAddingSubject && (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Enter subject name..."
                        className="flex-1 px-3 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                      />
                      <button
                        onClick={handleAddSubject}
                        disabled={loading || !newSubject.trim()}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSubject(false);
                          setNewSubject("");
                          setError("");
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {loading && !isAddingSubject ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-5 h-5 animate-spin text-sky-600 mr-2" />
                    <span className="text-gray-600">Loading subjects...</span>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No subjects added yet. Click "Add Subject" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="px-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sky-700">
                              {subject.name}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-600">
                                {subject.students_count} student{subject.students_count !== 1 ? 's' : ''}
                              </p>
                              <p className="text-sm text-gray-600">
                                {subject.exams_count} exam{subject.exams_count !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
