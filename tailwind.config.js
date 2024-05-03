/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
    },
    extend: {
      colors: {
        componentColor: "#44444475",
        primaryColor: "#FF1111", //The layer color
        primaryColorLight: "#7091e611",
        secondaryColor: "#000000", //background color
        paragraphColor: "#eeeeee",
        whiteColor: "#ede8f5",
      },
      boxShadow: {
        glow: "0 35px 60px -15px rgba(255, 255, 255, 0.3)",
      },
      dropShadow: {
        glow: "0 25px 25px rgba(171, 171, 171, 0.3)",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
      },
    },
  },
  plugins: [],
};
