import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  BookOpen,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import ThemeSwitcher from "../components/common/ThemeSwitcher";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCreateExamOpen && !event.target.closest("#create-exam-dropdown")) {
        setIsCreateExamOpen(false);
      }
      if (isUserMenuOpen && !event.target.closest("#user-menu-dropdown")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateExamOpen, isUserMenuOpen]);

  const toggleCreateExamDropdown = () => {
    setIsCreateExamOpen(!isCreateExamOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenuDropdown = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsCreateExamOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 theme-transition ${
        isScrolled
          ? "theme-backdrop theme-shadow-lg border-b theme-border"
          : "theme-bg-secondary theme-backdrop"
      }`}
      style={{
        backgroundColor: isScrolled
          ? "var(--theme-cardBackground)"
          : "var(--theme-secondary)",
        borderColor: "var(--theme-border)",
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Enhanced with modern design */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div
                className="text-white text-xl font-bold px-3 py-2 rounded-xl theme-shadow transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                style={{ background: "var(--theme-gradientPrimary)" }}
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <Sparkles
                className="absolute -top-1 -right-1 w-4 h-4 animate-pulse"
                style={{ color: "var(--theme-warning)" }}
              />
            </div>
            <div className="ml-3">
              <span
                className="text-2xl font-bold"
                style={{
                  background: "var(--theme-gradientPrimary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "Patrick Hand, cursive",
                }}
              >
                I E S
              </span>
              <div className="text-xs font-medium theme-text-secondary">
                AI Assessment
              </div>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl theme-text-secondary hover:theme-text-accent theme-transition focus:outline-none transition-all duration-300"
              style={{
                backgroundColor: "var(--theme-cardBackground)",
                color: "var(--theme-textSecondary)",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--theme-textAccent)";
                e.target.style.backgroundColor = "var(--theme-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--theme-textSecondary)";
                e.target.style.backgroundColor = "var(--theme-cardBackground)";
              }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div
              className="flex space-x-2 rounded-2xl p-2 theme-shadow border theme-backdrop"
              style={{
                backgroundColor: "var(--theme-cardBackground)",
                borderColor: "var(--theme-border)",
              }}
            >
              <NavLink to="/" label="Home" />

              {/* Role-based navigation */}
              {currentUser?.role === "student" ? (
                <NavLink to="/student-dashboard" label="Dashboard" />
              ) : currentUser?.role === "teacher" ||
                currentUser?.role === "instructor" ? (
                <>
                  <NavLink to="/dashboard" label="Dashboard" />

                  {/* Create Exam Dropdown - Teachers only */}
                  <div className="relative" id="create-exam-dropdown">
                    <button
                      onClick={toggleCreateExamDropdown}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center theme-transition ${
                        isCreateExamOpen ? "" : ""
                      }`}
                      style={{
                        backgroundColor: isCreateExamOpen
                          ? "var(--theme-tertiary)"
                          : "transparent",
                        color: isCreateExamOpen
                          ? "var(--theme-textAccent)"
                          : "var(--theme-textSecondary)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isCreateExamOpen) {
                          e.target.style.color = "var(--theme-textAccent)";
                          e.target.style.backgroundColor =
                            "var(--theme-tertiary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCreateExamOpen) {
                          e.target.style.color = "var(--theme-textSecondary)";
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Create
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                          isCreateExamOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isCreateExamOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 w-56 rounded-2xl theme-shadow-xl border z-[110] overflow-hidden theme-backdrop"
                        style={{
                          backgroundColor: "var(--theme-cardBackground)",
                          borderColor: "var(--theme-border)",
                        }}
                      >
                        <div className="py-2">
                          <Link
                            to="/create"
                            onClick={() => setIsCreateExamOpen(false)}
                            className="flex items-center px-4 py-3 text-sm transition-all duration-300 theme-text-primary hover:theme-bg-tertiary"
                            style={{ color: "var(--theme-textPrimary)" }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor =
                                "var(--theme-tertiary)";
                              e.target.style.color = "var(--theme-textAccent)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "var(--theme-textPrimary)";
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white"
                              style={{
                                background: "var(--theme-gradientPrimary)",
                              }}
                            >
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">Custom Exam</div>
                              <div className="text-xs theme-text-secondary">
                                Tailored questions
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/create/full"
                            onClick={() => setIsCreateExamOpen(false)}
                            className="flex items-center px-4 py-3 text-sm transition-all duration-300 theme-text-primary"
                            style={{ color: "var(--theme-textPrimary)" }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor =
                                "var(--theme-tertiary)";
                              e.target.style.color = "var(--theme-textAccent)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "var(--theme-textPrimary)";
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white"
                              style={{
                                background: "var(--theme-gradientAccent)",
                              }}
                            >
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">Full Exam</div>
                              <div className="text-xs theme-text-secondary">
                                Complete assessment
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <NavLink
                    to="/grades"
                    label="Analytics"
                    icon={<BarChart3 className="w-4 h-4" />}
                  />
                </>
              ) : !currentUser ? (
                <NavLink to="/student-dashboard" label="Student" />
              ) : null}
            </div>
          </div>

          {/* Auth Section - Right */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {currentUser ? (
              <div className="relative" id="user-menu-dropdown">
                <button
                  onClick={toggleUserMenuDropdown}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 theme-transition ${
                    isUserMenuOpen ? "" : ""
                  }`}
                  style={{
                    backgroundColor: isUserMenuOpen
                      ? "var(--theme-tertiary)"
                      : "var(--theme-cardBackground)",
                    color: isUserMenuOpen
                      ? "var(--theme-textAccent)"
                      : "var(--theme-textPrimary)",
                    borderColor: "var(--theme-border)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isUserMenuOpen) {
                      e.target.style.backgroundColor = "var(--theme-tertiary)";
                      e.target.style.color = "var(--theme-textAccent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUserMenuOpen) {
                      e.target.style.backgroundColor =
                        "var(--theme-cardBackground)";
                      e.target.style.color = "var(--theme-textPrimary)";
                    }
                  }}
                >
                  <div
                    className="text-white p-2 rounded-lg"
                    style={{ background: "var(--theme-gradientPrimary)" }}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {currentUser.name ||
                        currentUser.username ||
                        currentUser.email?.split("@")[0] ||
                        "User"}
                    </div>
                    <div className="text-xs theme-text-secondary">
                      {currentUser.email}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl theme-shadow-xl border z-[110] overflow-hidden theme-backdrop"
                    style={{
                      backgroundColor: "var(--theme-cardBackground)",
                      borderColor: "var(--theme-border)",
                    }}
                  >
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm transition-all duration-300"
                        style={{ color: "var(--theme-textPrimary)" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor =
                            "var(--theme-tertiary)";
                          e.target.style.color = "var(--theme-textAccent)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "var(--theme-textPrimary)";
                        }}
                      >
                        <User
                          className="w-4 h-4 mr-3"
                          style={{ color: "var(--theme-brandPrimary)" }}
                        />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm transition-all duration-300"
                        style={{ color: "var(--theme-error)" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor =
                            "var(--theme-tertiary)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 font-medium rounded-xl transition-all duration-300 theme-text-accent hover:theme-bg-tertiary"
                  style={{ color: "var(--theme-textAccent)" }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--theme-tertiary)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-6 py-2 text-white rounded-xl theme-shadow transition-all duration-300 transform hover:scale-105 font-medium"
                  style={{ background: "var(--theme-gradientPrimary)" }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden mt-4 rounded-2xl theme-shadow-xl border overflow-hidden theme-backdrop"
            style={{
              backgroundColor: "var(--theme-cardBackground)",
              borderColor: "var(--theme-border)",
            }}
          >
            <div className="py-4">
              <div className="space-y-2 px-4">
                <MobileNavLink
                  to="/"
                  label="Home"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Role-based mobile navigation */}
                {currentUser?.role === "student" ? (
                  <MobileNavLink
                    to="/student-dashboard"
                    label="Dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ) : currentUser?.role === "teacher" ||
                  currentUser?.role === "instructor" ? (
                  <>
                    <MobileNavLink
                      to="/dashboard"
                      label="Dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Mobile Create Exam Section - Teachers only */}
                    <div className="py-2">
                      <div
                        className="font-medium mb-3 px-2 theme-text-primary"
                        style={{ color: "var(--theme-textPrimary)" }}
                      >
                        Create Exams
                      </div>
                      <div className="ml-4 space-y-2">
                        <MobileNavLink
                          to="/create"
                          label="Custom Exam"
                          onClick={() => setIsMobileMenuOpen(false)}
                          icon={<GraduationCap className="w-4 h-4" />}
                        />
                        <MobileNavLink
                          to="/create/full"
                          label="Full Exam"
                          onClick={() => setIsMobileMenuOpen(false)}
                          icon={<BookOpen className="w-4 h-4" />}
                        />
                      </div>
                    </div>

                    <MobileNavLink
                      to="/grades"
                      label="Analytics"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<BarChart3 className="w-4 h-4" />}
                    />
                  </>
                ) : (
                  // Show general navigation for non-authenticated users
                  !currentUser && (
                    <MobileNavLink
                      to="/login"
                      label="Get Started"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )
                )}
              </div>

              <div
                className="border-t mt-4 pt-4 px-4"
                style={{ borderColor: "var(--theme-border)" }}
              >
                {/* Theme Switcher for Mobile */}
                <div className="mb-4">
                  <ThemeSwitcher />
                </div>

                {currentUser ? (
                  <div className="space-y-2">
                    <div className="px-2 py-2">
                      <div
                        className="font-medium theme-text-primary"
                        style={{ color: "var(--theme-textPrimary)" }}
                      >
                        {currentUser.name ||
                          currentUser.username ||
                          currentUser.email?.split("@")[0] ||
                          "User"}
                      </div>
                      <div
                        className="text-sm theme-text-secondary"
                        style={{ color: "var(--theme-textSecondary)" }}
                      >
                        {currentUser.email}
                      </div>
                    </div>
                    <MobileNavLink
                      to="/profile"
                      label="Profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<User className="w-4 h-4" />}
                    />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-2 py-3 rounded-xl font-medium transition-all duration-300"
                      style={{
                        color: "var(--theme-error)",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor =
                          "var(--theme-tertiary)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <MobileNavLink
                      to="/login"
                      label="Sign In"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<LogIn className="w-4 h-4" />}
                    />
                    <MobileNavLink
                      to="/register"
                      label="Get Started"
                      onClick={() => setIsMobileMenuOpen(false)}
                      icon={<UserPlus className="w-4 h-4" />}
                      isButton
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLink = ({ to, label, icon, activePaths = [] }) => {
  const location = useLocation();

  const isActive =
    location.pathname === to ||
    activePaths.some((path) => location.pathname.startsWith(path));

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 theme-transition ${
        isActive ? "" : ""
      }`}
      style={{
        backgroundColor: isActive ? "var(--theme-tertiary)" : "transparent",
        color: isActive
          ? "var(--theme-textAccent)"
          : "var(--theme-textSecondary)",
        boxShadow: isActive ? "var(--theme-shadow)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.color = "var(--theme-textAccent)";
          e.target.style.backgroundColor = "var(--theme-tertiary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.color = "var(--theme-textSecondary)";
          e.target.style.backgroundColor = "transparent";
        }
      }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick, icon, isButton = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-2 py-3 rounded-xl font-medium transition-all duration-300 theme-transition ${
        isButton ? "text-white theme-shadow" : ""
      }`}
      style={{
        background: isButton
          ? "var(--theme-gradientPrimary)"
          : isActive
          ? "var(--theme-tertiary)"
          : "transparent",
        color: isButton
          ? "#ffffff"
          : isActive
          ? "var(--theme-textAccent)"
          : "var(--theme-textPrimary)",
      }}
      onMouseEnter={(e) => {
        if (!isButton && !isActive) {
          e.target.style.backgroundColor = "var(--theme-tertiary)";
          e.target.style.color = "var(--theme-textAccent)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isButton && !isActive) {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "var(--theme-textPrimary)";
        }
      }}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </Link>
  );
};
