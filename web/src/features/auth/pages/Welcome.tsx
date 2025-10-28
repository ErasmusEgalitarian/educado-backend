import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


import background from "@/shared/assets/background.jpg";

import MiniNavbar from "../../../shared/components/MiniNavbar";
import Carousel from "../../../unplaced/archive/carousel";


const Welcome = () => {
  const { t } = useTranslation();

  const texts = [
    <div key="title" className="p-4 px-8 sm:px-0 sm:max-w-[500px] self-stretch text-center text-[#383838] text-[34px]  font-bold font-['Montserrat']">
      {t("welcome.title")}
    </div>,

    <div key="subtitle" className="relative sm:max-w-[750px] text-2xl font-['Montserrat'] text-[#A1ACB2] text-center mb-6 mt-4 px-20">
      {t("welcome.subtitle")}
    </div>
    

  ];

  return (
    //background for frame 2332
    <main className="self-stretch flex flex-col items-center justify-center gap-20 overflow-hidden flex-1 rounded-xs bg-linear-to-br from-[#C9E5EC] 0% to-[#FFF] 100%">
      {/* Mini navbar */}
      <MiniNavbar />

      {/*Containers for the overall page*/}
      <body className="w-full h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 m-auto h-screen sm:max-w-956">
          <div className="relative w-full h-screen hidden md:block container overflow-hidden">
            <img
              src={background}
              alt="w-169.5"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Carousel /> {/*Carousel Integration*/}
            </div>
          </div>

          {/*Container for right side of the page*/}
          <div className="relative right-0 h-screen flex flex-col justify-center items-center  bg-gradient-to-b from-[#C9E5EC] via-[#FFFFFF] to-[#FFFFFF] w-full">
            <img src="/logo.svg" alt="Image" />
            <h1 className="relative text-4xl font-['Lato'] text-[#383838] text-[34px] text-center mb-6 mt-4 font-black px-10">
              {texts[0]}
                {/*Warm welcome to the learning platform*/}
                </h1>
            {texts[1]}
            {/*Sign up now and help promote your work and reach a wider audience through content creation*/}
            {/*Container for the buttons*/}
            <div className="relative flex gap-4 px-35 flex-row items-center justify-center w-full mt-10">            

              {/*Button for routing to the Signup page*/}
              <Link
                className="flex-auto  h-[3.3rem] w-[300px] items-center justify-center rounded-[15px] text-lg font-bold font-['Montserrat'] bg-[#35A1B1] inline-flex text-[#FFFFFF] transform transition duration-100 ease-in hover:bg-cyan-900 hover:text-gray-50"
                  to="/signup">
                <button type="submit">Cadastrar</button>
              </Link>

            </div>
            <div className="relative flex flex-row items-center justify-center  mt-2 text-[#4E6879] font-['Montserrat']">
              <div className="text-lg">{t("welcome.login-text")}</div>
              <Link
                className="h-[3.3rem] w-[80px] flex items-center justify-center rounded-[15px] text-lg underline font-bold text-[#4E6879] transition duration-100 ease-in hover:text-blue-900"
                to="/login"
              >
                Entrar
              </Link>
            </div>

          </div>
        </div>
      </body> 
    </main>
  );
};

export default Welcome;
