/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "orange": "#FE7F00",
      "orange-hover": "#E6700F",
      "dark-blue": "#142E50",
      "dark-blue-hover": "#1E4475",
      "solid-white": "#FFF",
      button: {
        DEFAULT: "#142E50",
        hover: "#1E4475",
      },
      background: {
        light: "#FFF",
        dark: "#0A2638",
      },
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      bebas: ["Bebas Neue", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
}