const defaultTheme = require("tailwindcss/defaultTheme");
const flowbite = require("flowbite-react/tailwind");


module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#6C6FD7",
        primary_hover: "#3F43CA"
      },
    },
  },
  plugins: [flowbite.plugin()],
};
