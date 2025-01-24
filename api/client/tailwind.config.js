const flowbite = require("flowbite-react/tailwind");
// const srollbar=require('tailwind-scrollbar')
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        primary: "#9A4DFF", // Example purple
        secondary: "#6B7280",
        fave: "#09b4f0", // Example gray
        neutral: {
          100: "#f3f4f6", // Eample light gray for background
          200: "#e5e7eb",
          300: "#d1d5db",
        },
        // "light-grey": "#f9f9f9",
      },
    },
    fontFamily: {
      abc: ["Noto Nastaliq Urdu", "serif"],
      me: ["Amir", "serif"],
    },
  },
  plugins: [
    flowbite.plugin(),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],
}; 