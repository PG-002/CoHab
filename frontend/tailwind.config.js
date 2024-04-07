/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aquamarine: {
          50: "#e9fff6",
          100: "#caffe6",
          200: "#9affd4",
          300: "#5bfbc0",
          400: "#1aeda6",
          500: "#00d590",
          600: "#00ae77",
          700: "#008b63",
          800: "#006e4f",
          900: "#005a44",
          950: "#003327",
        },
        eucalyptus: {
          50: "#edfcf4",
          100: "#d3f8e3",
          200: "#abefcc",
          300: "#74e1b0",
          400: "#3ccb8f",
          500: "#18b176",
          600: "#0c8d5e",
          700: "#0a724f",
          800: "#0a5b40",
          900: "#0a4a36",
          950: "#042a1f",
        },
      },
    },
  },
  plugins: [],
};
