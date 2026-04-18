import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { navigateBasedOnRole } from "../../utils/navigation";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register } = useAuth();

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    if (!name.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!role) {
      setError("Please select whether you are a Teacher or Student");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setError("");
    if (validateStep1()) {
      setStep(2);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateStep2()) {
      return;
    }

    try {
      setIsLoading(true);

      const result = await register(name, email, password, role);

      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }

      setStep(3);

      // After successful registration, automatically navigate to appropriate dashboard
      setTimeout(() => {
        if (result.redirectTo) {
          navigate(result.redirectTo);
        } else {
          // Fallback to role-based navigation
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            navigateBasedOnRole(user, navigate);
          } else {
            // Fallback if user data is not available
            navigate("/login");
          }
        }
      }, 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: "", color: "" };

    if (password.length < 6) {
      return { strength: 1, text: "Weak", color: "bg-red-400" };
    } else if (password.length < 10) {
      return { strength: 2, text: "Medium", color: "bg-yellow-400" };
    } else {
      return { strength: 3, text: "Strong", color: "bg-emerald-400" };
    }
  };

  const passwordStrength = getPasswordStrength();

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-semibold"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User
              className="h-5 w-5"
              style={{ color: "var(--theme-brandPrimary)" }}
            />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 theme-backdrop"
            style={{
              backgroundColor: "var(--theme-inputBackground)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-textPrimary)",
            }}
            placeholder="Enter your full name"
            onFocus={(e) => {
              e.target.style.borderColor = "var(--theme-brandPrimary)";
              e.target.style.boxShadow = `0 0 0 2px var(--theme-brandPrimary)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--theme-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail
              className="h-5 w-5"
              style={{ color: "var(--theme-brandPrimary)" }}
            />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 theme-backdrop"
            style={{
              backgroundColor: "var(--theme-inputBackground)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-textPrimary)",
            }}
            placeholder="Enter your email address"
            onFocus={(e) => {
              e.target.style.borderColor = "var(--theme-brandPrimary)";
              e.target.style.boxShadow = `0 0 0 2px var(--theme-brandPrimary)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--theme-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-3">
        <label
          className="block text-sm font-semibold"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          I am a
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "teacher" })}
            className={`relative rounded-xl border-2 p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] theme-backdrop ${
              role === "teacher"
                ? "ring-2 theme-shadow-lg"
                : "hover:theme-shadow-md"
            }`}
            style={{
              backgroundColor:
                role === "teacher"
                  ? "var(--theme-tertiary)"
                  : "var(--theme-cardBackground)",
              borderColor:
                role === "teacher"
                  ? "var(--theme-brandPrimary)"
                  : "var(--theme-border)",
              "--ring-color":
                role === "teacher"
                  ? "var(--theme-brandPrimary)"
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (role !== "teacher") {
                e.target.style.backgroundColor = "var(--theme-tertiary)";
                e.target.style.borderColor = "var(--theme-textTertiary)";
              }
            }}
            onMouseLeave={(e) => {
              if (role !== "teacher") {
                e.target.style.backgroundColor = "var(--theme-cardBackground)";
                e.target.style.borderColor = "var(--theme-border)";
              }
            }}
          >
            <div
              className={`rounded-full p-2 mb-3 theme-shadow-md ${
                role === "teacher" ? "text-white" : ""
              }`}
              style={{
                background:
                  role === "teacher"
                    ? "var(--theme-gradientPrimary)"
                    : "var(--theme-tertiary)",
                color:
                  role === "teacher" ? "#ffffff" : "var(--theme-brandPrimary)",
              }}
            >
              <BookOpen className="h-8 w-8" />
            </div>
            <span
              className={`text-lg font-semibold ${
                role === "teacher" ? "" : ""
              }`}
              style={{
                color:
                  role === "teacher"
                    ? "var(--theme-brandPrimary)"
                    : "var(--theme-textPrimary)",
              }}
            >
              Teacher
            </span>
            <span
              className="text-sm mt-1 text-center"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              Create and grade exams
            </span>
            {role === "teacher" && (
              <div className="absolute top-3 right-3">
                <CheckCircle
                  className="h-6 w-6"
                  style={{ color: "var(--theme-brandPrimary)" }}
                />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "student" })}
            className={`relative rounded-xl border-2 p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] theme-backdrop ${
              role === "student"
                ? "ring-2 theme-shadow-lg"
                : "hover:theme-shadow-md"
            }`}
            style={{
              backgroundColor:
                role === "student"
                  ? "var(--theme-tertiary)"
                  : "var(--theme-cardBackground)",
              borderColor:
                role === "student"
                  ? "var(--theme-brandPrimary)"
                  : "var(--theme-border)",
            }}
            onMouseEnter={(e) => {
              if (role !== "student") {
                e.target.style.backgroundColor = "var(--theme-tertiary)";
                e.target.style.borderColor = "var(--theme-textTertiary)";
              }
            }}
            onMouseLeave={(e) => {
              if (role !== "student") {
                e.target.style.backgroundColor = "var(--theme-cardBackground)";
                e.target.style.borderColor = "var(--theme-border)";
              }
            }}
          >
            <div
              className={`rounded-full p-4 mb-3 theme-shadow-md ${
                role === "student" ? "text-white" : ""
              }`}
              style={{
                background:
                  role === "student"
                    ? "var(--theme-gradientPrimary)"
                    : "var(--theme-tertiary)",
                color:
                  role === "student" ? "#ffffff" : "var(--theme-brandPrimary)",
              }}
            >
              <GraduationCap className="h-8 w-8" />
            </div>
            <span
              className={`text-lg font-semibold ${
                role === "student" ? "" : ""
              }`}
              style={{
                color:
                  role === "student"
                    ? "var(--theme-brandPrimary)"
                    : "var(--theme-textPrimary)",
              }}
            >
              Student
            </span>
            <span
              className="text-sm mt-1 text-center"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              Take exams and view results
            </span>
            {role === "student" && (
              <div className="absolute top-3 right-3">
                <CheckCircle
                  className="h-6 w-6"
                  style={{ color: "var(--theme-brandPrimary)" }}
                />
              </div>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        className="w-full text-white py-3 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] theme-shadow-lg hover:theme-shadow-xl flex items-center justify-center space-x-2"
        style={{ background: "var(--theme-gradientPrimary)" }}
      >
        <span>Continue</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock
              className="h-5 w-5"
              style={{ color: "var(--theme-brandPrimary)" }}
            />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={handleChange}
            className="w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 theme-backdrop"
            style={{
              backgroundColor: "var(--theme-inputBackground)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-textPrimary)",
            }}
            placeholder="Create a secure password"
            onFocus={(e) => {
              e.target.style.borderColor = "var(--theme-brandPrimary)";
              e.target.style.boxShadow = `0 0 0 2px var(--theme-brandPrimary)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--theme-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
            style={{ color: "var(--theme-brandPrimary)" }}
            onMouseEnter={(e) => {
              e.target.style.color = "var(--theme-textAccent)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "var(--theme-brandPrimary)";
            }}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className="text-xs"
                style={{ color: "var(--theme-textSecondary)" }}
              >
                Password strength:
              </span>
              <span
                className={`text-xs font-medium`}
                style={{
                  color:
                    passwordStrength.strength === 3
                      ? "var(--theme-success)"
                      : passwordStrength.strength === 2
                      ? "var(--theme-warning)"
                      : "var(--theme-error)",
                }}
              >
                {passwordStrength.text}
              </span>
            </div>
            <div
              className="w-full rounded-full h-2"
              style={{ backgroundColor: "var(--theme-border)" }}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300`}
                style={{
                  width: `${passwordStrength.strength * 33.3}%`,
                  backgroundColor:
                    passwordStrength.strength === 3
                      ? "var(--theme-success)"
                      : passwordStrength.strength === 2
                      ? "var(--theme-warning)"
                      : "var(--theme-error)",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Shield
              className="h-5 w-5"
              style={{ color: "var(--theme-brandPrimary)" }}
            />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={handleChange}
            className="w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 theme-backdrop"
            style={{
              backgroundColor: "var(--theme-inputBackground)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-textPrimary)",
            }}
            placeholder="Confirm your password"
            onFocus={(e) => {
              e.target.style.borderColor = "var(--theme-brandPrimary)";
              e.target.style.boxShadow = `0 0 0 2px var(--theme-brandPrimary)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--theme-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
            style={{ color: "var(--theme-brandPrimary)" }}
            onMouseEnter={(e) => {
              e.target.style.color = "var(--theme-textAccent)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "var(--theme-brandPrimary)";
            }}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs mt-1" style={{ color: "var(--theme-error)" }}>
            Passwords do not match
          </p>
        )}
        {confirmPassword && password === confirmPassword && (
          <p
            className="text-xs mt-1 flex items-center"
            style={{ color: "var(--theme-success)" }}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Passwords match
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 flex items-center justify-center py-3 px-6 border-2 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] space-x-2 theme-backdrop"
          style={{
            color: "var(--theme-textPrimary)",
            backgroundColor: "var(--theme-cardBackground)",
            borderColor: "var(--theme-border)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--theme-tertiary)";
            e.target.style.borderColor = "var(--theme-textTertiary)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "var(--theme-cardBackground)";
            e.target.style.borderColor = "var(--theme-border)";
          }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 text-white py-3 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] theme-shadow-lg hover:theme-shadow-xl flex items-center justify-center space-x-2"
          style={{ background: "var(--theme-gradientPrimary)" }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8 space-y-6">
      <div className="relative mx-auto flex items-center justify-center h-20 w-20">
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ background: "var(--theme-gradientAccent)" }}
        ></div>
        <div
          className="relative rounded-full p-4 theme-shadow-lg"
          style={{ backgroundColor: "var(--theme-cardBackground)" }}
        >
          <CheckCircle
            className="h-12 w-12"
            style={{ color: "var(--theme-success)" }}
          />
        </div>
        <Sparkles
          className="absolute -top-2 -right-2 w-8 h-8 animate-bounce"
          style={{ color: "var(--theme-warning)" }}
        />
      </div>

      <div className="space-y-3">
        <h3
          className="text-3xl font-bold"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          Welcome to IES!
        </h3>
        <p
          className="text-lg max-w-md mx-auto"
          style={{ color: "var(--theme-textSecondary)" }}
        >
          Your account has been created successfully as a{" "}
          <span
            className="font-semibold capitalize"
            style={{ color: "var(--theme-brandPrimary)" }}
          >
            {role}
          </span>
          .
        </p>
        <p className="text-sm" style={{ color: "var(--theme-textTertiary)" }}>
          You'll be redirected to the login page shortly...
        </p>
      </div>

      <div
        className="rounded-xl p-6 space-y-4 border theme-backdrop"
        style={{
          backgroundColor: "var(--theme-tertiary)",
          borderColor: "var(--theme-border)",
        }}
      >
        <h4
          className="font-semibold flex items-center justify-center space-x-2"
          style={{ color: "var(--theme-textPrimary)" }}
        >
          <Zap
            className="h-5 w-5"
            style={{ color: "var(--theme-brandPrimary)" }}
          />
          <span>What's Next?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {role === "teacher" ? (
            <>
              <div
                className="rounded-lg p-3 theme-backdrop"
                style={{ backgroundColor: "var(--theme-cardBackground)" }}
              >
                <div
                  className="font-medium"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  📚 Create Exams
                </div>
                <div style={{ color: "var(--theme-textSecondary)" }}>
                  Upload PDFs and generate questions
                </div>
              </div>
              <div
                className="rounded-lg p-3 theme-backdrop"
                style={{ backgroundColor: "var(--theme-cardBackground)" }}
              >
                <div
                  className="font-medium"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  🤖 AI Grading
                </div>
                <div style={{ color: "var(--theme-textSecondary)" }}>
                  Automatic assessment with OCR
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="rounded-lg p-3 theme-backdrop"
                style={{ backgroundColor: "var(--theme-cardBackground)" }}
              >
                <div
                  className="font-medium"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  📝 Take Exams
                </div>
                <div style={{ color: "var(--theme-textSecondary)" }}>
                  Access your assigned tests
                </div>
              </div>
              <div
                className="rounded-lg p-3 theme-backdrop"
                style={{ backgroundColor: "var(--theme-cardBackground)" }}
              >
                <div
                  className="font-medium"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  📊 View Results
                </div>
                <div style={{ color: "var(--theme-textSecondary)" }}>
                  Track your performance
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Link
        to="/login"
        className="inline-flex items-center space-x-2 text-white py-3 px-8 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] theme-shadow-lg hover:theme-shadow-xl"
        style={{ background: "var(--theme-gradientPrimary)" }}
      >
        <span>Sign In Now</span>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden theme-transition"
      style={{
        background: "var(--theme-gradientSecondary)",
        color: "var(--theme-textPrimary)",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="register-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#register-grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <div
          className="w-32 h-32 rounded-full blur-xl"
          style={{ background: "var(--theme-gradientPrimary)" }}
        ></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <div
          className="w-40 h-40 rounded-full blur-xl"
          style={{ background: "var(--theme-gradientAccent)" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Welcome Section - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className="text-white p-4 rounded-2xl theme-shadow-lg"
                    style={{ background: "var(--theme-gradientPrimary)" }}
                  >
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <Sparkles
                    className="absolute -top-1 -right-1 w-6 h-6 animate-pulse"
                    style={{ color: "var(--theme-warning)" }}
                  />
                </div>
                <div>
                  <span
                    className="text-4xl font-bold"
                    style={{
                      background: "var(--theme-gradientPrimary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontFamily: "Patrick Hand, cursive",
                    }}
                  >
                    IES
                  </span>
                  <div
                    className="text-lg font-medium"
                    style={{ color: "var(--theme-textSecondary)" }}
                  >
                    AI Assessment Platform
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1
                  className="text-5xl font-bold leading-tight"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  Join the
                  <span
                    className="block"
                    style={{
                      background: "var(--theme-gradientPrimary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Educational Revolution
                  </span>
                </h1>
                <p
                  className="text-xl leading-relaxed max-w-lg"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  Create your account and experience the future of intelligent
                  assessment and automated grading.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-4">
                <div
                  className="rounded-xl p-4 border theme-shadow-sm theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-cardBackground)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "var(--theme-tertiary)" }}
                    >
                      <Zap
                        className="h-5 w-5"
                        style={{ color: "var(--theme-brandPrimary)" }}
                      />
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--theme-textPrimary)" }}
                      >
                        AI-Powered Grading
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--theme-textSecondary)" }}
                      >
                        Automatic assessment with 95% accuracy
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 border theme-shadow-sm theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-cardBackground)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "var(--theme-tertiary)" }}
                    >
                      <BookOpen
                        className="h-5 w-5"
                        style={{ color: "var(--theme-success)" }}
                      />
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--theme-textPrimary)" }}
                      >
                        Smart Question Generation
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--theme-textSecondary)" }}
                      >
                        Create exams from PDFs instantly
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Form Section */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="text-white p-3 rounded-2xl theme-shadow-lg"
                    style={{ background: "var(--theme-gradientPrimary)" }}
                  >
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <Sparkles
                    className="absolute -top-1 -right-1 w-4 h-4 animate-pulse"
                    style={{ color: "var(--theme-warning)" }}
                  />
                </div>
              </div>
              <h2
                className="text-3xl font-bold"
                style={{ color: "var(--theme-textPrimary)" }}
              >
                Create Account
              </h2>
              <p
                className="mt-2"
                style={{ color: "var(--theme-textSecondary)" }}
              >
                Join IES and start your journey
              </p>
            </div>

            {/* Form Card */}
            <div
              className="rounded-2xl theme-shadow-xl border p-8 space-y-6 theme-backdrop"
              style={{
                backgroundColor: "var(--theme-cardBackground)",
                borderColor: "var(--theme-border)",
              }}
            >
              {/* Desktop Header */}
              <div className="hidden lg:block text-center space-y-2">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  Create Your Account
                </h3>
                <p style={{ color: "var(--theme-textSecondary)" }}>
                  Join thousands of educators and students
                </p>
              </div>

              {/* Error Messages */}
              {error && (
                <div
                  className="border rounded-xl p-4 theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-errorBackground)",
                    borderColor: "var(--theme-error)",
                  }}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--theme-error)" }}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--theme-error)" }}
                      >
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              {step < 3 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${step >= 1 ? "" : ""}`}
                      style={{
                        color:
                          step >= 1
                            ? "var(--theme-brandPrimary)"
                            : "var(--theme-textTertiary)",
                      }}
                    >
                      Account Details
                    </span>
                    <span
                      className={`text-sm font-medium ${step >= 2 ? "" : ""}`}
                      style={{
                        color:
                          step >= 2
                            ? "var(--theme-brandPrimary)"
                            : "var(--theme-textTertiary)",
                      }}
                    >
                      Security
                    </span>
                    <span
                      className={`text-sm font-medium ${step >= 3 ? "" : ""}`}
                      style={{
                        color:
                          step >= 3
                            ? "var(--theme-brandPrimary)"
                            : "var(--theme-textTertiary)",
                      }}
                    >
                      Complete
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div
                        className="w-full h-1 rounded-full"
                        style={{ backgroundColor: "var(--theme-border)" }}
                      ></div>
                    </div>
                    <div className="relative flex justify-between">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          step >= 1
                            ? "text-white theme-shadow-lg"
                            : "border-2 text-gray-400"
                        }`}
                        style={{
                          background:
                            step >= 1
                              ? "var(--theme-gradientPrimary)"
                              : "var(--theme-cardBackground)",
                          borderColor:
                            step >= 1 ? "transparent" : "var(--theme-border)",
                          color:
                            step >= 1 ? "#ffffff" : "var(--theme-textTertiary)",
                        }}
                      >
                        {step > 1 ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">1</span>
                        )}
                      </div>
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          step >= 2 ? "text-white theme-shadow-lg" : "border-2"
                        }`}
                        style={{
                          background:
                            step >= 2
                              ? "var(--theme-gradientPrimary)"
                              : "var(--theme-cardBackground)",
                          borderColor:
                            step >= 2 ? "transparent" : "var(--theme-border)",
                          color:
                            step >= 2 ? "#ffffff" : "var(--theme-textTertiary)",
                        }}
                      >
                        {step > 2 ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">2</span>
                        )}
                      </div>
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          step >= 3 ? "text-white theme-shadow-lg" : "border-2"
                        }`}
                        style={{
                          background:
                            step >= 3
                              ? "var(--theme-gradientPrimary)"
                              : "var(--theme-cardBackground)",
                          borderColor:
                            step >= 3 ? "transparent" : "var(--theme-border)",
                          color:
                            step >= 3 ? "#ffffff" : "var(--theme-textTertiary)",
                        }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderSuccessStep()}
              </form>

              {step < 3 && (
                <>
                  {/* Terms */}
                  <p
                    className="text-xs text-center border-t pt-4"
                    style={{
                      color: "var(--theme-textTertiary)",
                      borderColor: "var(--theme-border)",
                    }}
                  >
                    By creating an account, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="hover:underline"
                      style={{ color: "var(--theme-brandPrimary)" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="hover:underline"
                      style={{ color: "var(--theme-brandPrimary)" }}
                    >
                      Privacy Policy
                    </Link>
                  </p>

                  {/* Sign In Link */}
                  <div className="text-center">
                    <p style={{ color: "var(--theme-textSecondary)" }}>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-semibold hover:underline decoration-2 underline-offset-4 transition-all duration-300"
                        style={{ color: "var(--theme-brandPrimary)" }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "var(--theme-textAccent)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "var(--theme-brandPrimary)";
                        }}
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
