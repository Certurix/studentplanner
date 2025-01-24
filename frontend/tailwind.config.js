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
      animation:{
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
    },
    keyframes: {
        'shake' : {
            '10%, 90%': {
                transform: 'translate3d(-1px, 0, 0)'
            },
            '20%, 80%' : {
                transform: 'translate3d(2px, 0, 0)'
            },
            '30%, 50%, 70%': {
                transform: 'translate3d(-4px, 0, 0)'
            },
            '40%, 60%': {
                transform: 'translate3d(4px, 0, 0)'
            }
        }
    }
    },
  },
  plugins: [flowbite.plugin()],
};
