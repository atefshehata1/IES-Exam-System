import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { navigateBasedOnRole } from "../../utils/navigation";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Github,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const result = await login(email, password);

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      setSuccess(true);

      // Navigate based on user role after successful login
      setTimeout(() => {
        if (result.redirectTo) {
          navigate(result.redirectTo);
        } else {
          // Fallback to role-based navigation
          const user = JSON.parse(localStorage.getItem("user"));
          navigateBasedOnRole(user, navigate);
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to log in");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
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
              id="login-grid"
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
          <rect width="100%" height="100%" fill="url(#login-grid)" />
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
                  Welcome Back to the
                  <span
                    className="block"
                    style={{
                      background: "var(--theme-gradientPrimary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Future of Education
                  </span>
                </h1>
                <p
                  className="text-xl leading-relaxed max-w-lg"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  Sign in to continue revolutionizing education through
                  intelligent assessment and automated grading.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div
                  className="rounded-xl p-4 border theme-shadow-sm theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-cardBackground)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--theme-brandPrimary)" }}
                  >
                    70%
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--theme-textSecondary)" }}
                  >
                    Time Saved
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 border theme-shadow-sm theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-cardBackground)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--theme-success)" }}
                  >
                    95%
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--theme-textSecondary)" }}
                  >
                    OCR Accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="text-white p-3 rounded-2xl theme-shadow-lg"
                    style={{ background: "var(--theme-gradientPrimary)" }}
                  >
                    <GraduationCap className="w-6 h-6" />
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
                Welcome Back
              </h2>
              <p
                className="mt-2"
                style={{ color: "var(--theme-textSecondary)" }}
              >
                Sign in to your IES account
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
                  Sign In
                </h3>
                <p style={{ color: "var(--theme-textSecondary)" }}>
                  Enter your credentials to continue
                </p>
              </div>

              {/* Error/Success Messages */}
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

              {success && (
                <div
                  className="border rounded-xl p-4 theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-successBackground)",
                    borderColor: "var(--theme-success)",
                  }}
                >
                  <div className="flex items-center">
                    <CheckCircle
                      className="h-5 w-5 mr-3"
                      style={{ color: "var(--theme-success)" }}
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--theme-success)" }}
                    >
                      Login successful! Redirecting...
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 theme-backdrop"
                      style={{
                        backgroundColor: "var(--theme-inputBackground)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-textPrimary)",
                        "--focus-ring-color": "var(--theme-brandPrimary)",
                      }}
                      placeholder="Enter your email address"
                      onFocus={(e) => {
                        e.target.style.borderColor =
                          "var(--theme-brandPrimary)";
                        e.target.style.boxShadow = `0 0 0 2px var(--theme-brandPrimary)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--theme-border)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 theme-backdrop"
                      style={{
                        backgroundColor: "var(--theme-inputBackground)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-textPrimary)",
                      }}
                      placeholder="Enter your password"
                      onFocus={(e) => {
                        e.target.style.borderColor =
                          "var(--theme-brandPrimary)";
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
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{
                        accentColor: "var(--theme-brandPrimary)",
                        backgroundColor: "var(--theme-inputBackground)",
                        borderColor: "var(--theme-border)",
                      }}
                    />
                    <span
                      className="ml-2 text-sm"
                      style={{ color: "var(--theme-textSecondary)" }}
                    >
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all duration-300"
                    style={{ color: "var(--theme-brandPrimary)" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--theme-textAccent)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--theme-brandPrimary)";
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] theme-shadow-lg hover:theme-shadow-xl flex items-center justify-center space-x-2"
                  style={{
                    background: "var(--theme-gradientPrimary)",
                    "--focus-ring-color": "var(--theme-brandPrimary)",
                  }}
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className="w-full border-t"
                    style={{ borderColor: "var(--theme-border)" }}
                  ></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className="px-4 font-medium theme-backdrop"
                    style={{
                      backgroundColor: "var(--theme-cardBackground)",
                      color: "var(--theme-textTertiary)",
                    }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] theme-shadow-sm hover:theme-shadow-md theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-inputBackground)",
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-textSecondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--theme-tertiary)";
                    e.target.style.borderColor = "var(--theme-brandPrimary)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor =
                      "var(--theme-inputBackground)";
                    e.target.style.borderColor = "var(--theme-border)";
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] theme-shadow-sm hover:theme-shadow-md theme-backdrop"
                  style={{
                    backgroundColor: "var(--theme-inputBackground)",
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-textSecondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--theme-tertiary)";
                    e.target.style.borderColor = "var(--theme-brandPrimary)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor =
                      "var(--theme-inputBackground)";
                    e.target.style.borderColor = "var(--theme-border)";
                  }}
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p style={{ color: "var(--theme-textSecondary)" }}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold hover:underline decoration-2 underline-offset-4 transition-all duration-300"
                    style={{ color: "var(--theme-brandPrimary)" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--theme-textAccent)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--theme-brandPrimary)";
                    }}
                  >
                    Create your account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
