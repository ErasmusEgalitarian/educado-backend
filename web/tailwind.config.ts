import { ScanSearch } from "lucide-react";

const config = {
  extend: {
    keyframes: {
      shine: {
        "0%": { backgroundPosition: "200% 0" },
        "25%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "-200% 0" },
      },
      gradientFlow: {
        "0%": { "background-position": "0% 50%" },
        "50%": { "background-position": "100% 50%" },
        "100%": { "background-position": "0% 50%" },
      },
    },
    animation: {
      shine: "shine 3s ease-out infinite",
      "gradient-flow": "gradientFlow 10s ease 0s infinite normal none running",
    },

    themes: {
       colors:{
          surface_default: "#35A1B1",
          linear_gradient: {
              start: "#C9E5EC",
              end: "#FFFFFF"
           },
          greyscale_surface_disabled: "#C1CFD7",
          geyscale_surface_subtle: "#FDFEFF",
          greyscale_text_caption: "#628397",
          grayscale_text_title: "28363E",
          surface_subtle: "#FAFEFF",
          surface_default_red: "#D62B25",
          surface_default_green: "#70A31F",
          surface_darker_cyan:"246670",
          border_lighter_cyan: "87CED9",
          surface_lighter_cyan: "D8EFF3",
          surface_subtle_purple: "#E4CCFF",
          surface_subtle_orange: "#FAE0C3",
           
       },

       fontFamily: {
        montserrat: ["Montserrat-Regular"],
        "montserrat-bold": ["Montserrat-Bold"],
        "montserrat-semi-bold": ["Montserrat-SemiBold"],
        lato : ["Lato"]
       } 
    },
    
  },
};
