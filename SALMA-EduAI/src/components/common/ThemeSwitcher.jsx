import { useState } from "react";
import { Palette, Sun, Moon, Coffee, Zap } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const ThemeSwitcher = () => {
  const { currentTheme, themes, switchTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    pureBlack: <Zap className="w-4 h-4" />,
    brown: <Coffee className="w-4 h-4" />,
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-300 bg-theme-card hover:shadow-md border border-theme-border"
        style={{
          backgroundColor: "var(--theme-cardBackground)",
          borderColor: "var(--theme-border)",
          color: "var(--theme-textPrimary)",
        }}
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border z-[120] overflow-hidden"
          style={{
            backgroundColor: "var(--theme-cardBackground)",
            borderColor: "var(--theme-border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="py-2">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  switchTheme(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-opacity-10 transition-all duration-300 ${
                  currentTheme === key ? "bg-opacity-20" : ""
                }`}
                style={{
                  color: "var(--theme-textPrimary)",
                  backgroundColor:
                    currentTheme === key
                      ? "var(--theme-brandPrimary)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== key) {
                    e.target.style.backgroundColor =
                      "rgba(var(--theme-brandPrimary-rgb), 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== key) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: theme.colors.brandPrimary,
                    color:
                      theme.name === "Light"
                        ? theme.colors.textPrimary
                        : "#ffffff",
                  }}
                >
                  {themeIcons[key]}
                </div>
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div
                    className="text-xs opacity-70"
                    style={{ color: "var(--theme-textSecondary)" }}
                  >
                    {key === "light" && "Clean & bright"}
                    {key === "dark" && "Easy on the eyes"}
                    {key === "pureBlack" && "Maximum contrast"}
                    {key === "brown" && "Warm & cozy"}
                  </div>
                </div>
                {currentTheme === key && (
                  <div className="ml-auto">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--theme-success)" }}
                    ></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[110]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
