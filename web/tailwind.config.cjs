/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        personalInsights: 'Montserrat, sans-serif',
      },
      colors: {
        primary: '#166276',
        secondary: '#F1F9FB',
        primaryHover: ' #4DAACB',
        primaryLight: '#c9e4eb',
        warning: '#FF4949',
        white: "#FFFFFF",
        grayLight: "#E4E4E4",
        grayMedium: "#A1ACB2",
        grayDark: "#383838",
        error: "#CF6679",
        success: "#4AA04A",
        disabled: "#E4F2F5",
        star: "#F1CC4F",
        guideYellow: '#FFF3D6',
        warningOrange:'#FA9F47',
        toggleChecked: '#8AB0BA',        
      },
      boxShadow: {
        courseCard: '0px 1px 4px 0px rgba(0, 0, 0, 0.25)', // #00000040 is equivalent to rgba(0, 0, 0, 0.25)
      },
      display: ["group-hover"],
      keyframes: {
        slidePopIn: {
          '0%': { transform: 'scale(0.5) translateX(20rem)' },
          '100%': { transform: 'scale(1) translateX(0)' }
        }
      },
      animation: {
        slidePopIn: 'slidePopIn 350ms cubic-bezier(0.57, 0.22, 0.24, 1.18) forwards',
        'bounce-short': 'bounce 1s ease-in-out 1.5',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("daisyui")
  ],
  
  // TODO: Add educado theme for daisyui?
  daisyui: {
    themes: ["light"],
  },
};

