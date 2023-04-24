/** @type {import('tailwindcss').Config} */
export default {
  content: ["**/*.handlebars", "**/*.html"],
  theme: {
    extend: {
      spacing: {
        nav: "7.5%",
      },
      colors: {
        "snow-1": "#D8DEE9",
        "snow-2": "#E5E9F0",
        "snow-3": "#ECEFF4",
        "gray-1": "#4C566A",
        "gray-2": "#2E3440",
        frost: "#5E81AC",
        polar: "#81A1C1",
      },
    },
  },
  plugins: [],
};
