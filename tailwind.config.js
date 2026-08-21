/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        titanium: {
          950: "#07090E",
          900: "#0B0F17",
          850: "#101622",
          800: "#161E2E",
          700: "#222F46",
          600: "#374A6B",
          500: "#5B739C",
          400: "#90A4C4",
          300: "#CBD7EB",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
        cyber: {
          cyan: "#00F0FF",
          blue: "#3B82F6",
          indigo: "#6366F1",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace",
        ],
      },
      borderRadius: {
        none: "0px",
        subtle: "6px",
        soft: "12px",
        card: "16px",
        pill: "9999px",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 240, 255, 0.25)",
        "glow-indigo": "0 0 25px -5px rgba(99, 102, 241, 0.35)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};
