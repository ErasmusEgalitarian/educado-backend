import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//This component is the "carousel" of text on the Welcome, Login, and Signup pages.

const Carousel: React.FC = () => {
    const { t } = useTranslation();
  
  //Text for the Carousel: both title and body
  const texts = [
    <div key="slide-1" className="p-4 px-8 sm:px-0 sm:max-w-[500px] self-stretch text-center text-sky-50 text-[34px]  font-bold font-['Montserrat']">
      {t("carousel.title1")}
      <div className="mt-4 text-sky-50 text-[18px] font-medium font-['Montserrat'] leading-snug max-w-[450px] mx-auto text-center break-words">
        {t("carousel.section1")}
      </div>
    </div>,

    <div key="slide-2" className="p-4 px-8 sm:px-0 self-stretch text-center text-sky-50 text-[32px] font-bold font-['Montserrat']">
      {t("carousel.title2")}
      <div className="mt-4 self-stretch text-center  text-sky-50 text-lg text-[18px] max-w-[450px] font-bold font-['Montserrat']">
        {t("carousel.section2")}
      </div>
    </div>,

    <div key="slide-3" className="p-4 px-8 sm:px-0 self-stretch text-center text-sky-50 text-[34px] max-w-[520px] font-bold font-['Montserrat']">
      {t("carousel.title3")}
      <div className="mt-4 self-stretch text-center text-sky-50 text-lg text-[18px] max-w-[600px] font-bold font-['Montserrat']">
        {t("carousel.section3")}
      </div>
    </div>,
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  //Functions for changing the text indices
  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    if (currentIndex >= texts.length) {
      setCurrentIndex(0);
    }
  };

  
  //Timer that decides when the text automatically changes
  useEffect(() => {
    const intervalId = setInterval(next, 8000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    //Containters for the texts
    <div className="flex flex-row h-screen relative">
      <div className="flex flex-row">
        

        {/*Inclusion of the text itself*/}
        <div className="flex items-center justify-center">
          <div className="relative w-[600px] h-[400px] py-10">
            {/* The text */}
            <div className="flex items-center justify-center h-full">
              {texts[currentIndex]}
            </div>

            {/* Dots centered at the bottom */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {texts.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all  ${
                    currentIndex === i ? "bg-[#166276]" : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Carousel;
