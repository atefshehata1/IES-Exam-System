import { createContext, useContext, useState, useEffect } from "react";

// Theme definitions
const themes = {
  light: {
    name: "Light",
    colors: {
      // Background colors
      primary: "#ffffff",
      secondary: "#f8fafc",
      tertiary: "#f1f5f9",
      surface: "#ffffff",

      // Text colors
      textPrimary: "#1f2937",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      textAccent: "#0ea5e9",

      // Brand colors
      brandPrimary: "#0ea5e9",
      brandSecondary: "#6366f1",
      brandTertiary: "#8b5cf6",

      // Status colors
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",

      // UI elements
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      shadow: "rgba(0, 0, 0, 0.1)",

      // Gradients
      gradientPrimary: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
      gradientSecondary: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
      gradientAccent: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",

      // Card backgrounds
      cardBackground: "rgba(255, 255, 255, 0.8)",
      cardBorder: "#e5e7eb",
    },
  },

  dark: {
    name: "Dark",
    colors: {
      // Background colors
      primary: "#000000", // Main background (pure black)
      secondary: "#111111", // Slightly lighter black for contrast
      tertiary: "#1a1a1a", // For sections/cards

      surface: "#0d0d0d", // Panels, modals, etc.

      // Text colors
      textPrimary: "#F5F5F5", // Main text (light silver)
      textSecondary: "#CCCCCC", // Secondary text
      textTertiary: "#999999", // Subtle/tertiary text
      textAccent: "#FFFFFF", // Accent text (white)

      // Brand colors (neutralized to stay minimal)
      brandPrimary: "#FFFFFF", // Can stay white for pure theme
      brandSecondary: "#CCCCCC",
      brandTertiary: "#999999",

      // Status colors (toned down, or you can remove them if not needed)
      success: "#22c55e",
      warning: "#eab308",
      error: "#ef4444",
      info: "#3b82f6",

      // UI elements
      border: "#1f1f1f",
      borderLight: "#2a2a2a",
      shadow: "rgba(255, 255, 255, 0.05)",

      // Gradients (flat in pure dark)
      gradientPrimary: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
      gradientSecondary: "linear-gradient(135deg, #111111 0%, #000000 100%)",
      gradientAccent: "linear-gradient(135deg, #333333 0%, #111111 100%)",

      // Cards
      cardBackground: "#111111",
      cardBorder: "#1f1f1f",
    },
  },

  darkk: {
    name: "Dark",
    colors: {
      // Background colors
      primary: "#121212",
      secondary: "#1e1e1e",
      tertiary: "#2d2d2d",
      surface: "#1e1e1e",

      // Text colors
      textPrimary: "#e5e7eb",
      textSecondary: "#d1d5db",
      textTertiary: "#9ca3af",
      textAccent: "#60a5fa",

      // Brand colors (keep original for contrast)
      brandPrimary: "#0ea5e9",
      brandSecondary: "#6366f1",
      brandTertiary: "#8b5cf6",

      // Status colors
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",

      // UI elements
      border: "#374151",
      borderLight: "#4b5563",
      shadow: "rgba(0, 0, 0, 0.3)",

      // Gradients
      gradientPrimary: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
      gradientSecondary: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
      gradientAccent: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",

      // Card backgrounds
      cardBackground: "rgba(30, 30, 30, 0.8)",
      cardBorder: "#374151",
    },
  },

  pureBlack: {
    name: "Pure Black",
    colors: {
      // Background colors
      primary: "#000000",
      secondary: "#0a0a0a",
      tertiary: "#1a1a1a",
      surface: "#000000",

      // Text colors
      textPrimary: "#d1d5db",
      textSecondary: "#9ca3af",
      textTertiary: "#6b7280",
      textAccent: "#00bfff", // Electric blue for contrast

      // Brand colors
      brandPrimary: "#00bfff", // Electric blue
      brandSecondary: "#00ff7f", // Neon green
      brandTertiary: "#ff1493", // Deep pink

      // Status colors
      success: "#00ff7f",
      warning: "#ffd700",
      error: "#ff4500",
      info: "#00bfff",

      // UI elements
      border: "#333333",
      borderLight: "#404040",
      shadow: "rgba(0, 0, 0, 0.8)",

      // Gradients
      gradientPrimary: "linear-gradient(135deg, #00bfff 0%, #00ff7f 100%)",
      gradientSecondary: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
      gradientAccent: "linear-gradient(135deg, #00bfff 0%, #ff1493 100%)",

      // Card backgrounds
      cardBackground: "rgba(0, 0, 0, 0.9)",
      cardBorder: "#333333",
    },
  },

  brownLight: {
    name: 'Brown Light',
    colors: {
      // Background colors - kept light but with better separation
      primary: '#FEFDFB',           // Page background (lighter for better contrast)
      secondary: '#F5F3F0',         // Sections (more contrast with primary)
      tertiary: '#EFEAE5',          // Highlights or content blocks
      surface: '#FFFFFF',           // Panels/Modals
      
      // Text colors - significantly darkened for better readability
      textPrimary: '#2D1B0F',       // Main titles (much darker)
      textSecondary: '#3D2417',     // Subtitles (darker)
      textTertiary: '#4A2F1C',      // Muted or helper text (still readable)
      textAccent: '#8B4513',        // Links or emphasis (darker brown)
      
      // Brand colors - adjusted for better contrast
      brandPrimary: '#8B4513',      // Darker for better visibility
      brandSecondary: '#A0522D',    // Sienna brown
      brandTertiary: '#CD853F',     // Peru brown
      
      // Status colors - kept accessible
      success: '#2E7D32',           // Darker green for better contrast
      warning: '#E65100',           // Darker orange
      error: '#C62828',             // Darker red
      info: '#1565C0',              // Darker blue
      
      // UI elements - improved contrast
      border: '#C4B5A0',            // Darker border for better definition
      borderLight: '#D6CFC4',       // Lighter border variant
      shadow: 'rgba(45, 27, 15, 0.12)', // Adjusted shadow color
      
      // Gradients - updated with new colors
      gradientPrimary: 'linear-gradient(135deg, #FEFDFB 0%, #EFEAE5 100%)',
      gradientSecondary: 'linear-gradient(135deg, #FFFFFF 0%, #F5F3F0 100%)',
      gradientAccent: 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)',
      
      // Cards - enhanced contrast
      cardBackground: '#FFFFFF',    // Pure white for maximum contrast
      cardBorder: '#C4B5A0',        // Darker border to define card edges
      
      // Additional colors for better UX
      hover: '#F0EBE6',             // Subtle hover state
      active: '#E8E0D8',            // Active/pressed state
      disabled: '#A69B8E',          // Disabled text color
      placeholder: '#6B5B4F',       // Placeholder text
      
      // Focus states for accessibility
      focusRing: '#8B4513',         // Focus outline color
      focusBackground: '#F7F4F1',   // Focus background
    }
  }
  };


const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("salma-theme");
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    // Apply theme colors to CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${currentTheme}`);

    // Save theme to localStorage
    localStorage.setItem("salma-theme", currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes,
    switchTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
