import { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Users,
  Sparkles,
  Zap,
  Brain,
  Eye,
  FileText,
  BarChart3,
} from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const AnimatedHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { currentTheme } = useTheme();

  const scrollToFeatures = () => {
    // Method 1: Using an event
    const event = new CustomEvent("scrollToFeatures");
    window.dispatchEvent(event);
  };

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate feature highlights
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered",
      description: "Smart question generation",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "OCR Recognition",
      description: "Arabic & English text",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Agent",
      description: "Collaborative grading",
      color: "from-blue-600 to-blue-700",
    },
  ];

  const floatingCards = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Smart Exams",
      delay: "0s",
      position: "top-20 left-10",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      delay: "1s",
      position: "top-40 right-20",
    },
    {
      icon: <Check className="w-5 h-5" />,
      label: "Auto Grade",
      delay: "2s",
      position: "bottom-32 left-20",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Question Bank",
      delay: "0.5s",
      position: "bottom-20 right-10",
    },
  ];

  return (
    <div
      className="relative overflow-hidden min-h-screen pt-11 theme-transition"
      style={{
        background:
          currentTheme === "light"
            ? "linear-gradient(to bottom, #e0f2fe, #e3f2fd, #ffffff)"
            : "var(--theme-gradientSecondary)",
        color: "var(--theme-textPrimary)",
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      {floatingCards.map((card, index) => (
        <div
          key={index}
          className={`absolute ${card.position} opacity-80 animate-pulse hidden md:block`}
          style={{ animationDelay: card.delay, animationDuration: "4s" }}
        >
          <div
            className="rounded-2xl p-4 theme-shadow-lg border theme-backdrop hover:scale-110 transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-cardBackground)",
              borderColor: "var(--theme-border)",
            }}
          >
            <div className="flex items-center space-x-2">
              <div style={{ color: "var(--theme-brandPrimary)" }}>
                {card.icon}
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--theme-textPrimary)" }}
              >
                {card.label}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Logo/Brand Animation */}
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-10 opacity-0"
            }`}
          >
            <div className="relative">
              <div
                className="inline-block px-6 py-3 rounded-full mb-6 theme-backdrop border theme-shadow"
                style={{
                  backgroundColor: "var(--theme-cardBackground)",
                  borderColor: "var(--theme-border)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <Sparkles
                    className="w-6 h-6 animate-spin"
                    style={{
                      animationDuration: "3s",
                      color: "var(--theme-brandPrimary)",
                    }}
                  />
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--theme-brandPrimary)" }}
                  >
                    IES
                  </span>
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--theme-brandPrimary)" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div
            className={`transition-all duration-1000 delay-200 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto"
              style={{
                fontFamily: "Patrick Hand, cursive",
                color: "var(--theme-textPrimary)",
              }}
            >
              Intelligent Examination 
              <br />
               Automated Evaluation 
              <br />
               System
            </h1>
          </div>

          {/* Dynamic Feature Showcase */}
          <div
            className={`transition-all duration-1000 delay-400 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-center space-x-8 md:space-x-12">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-500 transform ${
                      currentFeature === index
                        ? "scale-110"
                        : "scale-90 opacity-60"
                    }`}
                  >
                    <div
                      className="p-4 rounded-2xl theme-shadow-lg text-white"
                      style={{ background: "var(--theme-gradientPrimary)" }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {feature.icon}
                        <div className="text-center">
                          <div className="font-bold text-sm">
                            {feature.title}
                          </div>
                          <div className="text-xs opacity-90">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div
            className={`transition-all duration-1000 delay-600 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
              style={{
                fontFamily: "Patrick Hand, cursive",
                color: "var(--theme-textSecondary)",
              }}
            >
              Revolutionize exam{" "}
              <span
                className="px-3 py-1 rounded-lg font-semibold theme-shadow text-white"
                style={{ background: "var(--theme-gradientPrimary)" }}
              >
                Generation
              </span>{" "}
              and{" "}
              <span
                className="px-3 py-1 rounded-lg font-semibold theme-shadow text-white"
                style={{ background: "var(--theme-gradientPrimary)" }}
              >
                Evaluation
              </span>{" "}
              with AI-powered automation that saves educators 70% of their time
            </p>
          </div>

          {/* Interactive Stats Cards */}
          <div
            className={`transition-all duration-1000 delay-800 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  number: "70%",
                  label: "Time Saved",
                  icon: <Zap className="w-5 h-5" />,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  number: "95%",
                  label: "OCR Accuracy",
                  icon: <Eye className="w-5 h-5" />,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  number: "∞",
                  label: "Question Types",
                  icon: <Brain className="w-5 h-5" />,
                  color: "from-blue-500 to-blue-600",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 theme-shadow-lg border theme-backdrop hover:scale-105 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--theme-cardBackground)",
                    borderColor: "var(--theme-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="p-2 rounded-xl text-white"
                      style={{ background: "var(--theme-gradientPrimary)" }}
                    >
                      {stat.icon}
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{
                        background: "var(--theme-gradientPrimary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {stat.number}
                    </div>
                  </div>
                  <div
                    className="font-medium"
                    style={{ color: "var(--theme-textPrimary)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div
            className={`transition-all duration-1000 delay-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group text-white px-8 py-4 rounded-2xl font-semibold theme-shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                style={{ background: "var(--theme-gradientPrimary)" }}
              >
                <span>Start Creating Exams</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToFeatures}
                className="group border-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 theme-backdrop"
                style={{
                  borderColor: "var(--theme-brandPrimary)",
                  color: "var(--theme-brandPrimary)",
                  backgroundColor: "var(--theme-cardBackground)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--theme-gradientPrimary)";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--theme-cardBackground)";
                  e.target.style.color = "var(--theme-brandPrimary)";
                }}
              >
                <span>See How It Works</span>
                <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div
            className={`transition-all duration-1000 delay-1200 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--theme-brandPrimary)" }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  Trusted by educators worldwide
                </span>
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--theme-brandPrimary)" }}
                ></div>
              </div>

              <div className="flex items-center space-x-8 opacity-60">
                {["Arabic", "English", "Multi-Format", "AI-Powered"].map(
                  (feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: "var(--theme-success)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--theme-textSecondary)" }}
                      >
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--theme-primary), transparent)",
        }}
      ></div>
    </div>
  );
};

export default AnimatedHeroSection;
