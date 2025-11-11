import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//This component is the "carousel" of text on the Welcome, Login, and Signup pages.

const Carousel: React.FC = () => {
  //Text for the Carousel: both title and body
  const texts = [
    <div className="p-4 px-8 sm:px-0 self-stretch text-center text-sky-50 text-[32px] font-bold font-['Montserrat']">
      Bem-vindo ao nosso portal de aprendizado Educado
      <div className="self-stretch text-center text-sky-50 text-lg font-bold font-['Montserrat']">
        Junte-se a nós para transformar vidas. Oferecemos acesso a conteúdo
        personalizado para pessoas que precisam, melhorando condições de vida e
        oportunidades de emprego.
      </div>
    </div>,

    <div className="p-4 px-8 sm:px-0 self-stretch text-center text-sky-50 text-[32px] font-bold font-['Montserrat']">
      Seja um criador de conteúdo
      <div className="self-stretch text-center text-sky-50 text-lg font-bold font-['Montserrat']">
        Ajude a promover seu trabalho e alcance um público mais amplo.
        Conecte-se a estudantes voluntários e instituições que desejam
        disseminar informações.
      </div>
    </div>,

    <div className="p-4 px-8 sm:px-0 self-stretch text-center text-sky-50 text-[32px] font-bold font-['Montserrat']">
      Registre-se agora e faça a diferença!
      <div className="self-stretch text-center text-sky-50 text-lg font-bold font-['Montserrat']">
        Seja parte de nossa comunidade que facilita o acesso a conteúdo
        direcionado e formas práticas de compartilhar conhecimento.
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

  const pre = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % texts.length);
    if (currentIndex <= 0) {
      setCurrentIndex(texts.length - 1);
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
        <div className="flex items-center p-1 sm:px-4">
          {/*Button for changing the text to the previous index*/}
          <button onClick={pre}>
            <ChevronLeftIcon className="w-9 h-9 p-1 rounded-full bg-white/80 text-gray-800 hover:bg-white" />
          </button>
        </div>

        {/*Inclusion of the text itself*/}
        <div className="flex items-center">
          <div className="py-10 parent-container relative">
            {texts[currentIndex]}
            <div className="child-container right-0 left-0 justify-center absolute bottom-0">
              {/*Dots indicating the text index*/}
              <div className="flex right-0 left-0 items-center justify-center space-x-2">
                {texts.map((_, i) => (
                  <div
                    key={i}
                    className={`
              transition-all w-3 h-3 bg-white rounded-full
              ${currentIndex === i ? "p-2" : "bg-opacity-50"}
            `}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*Button for changing the text to the next index*/}
        <div className="flex items-center p-1 sm:px-4">
          <button onClick={next}>
            <ChevronRightIcon className="items-center w-9 h-9 p-1 rounded-full bg-white/80 text-gray-800 hover:bg-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
