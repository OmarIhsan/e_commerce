/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",
        slate: "#2A2E35",
        ash: "#6B7280",
        mist: "#E5E7EB",
        paper: "#FFFFFF",
        gold: "#C8A200",
        coral: "#F87171",
        evergreen: "#0EA5E9",
        indigo: "#6366F1",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6"
      },
      borderRadius: {
        none: "0px",
        subtle: "6px",
        soft: "12px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
