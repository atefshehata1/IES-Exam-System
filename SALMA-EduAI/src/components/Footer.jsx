import { Link, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  ChevronRight,
  MessageSquare,
  BookOpen,
  BarChart2,
  GraduationCap,
  Sparkles,
  Heart,
  Globe,
  Shield,
  Users,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  // Determine the left margin based on the dashboard type
  const getLeftMargin = () => {
    if (location.pathname === "/dashboard") return "ml-80"; // Instructor dashboard (320px)
    if (location.pathname === "/student-dashboard") return "ml-80"; // Student dashboard (320px - now same width)
    return "";
  };

  return (
    <footer
      className={`border-t relative overflow-hidden theme-transition ${getLeftMargin()}`}
      style={{
        background: "var(--theme-gradientSecondary)",
        borderColor: "var(--theme-border)",
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
              id="footer-grid"
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
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center group">
              <div className="relative">
                <div
                  className="text-white p-3 rounded-2xl theme-shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                  style={{ background: "var(--theme-gradientPrimary)" }}
                >
                  <GraduationCap className="w-8 h-8" />
                </div>
                <Sparkles
                  className="absolute -top-1 -right-1 w-5 h-5 animate-pulse"
                  style={{ color: "var(--theme-warning)" }}
                />
              </div>
              <div className="ml-4">
                <span
                  className="text-3xl font-bold"
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
                  className="text-sm font-medium"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  AI Assessment Platform
                </div>
              </div>
            </div>

            <p
              className="leading-relaxed max-w-md"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              Intelligent Examination and Automated Evaluation System.
              Revolutionizing education through intelligent exam creation and
              evaluation.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
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
                  className="text-xs"
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
                  className="text-xs"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  OCR Accuracy
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              <SocialLink
                href="#"
                icon={<Twitter className="w-5 h-5" />}
                label="Twitter"
              />
              <SocialLink
                href="#"
                icon={<Linkedin className="w-5 h-5" />}
                label="LinkedIn"
              />
              <SocialLink
                href="#"
                icon={<Facebook className="w-5 h-5" />}
                label="Facebook"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Platform */}
            <div>
              <h3
                className="text-lg font-bold mb-6 flex items-center"
                style={{ color: "var(--theme-textPrimary)" }}
              >
                <div
                  className="p-2 rounded-lg mr-3 text-white"
                  style={{ background: "var(--theme-gradientPrimary)" }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                Platform
              </h3>
              <ul className="space-y-4">
                <FooterLink
                  to="/"
                  icon={<ChevronRight className="w-4 h-4" />}
                  text="Home"
                />
                <FooterLink
                  to="/create"
                  icon={<GraduationCap className="w-4 h-4" />}
                  text="Create Exam"
                />
                <FooterLink
                  to="/grades"
                  icon={<BarChart2 className="w-4 h-4" />}
                  text="Analytics"
                />
                <FooterLink
                  to="/student"
                  icon={<Users className="w-4 h-4" />}
                  text="Student Portal"
                />
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3
                className="text-lg font-bold mb-6 flex items-center"
                style={{ color: "var(--theme-textPrimary)" }}
              >
                <div
                  className="p-2 rounded-lg mr-3 text-white"
                  style={{ background: "var(--theme-gradientAccent)" }}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>
                Support
              </h3>
              <ul className="space-y-4">
                <FooterLink
                  to="/help"
                  icon={<MessageSquare className="w-4 h-4" />}
                  text="Help Center"
                />
                <FooterLink
                  to="/tutorials"
                  icon={<BookOpen className="w-4 h-4" />}
                  text="Tutorials"
                />
                <FooterLink
                  to="/faq"
                  icon={<ChevronRight className="w-4 h-4" />}
                  text="FAQ"
                />
                <FooterLink
                  to="/contact"
                  icon={<ChevronRight className="w-4 h-4" />}
                  text="Contact Us"
                />
              </ul>
            </div>

            {/* Connect & Legal */}
            <div>
              <h3
                className="text-lg font-bold mb-6 flex items-center"
                style={{ color: "var(--theme-textPrimary)" }}
              >
                <div
                  className="p-2 rounded-lg mr-3 text-white"
                  style={{ background: "var(--theme-gradientPrimary)" }}
                >
                  <Globe className="w-4 h-4" />
                </div>
                Connect
              </h3>
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  <a
                    href="mailto:contact@salma.ai"
                    className="flex items-center transition-all duration-300 group"
                    style={{ color: "var(--theme-textSecondary)" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--theme-brandPrimary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--theme-textSecondary)";
                    }}
                  >
                    <Mail
                      className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform"
                      style={{ color: "var(--theme-brandPrimary)" }}
                    />
                    <span className="text-sm">contact@IES.ai</span>
                  </a>
                  <div
                    className="flex items-center"
                    style={{ color: "var(--theme-textSecondary)" }}
                  >
                    <Phone
                      className="w-4 h-4 mr-3"
                      style={{ color: "var(--theme-brandPrimary)" }}
                    />
                    <span className="text-sm">(555) 123-4567</span>
                  </div>
                </div>

                {/* Quick Legal Links */}
                <div className="pt-2 space-y-2">
                  <FooterLink
                    to="/privacy"
                    icon={<Shield className="w-4 h-4" />}
                    text="Privacy"
                  />
                  <FooterLink
                    to="/terms"
                    icon={<ChevronRight className="w-4 h-4" />}
                    text="Terms"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Enhanced Design */}
        <div
          className="border-t pt-8"
          style={{ borderColor: "var(--theme-border)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright with love */}
            <div
              className="flex items-center text-sm"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              <span>© {currentYear} IES. Made with</span>
              <Heart
                className="w-4 h-4 mx-2 animate-pulse"
                style={{ color: "var(--theme-error)" }}
              />
              <span>for educators worldwide</span>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--theme-success)" }}
                ></div>
                <span style={{ color: "var(--theme-textTertiary)" }}>
                  AI-Powered
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--theme-brandPrimary)" }}
                ></div>
                <span style={{ color: "var(--theme-textTertiary)" }}>
                  Secure
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--theme-brandTertiary)" }}
                ></div>
                <span style={{ color: "var(--theme-textTertiary)" }}>
                  Multi-Language
                </span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="transition-colors"
                style={{ color: "var(--theme-textTertiary)" }}
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--theme-brandPrimary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "var(--theme-textTertiary)";
                }}
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="transition-colors"
                style={{ color: "var(--theme-textTertiary)" }}
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--theme-brandPrimary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "var(--theme-textTertiary)";
                }}
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="transition-colors"
                style={{ color: "var(--theme-textTertiary)" }}
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--theme-brandPrimary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "var(--theme-textTertiary)";
                }}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
        style={{ background: "var(--theme-gradientPrimary)" }}
      ></div>
    </footer>
  );
}

// Enhanced Footer Link Component
const FooterLink = ({ to, icon, text }) => (
  <li className="list-none">
    <Link
      to={to}
      className="flex items-center text-sm transition-all duration-300 group"
      style={{ color: "var(--theme-textSecondary)" }}
      onMouseEnter={(e) => {
        e.target.style.color = "var(--theme-brandPrimary)";
      }}
      onMouseLeave={(e) => {
        e.target.style.color = "var(--theme-textSecondary)";
      }}
    >
      <span
        className="mr-3 group-hover:scale-110 group-hover:text-sky-600 transition-all duration-300"
        style={{ color: "var(--theme-brandPrimary)" }}
      >
        {icon}
      </span>
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {text}
      </span>
    </Link>
  </li>
);

// Social Link Component
const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    className="p-3 rounded-xl theme-shadow-sm transition-all duration-300 hover:scale-110 border group theme-backdrop"
    style={{
      backgroundColor: "var(--theme-cardBackground)",
      borderColor: "var(--theme-border)",
      color: "var(--theme-brandPrimary)",
    }}
    aria-label={label}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.1) rotate(12deg)";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1) rotate(0deg)";
    }}
  >
    <div className="transition-transform duration-300">{icon}</div>
  </a>
);
