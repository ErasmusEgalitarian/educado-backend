import { Link } from "react-router-dom"
import FrontLogo from "../assets/WelEdnew.png"
import logo from "../assets/logo.png"
import educado from "../assets/educado.png"


const NotFound = () => {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#c8e5ec] to-[white] overflow-hidden">
      <nav className="navbar bg-base-100 border-b shadow fixed top-0 z-10">
        <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-12">
          <div className="navbar-start">
            <Link
              to="/"
              className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl"
            >
              <img src={logo} alt="logo" className="w-[24.43px] h-6" />{" "}
              <img src={educado} alt="educado" className="h-6" />
            </Link>
          </div>
        </div>
      </nav>
      <div className="fixed w-full h-full overflow-hidden">
        <img
          className="absolute w-1/5 left-[40%] top-[30%]"
          src={FrontLogo}
          alt="Front Logo"
        />
        <div className="w-[762px] h-[952px] px-5 rounded-sm flex-col justify-center items-center gap-2 inline-flex">
          <h1 className="w-600px text-neutral-700 text-[55px] font-bold font-['Lato'] translate-x-[370px] translate-y-[-90px]">
            Erro 404! algo deu errado.
          </h1>
        <Link to="/welcome">
          <button
            type="submit"
            className="absolute bottom-60 left-[50%] transform -translate-x-1/2 w-208px h-52px px-28 py-3 rounded-lg justify-center items-start gap-2 inline-flex bg-cyan-300 text-white hover:bg-cyan-500 hover:text-gray-50"
          >
            Voltar à página inicial
          </button>
        </Link>
      </div>
      </div>
    </main>
  );
};



export default NotFound