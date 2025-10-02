import { Link } from "react-router-dom";

import background from "@/shared/assets/background.jpg";

import MiniNavbar from "../../../shared/components/MiniNavbar";
import Carousel from "../../../unplaced/archive/Carousel";

const Welcome = () => {
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
          <div className="relative right-0 h-screen flex flex-col justify-center items-center">
            <h1 className="relative text-4xl font-['Lato'] text-[#383838] text-center mb-6 mt-4 font-black px-10">
              Boas vindas à plataforma de aprendizagem!
            </h1>{" "}
            {/*Warm welcome to the learning platform*/}
            <h1 className="relative text-2xl font-['Montserrat'] text-[#A1ACB2] text-center mb-6 mt-4 px-20">
              Cadastre-se agora e ajude a promover seu trabalho e atingir um
              público mais amplo por meio da criação de conteúdo.
            </h1>{" "}
            {/*Sign up now and help promote your work and reach a wider audience through content creation*/}
            {/*Container for the buttons*/}
            <div className="relative flex gap-4 px-20 flex-row items-center justify-center w-full mt-10">
              {/*Button for routing to the Login page*/}
              <Link
                className="flex-auto w-[18rem] h-[3.3rem] items-center justify-center rounded-lg text-lg font-bold font-['Montserrat'] bg-[#166276] inline-flex text-[#FFFFFF] transform transition duration-100 ease-in hover:bg-cyan-900 hover:text-gray-50"
                to="/login"
              >
                <button type="submit">Entrar</button>
              </Link>

              {/*Button for routing to the Signup page*/}
              <Link
                className="flex-auto w-[18rem] h-[3.3rem] items-center justify-center rounded-lg text-lg font-bold font-['Montserrat'] bg-[#166276] inline-flex text-[#FFFFFF] transform transition duration-100 ease-in hover:bg-cyan-900 hover:text-gray-50"
                to="/signup"
              >
                <button type="submit">Cadastrar</button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </main>
  );
};

export default Welcome;
