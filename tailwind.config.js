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
        // primaryColor: "#f7aa1d",
        primaryColor: "red",
        // primaryColorLight: "#1e3133",
        primaryColorLight: "#444444",
        componentColor: "#44444433",
        // secondaryColor: "#00161B",
        // paragraphColor: "#888",
        // whiteColor: "#d3d3d3",
        secondaryColor: "black",
        paragraphColor: "#dddddd",
        whiteColor: "white",
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
