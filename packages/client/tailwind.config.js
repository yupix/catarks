/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      maxWidth: {
        small: "200px",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/container-queries"),
    require('tailwindcss-animated')
  ],
  daisyui: {
    themes: true
  },
};
