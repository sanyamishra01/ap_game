/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        atrio: {
          primary: "#4FA3AF",
          dark: "#3A8E9B",
          light: "#8ED0DA",
          muted: "#CFE8EC",
        },
      },
    },
  },

  plugins: [],
};
