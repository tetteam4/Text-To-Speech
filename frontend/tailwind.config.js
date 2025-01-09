// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9A4DFF", // Example purple
        secondary: "#6B7280", // Example gray
        neutral: {
          100: "#f3f4f6", // Example light gray for background
          200: "#e5e7eb",
          300: "#d1d5db",
        },
        "light-grey": "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example font
      },
    },
  },
  plugins: [],
};
