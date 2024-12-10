/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FE7F00",
        primary_hover: "#E6700F",
        second: "#142E50",
        "dark-blue-hover": "#1E4475",
        "solid-white": "#FFF",
        "light-gray": "#ECECEC",
        test: "#FFB8B7",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
}