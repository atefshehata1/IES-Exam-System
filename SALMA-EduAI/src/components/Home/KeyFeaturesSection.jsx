import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  LayoutGrid,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const KeyFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Set up event listener for the custom event
    const handleScrollToFeatures = () => {
      document
        .getElementById("features")
        .scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("scrollToFeatures", handleScrollToFeatures);

    return () => {
      window.removeEventListener("scrollToFeatures", handleScrollToFeatures);
    };
  }, []);

  // Features data
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Smart Exam Creation",
      description:
        "Create professional exams with our intuitive tools and templates. Generate custom questions based on your course materials instantly.",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      iconBg: "bg-blue-100",
      benefits: [
        "30% faster exam creation",
        "Customizable templates",
        "Question variety",
      ],
      stats: { value: "30%", label: "Faster Creation" },
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Automated Grading",
      description:
        "Save time with our automated grading system and instant feedback. Our AI recognizes and evaluates both multiple choice and written answers.",
      gradient: "from-purple-400 via-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      iconBg: "bg-purple-100",
      benefits: [
        "90% reduction in grading time",
        "Detailed feedback generation",
        "Bias reduction",
      ],
      stats: { value: "70%", label: "Time Saved" },
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Detailed Analytics",
      description:
        "Get comprehensive insights into student performance and trends. Identify knowledge gaps and adjust your teaching strategies accordingly.",
      gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      benefits: [
        "Performance tracking",
        "Visual data reports",
        "Personalized insights",
      ],
      stats: { value: "100%", label: "Visibility" },
    },
    {
      icon: <LayoutGrid className="w-8 h-8" />,
      title: "Question Bank",
      description:
        "Build a comprehensive question bank organized by topics, difficulty levels, and question types for quick exam assembly.",
      gradient: "from-amber-400 via-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      iconBg: "bg-amber-100",
      benefits: [
        "Centralized repository",
        "Easy categorization",
        "Content reusability",
      ],
      stats: { value: "∞", label: "Questions" },
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Digital Assessment",
      description:
        "Move beyond paper with digital assessments that support various question formats and media integration.",
      gradient: "from-rose-400 via-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      iconBg: "bg-rose-100",
      benefits: [
        "Eco-friendly solution",
        "Rich media support",
        "Immediate delivery",
      ],
      stats: { value: "0", label: "Paper Waste" },
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Learning Insights",
      description:
        "Transform assessment data into actionable learning insights with our powerful analytics engine.",
      gradient: "from-cyan-400 via-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
      benefits: [
        "Learning gap analysis",
        "Progress monitoring",
        "Adaptive recommendations",
      ],
      stats: { value: "AI", label: "Powered" },
    },
  ];

  // Auto-rotate features
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length, isVisible]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const scrollToFeature = (direction) => {
    if (direction === "next") {
      setActiveFeature((prev) => (prev + 1) % features.length);
    } else {
      setActiveFeature(
        (prev) => (prev - 1 + features.length) % features.length
      );
    }
  };

  const scrollToCard = (index) => {
    setActiveFeature(index);
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Approximate card width
      const scrollPosition = index * (cardWidth + 24); // 24px gap
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={sectionRef}
      id="features"
      className="py-24 overflow-hidden relative theme-transition"
      style={{
        background: "var(--theme-gradientSecondary)",
        color: "var(--theme-textPrimary)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-20 left-20 w-32 h-32 rounded-full animate-pulse"
          style={{ background: "var(--theme-gradientPrimary)" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 rounded-full animate-pulse"
          style={{
            background: "var(--theme-gradientAccent)",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full animate-pulse"
          style={{
            background: "var(--theme-gradientPrimary)",
            animationDelay: "4s",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles
              className="w-8 h-8 mr-3"
              style={{ color: "var(--theme-brandSecondary)" }}
            />
            <h2
              className="text-5xl md:text-6xl font-bold"
              style={{
                fontFamily: "Patrick Hand, cursive",
                color: "var(--theme-brandPrimary)",
              }}
            >
              Key Features
            </h2>
            <Sparkles
              className="w-8 h-8 ml-3"
              style={{ color: "var(--theme-brandTertiary)" }}
            />
          </div>
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{
              fontFamily: "Patrick Hand, cursive",
              color: "var(--theme-textSecondary)",
            }}
          >
            Discover how IES transforms the assessment process from start to
            finish
          </p>
        </div>

        {/* Main Feature Showcase */}
        <div
          className={`mb-16 transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div
            className="relative rounded-3xl theme-shadow-2xl overflow-hidden border theme-backdrop"
            style={{
              backgroundColor: "var(--theme-cardBackground)",
              borderColor: "var(--theme-border)",
            }}
          >
            {/* Feature Navigation */}
            <div className="absolute top-6 right-6 z-20 flex space-x-2">
              <button
                onClick={() => scrollToFeature("prev")}
                className="p-2 rounded-full theme-shadow-lg hover:scale-110 transition-all group theme-backdrop"
                style={{
                  backgroundColor: "var(--theme-cardBackground)",
                  color: "var(--theme-textSecondary)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--theme-textPrimary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "var(--theme-textSecondary)";
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToFeature("next")}
                className="p-2 rounded-full theme-shadow-lg hover:scale-110 transition-all group theme-backdrop"
                style={{
                  backgroundColor: "var(--theme-cardBackground)",
                  color: "var(--theme-textSecondary)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--theme-textPrimary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "var(--theme-textSecondary)";
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Main Feature Display */}
            <div className="relative h-96 md:h-80">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    activeFeature === index
                      ? "opacity-100 translate-x-0"
                      : index < activeFeature
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <div
                    className="h-full flex items-center relative overflow-hidden"
                    style={{ background: "var(--theme-gradientPrimary)" }}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white animate-ping"></div>
                      <div
                        className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-white animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>
                      <div
                        className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-white animate-pulse"
                        style={{ animationDelay: "2s" }}
                      ></div>
                    </div>

                    <div className="container mx-auto px-8 flex items-center">
                      <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                        {/* Content */}
                        <div className="text-white">
                          <div className="flex items-center mb-6">
                            <div className="bg-white bg-opacity-20 p-4 rounded-2xl mr-4">
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                                {feature.title}
                              </h3>
                              <div className="flex items-center space-x-4">
                                <span className="text-2xl font-bold">
                                  {feature.stats.value}
                                </span>
                                <span className="text-lg opacity-90">
                                  {feature.stats.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-lg md:text-xl leading-relaxed mb-6 opacity-95">
                            {feature.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {feature.benefits.map((benefit, i) => (
                              <div
                                key={i}
                                className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium"
                              >
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Visual Element */}
                        <div className="hidden md:flex justify-center">
                          <div className="relative">
                            <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center theme-shadow-2xl">
                                <div
                                  className="text-6xl"
                                  style={{ color: "var(--theme-brandPrimary)" }}
                                >
                                  {feature.icon}
                                </div>
                              </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full animate-bounce"></div>
                            <div
                              className="absolute -bottom-4 -left-4 w-6 h-6 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.5s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards Carousel */}
        <div
          className={`transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-300 transform ${
                    activeFeature === index
                      ? "scale-105"
                      : hoveredCard === index
                      ? "scale-102"
                      : "scale-100"
                  }`}
                  onClick={() => scrollToCard(index)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`rounded-2xl p-6 h-full border-2 transition-all duration-300 theme-shadow-md hover:theme-shadow-lg theme-backdrop ${
                      activeFeature === index
                        ? "border-current theme-shadow-xl"
                        : "border-transparent"
                    }`}
                    style={{
                      backgroundColor: "var(--theme-cardBackground)",
                      borderColor:
                        activeFeature === index
                          ? "var(--theme-brandPrimary)"
                          : "transparent",
                      color:
                        activeFeature === index
                          ? "var(--theme-brandPrimary)"
                          : "var(--theme-textPrimary)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor:
                          activeFeature === index
                            ? "var(--theme-tertiary)"
                            : "var(--theme-secondary)",
                        color: "var(--theme-brandPrimary)",
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h4
                      className="text-lg font-bold mb-2"
                      style={{ color: "var(--theme-textPrimary)" }}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className="text-sm line-clamp-3"
                      style={{ color: "var(--theme-textSecondary)" }}
                    >
                      {feature.description}
                    </p>

                    {/* Progress indicator */}
                    {activeFeature === index && (
                      <div className="mt-4">
                        <div
                          className="w-full rounded-full h-1"
                          style={{ backgroundColor: "var(--theme-border)" }}
                        >
                          <div
                            className="h-1 rounded-full animate-pulse"
                            style={{
                              width: "100%",
                              background: "var(--theme-gradientPrimary)",
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {features.map((feature, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeFeature === index ? "scale-125" : ""
              }`}
              style={{
                backgroundColor:
                  activeFeature === index
                    ? "var(--theme-brandPrimary)"
                    : "var(--theme-border)",
                background:
                  activeFeature === index
                    ? "var(--theme-gradientPrimary)"
                    : "var(--theme-border)",
              }}
              onClick={() => scrollToCard(index)}
              aria-label={`View ${feature.title}`}
              onMouseEnter={(e) => {
                if (activeFeature !== index) {
                  e.target.style.backgroundColor = "var(--theme-textTertiary)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFeature !== index) {
                  e.target.style.backgroundColor = "var(--theme-border)";
                }
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default KeyFeaturesSection;
