import { useState, useEffect, useRef } from "react";
import {
  Scan,
  BrainCircuit,
  WandSparkles,
  Trophy,
  Zap,
  ArrowRight,
} from "lucide-react";

const SALMAUniqueSection = () => {
  const [visibleElements, setVisibleElements] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisibleElements(["title"]), 100);
          setTimeout(
            () => setVisibleElements((prev) => [...prev, "subtitle"]),
            300
          );
          setTimeout(
            () => setVisibleElements((prev) => [...prev, "feature-0"]),
            500
          );
          setTimeout(
            () => setVisibleElements((prev) => [...prev, "feature-1"]),
            700
          );
          setTimeout(
            () => setVisibleElements((prev) => [...prev, "feature-2"]),
            900
          );
          setTimeout(
            () => setVisibleElements((prev) => [...prev, "highlight"]),
            1100
          );
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

  const features = [
    {
      icon: <Scan className="w-16 h-16" />,
      title: "Advanced OCR",
      subtitle: "Arabic & English Recognition",
      description:
        "Our intelligent OCR system accurately processes exam papers in both Arabic and English, recognizing handwritten and printed text with high precision.",
      color: "sky-500",
      bgGradient: "from-sky-400 to-blue-500",
      accentColor: "bg-sky-100",
      number: "01",
    },
    {
      icon: <BrainCircuit className="w-16 h-16" />,
      title: "Multi-Agent AI",
      subtitle: "Collaborative Grading",
      description:
        "Multiple AI agents collaborate to evaluate answers, providing human-like grading accuracy and detailed feedback for every student submission.",
      color: "indigo-500",
      bgGradient: "from-indigo-400 to-purple-500",
      accentColor: "bg-indigo-100",
      number: "02",
    },
    {
      icon: <WandSparkles className="w-16 h-16" />,
      title: "Dynamic Generation",
      subtitle: "Customized Assessments",
      description:
        "Create customized, varied tests tailored to specific learning objectives, ensuring each student faces unique challenges adapted to their educational needs.",
      color: "emerald-500",
      bgGradient: "from-emerald-400 to-teal-500",
      accentColor: "bg-emerald-100",
      number: "03",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="py-24 relative overflow-hidden theme-transition"
      style={{
        background: "var(--theme-gradientSecondary)",
        color: "var(--theme-textPrimary)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-20 left-10 w-40 h-40 rounded-full animate-pulse"
          style={{ background: "var(--theme-gradientPrimary)" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-60 h-60 rounded-full animate-pulse"
          style={{
            background: "var(--theme-gradientAccent)",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full animate-pulse"
          style={{
            background: "var(--theme-gradientPrimary)",
            animationDelay: "4s",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 transform ${
              visibleElements.includes("title")
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{
                fontFamily: "Patrick Hand, cursive",
                color: "var(--theme-brandPrimary)",
              }}
            >
              What Makes IES Unique?
            </h2>
          </div>
          <div
            className={`transition-all duration-1000 transform ${
              visibleElements.includes("subtitle")
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <p
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{
                fontFamily: "Patrick Hand, cursive",
                color: "var(--theme-textSecondary)",
              }}
            >
              Combining cutting-edge AI with automation to revolutionize
              educational assessment
            </p>
          </div>
        </div>

        {/* Features Section - Zigzag Layout */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 transform ${
                visibleElements.includes(`feature-${index}`)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${(index + 2) * 200}ms` }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:grid-flow-col-dense" : ""
                }`}
              >
                {/* Content Side */}
                <div
                  className={`space-y-6 ${
                    index % 2 === 1 ? "md:col-start-2" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span
                      className="text-6xl font-bold opacity-20"
                      style={{ color: "var(--theme-brandPrimary)" }}
                    >
                      {feature.number}
                    </span>
                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ color: "var(--theme-textPrimary)" }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-lg font-medium uppercase tracking-wide"
                        style={{ color: "var(--theme-brandPrimary)" }}
                      >
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>

                  <p
                    className="text-lg leading-relaxed"
                    style={{ color: "var(--theme-textSecondary)" }}
                  >
                    {feature.description}
                  </p>

                  <div
                    className="flex items-center space-x-2 cursor-pointer group transition-colors"
                    style={{ color: "var(--theme-textTertiary)" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--theme-textSecondary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--theme-textTertiary)";
                    }}
                  >
                    <span className="text-sm uppercase tracking-wide font-medium">
                      Learn More
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Visual Side */}
                <div
                  className={`relative ${
                    index % 2 === 1 ? "md:col-start-1" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl transform transition-all duration-500 ${
                      hoveredFeature === index
                        ? "scale-105 rotate-1"
                        : "scale-100 rotate-0"
                    }`}
                  >
                    {/* Main visual container */}
                    <div
                      className="relative min-h-[300px] flex items-center justify-center p-12"
                      style={{ background: "var(--theme-gradientPrimary)" }}
                    >
                      {/* Animated background pattern */}
                      <div className="absolute inset-0">
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white opacity-20 animate-ping"></div>
                        <div
                          className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-white opacity-10 animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <div
                          className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full bg-white opacity-15 animate-pulse"
                          style={{ animationDelay: "2s" }}
                        ></div>
                      </div>

                      {/* Icon container */}
                      <div
                        className={`relative z-10 transform transition-all duration-500 ${
                          hoveredFeature === index
                            ? "scale-110 rotate-12"
                            : "scale-100 rotate-0"
                        }`}
                      >
                        <div
                          className="p-6 rounded-2xl theme-shadow-2xl"
                          style={{
                            backgroundColor: "var(--theme-primary)",
                            color: "var(--theme-textPrimary)",
                          }}
                        >
                          {feature.icon}
                        </div>
                      </div>

                      {/* Floating elements */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          hoveredFeature === index ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-white animate-bounce"></div>
                        <div
                          className="absolute bottom-8 right-8 w-4 h-4 rounded-full bg-white animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                          className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white animate-bounce"
                          style={{ animationDelay: "1s" }}
                        ></div>
                      </div>
                    </div>

                    {/* Bottom accent bar */}
                    <div
                      className="h-2"
                      style={{ background: "var(--theme-gradientPrimary)" }}
                    ></div>
                  </div>

                  {/* Decorative side element */}
                  <div
                    className={`absolute -z-10 top-4 ${
                      index % 2 === 0 ? "-right-4" : "-left-4"
                    } w-full h-full rounded-3xl opacity-30`}
                    style={{ backgroundColor: "var(--theme-tertiary)" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Highlight Section */}
        <div
          className={`mt-20 text-center transition-all duration-1000 transform ${
            visibleElements.includes("highlight")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "1300ms" }}
        >
          <div
            className="p-8 rounded-3xl border theme-shadow-lg max-w-4xl mx-auto theme-backdrop"
            style={{
              backgroundColor: "var(--theme-cardBackground)",
              borderColor: "var(--theme-border)",
            }}
          >
            <div className="flex items-center justify-center space-x-6">
              <div
                className="p-4 rounded-2xl"
                style={{ background: "var(--theme-gradientAccent)" }}
              >
                <Trophy className="text-white w-12 h-12" />
              </div>
              <div className="text-left">
                <p
                  className="text-2xl font-bold mb-2"
                  style={{ color: "var(--theme-textPrimary)" }}
                >
                  70% Reduction in Grading Time
                </p>
                <p
                  className="text-lg"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  While maintaining superior assessment quality and accuracy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SALMAUniqueSection;
