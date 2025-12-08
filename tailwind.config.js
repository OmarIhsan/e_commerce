/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bi-colored brand palette (primary warm, secondary cool)
        brandA: {
          DEFAULT: "#FF6B6B", // warm coral
          50: "#FFF2F2",
          100: "#FFE6E6",
          200: "#FFCACA",
          300: "#FFAFAF",
          400: "#FF8F8F",
          500: "#FF6B6B",
          600: "#FF4F4F",
          700: "#E63939",
        },
        brandB: {
          DEFAULT: "#3AB0FF", // cool sky
          50: "#F2FBFF",
          100: "#E6F7FF",
          200: "#BFEAFF",
          300: "#99DCFF",
          400: "#66C9FF",
          500: "#3AB0FF",
          600: "#1F9BFF",
          700: "#0B84E6",
        },
        ink: "#0B0B0C",
        slate: "#1F2937",
        ash: "#6B7280",
        mist: "#F3F4F6",
        paper: "#FFFFFF",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
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
