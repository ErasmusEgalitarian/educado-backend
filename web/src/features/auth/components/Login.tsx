import { mdiChevronLeft, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import { createContext, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import background from "@/shared/assets/background.jpg";


import GenericModalComponent from "../../../shared/components/GenericModalComponent";
import MiniNavbar from "../../../shared/components/MiniNavbar";
import { useApi } from "../../../shared/hooks/useAPI";
import Carousel from "../../../unplaced/archive/carousel";
import AuthServices from "../../../unplaced/services/auth.services";
import { setUserInfo } from "../lib/userInfo";
import { LoginResponseError } from "../types/LoginResponseError";

import PasswordRecoveryModal from "./password-recovery/PasswordRecoveryModal";

export const ToggleModalContext = createContext(() => {});

// Interface
interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  // Error state
  const [error, setError] = useState<
    LoginResponseError.RootObject | string | null
  >(null); // store http error objects TODO: get the error text from server instead of reponse code
  const [showModal, setShowModal] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Use-form setup
  const { register, handleSubmit } = useForm<Inputs>();
  const [errorMessage, newErrorMessage] = useState("");
  const setErrorMessage = (errMessage: string, error?: string) => {
    setError(error ?? "Erro");
    newErrorMessage(errMessage);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  //Callback
  const { call: login, isLoading: submitLoading } = useApi(
    AuthServices.postUserLogin,
  );

  //Variable determining the error message for both fields.
  const [emailError, setEmailError] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [passwordError, setPasswordError] = useState(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // Location hook and modal state for account application success modal
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * OnSubmit function for Login.
   * Takes the submitted data from the form and sends it to the backend through a service.
   * Upon receiving a success response, the token recieved from the backend will be set in the local storage.
   *
   * @param {JSON} data Which includes the following fields:
   * @param {String} data.email Email of the Content Creator
   * @param {String} data.password Password of the Content Creator (Will be encrypted)
   */
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await login({
      isContentCreator: true,
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        if (res.status == 200) {
          const token = res.data.jwt;
          const user = res.data.user;

          localStorage.setItem("token", token);
          localStorage.setItem("id", user.id);
          setUserInfo(user);
          navigate("/courses");
        }

        // error messages for email and password
      })
      .catch((err) => {
        setError(err);
        console.error(err);
        switch (err.response.data.error.code) {
          case "E0004": //Invalid Email
            setEmailError(err);
            setEmailErrorMessage("Insira um email válido.");
            setPasswordError(null);
            setPasswordErrorMessage("");
            setError("");
            break;

          case "E1001": //User Not Approved
            setEmailError(err);
            setEmailErrorMessage(
              "A conta associada a este e-mail não foi aprovada.",
            );
            setPasswordError(null);
            setPasswordErrorMessage("");
            setError("");
            break;

          case "E1002": //User Rejected
            setEmailError(err);
            setEmailErrorMessage(
              "A conta associada a este e-mail foi rejeitada.",
            );
            setPasswordError(null);
            setPasswordErrorMessage("");
            setError("");
            break;

          case "E0105": //Invalid Password
            setEmailError(null);
            setEmailErrorMessage("");
            setPasswordError(err);
            setPasswordErrorMessage(
              "Senha Incorreta. Por favor, tente novamente.",
            );
            setError("");
            break;

          default:
            console.error(error);
        }
      });
  };

  // Variable determining whether or not the password is visible
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  function areFieldsFilled() {
    const inputloginEmail = document.getElementById(
      "email-field",
    ) as HTMLInputElement;
    const inputloginPass = document.getElementById(
      "password-field",
    ) as HTMLInputElement;

    const submitloginButton = document.getElementById(
      "submit-login-button",
    ) as HTMLButtonElement;

    if (inputloginEmail.value.trim() && inputloginPass.value.trim() !== "") {
      submitloginButton.removeAttribute("disabled");
      submitloginButton.classList.remove("opacity-20", "bg-cyan-500");
    } else {
      submitloginButton.setAttribute("disabled", "true");
      submitloginButton.classList.add("opacity-20", "bg-cyan-500");
    }

    // function to clear error messages once fields are empty
    setEmailError(null);
    setEmailErrorMessage("");
    setPasswordError(null);
    setPasswordErrorMessage("");
  }
  // failure on submit handler FIXME: find out what this does (OLD CODE)
  //const onError: SubmitHandler<Inputs> = error => console.error(error);

  // Account application success modal visibility effect
  useEffect(() => {
    if (location.state?.applicationSubmitted) {
      setIsModalVisible(true);
    }
  }, [location.state]);

  // Function to close the account application success modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <main className="flex bg-linear-to-br from-[#C9E5EC] 0% to-[#FFF] 100%">
      {/* Mini navbar */}
      <MiniNavbar />

      {/*Container for entire page*/}
      <div className="grid grid-cols-1 md:grid-cols-2 m-auto w-full h-screen">
        {/*Container for left half of the page*/}
        <div className="relative w-full h-screen hidden md:block container overflow-hidden">
          <img
            src={background}
            alt="w-169.5"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Carousel /> {/*Carousel integration*/}
          </div>
        </div>

        {/*Container for right side of the page - frame 2332*/}
        <div className="relative right-0 h-screen flex flex-col justify-center items-center">
          {/*Error message for when email or password is incorrect*/}
          <div className="fixed right-0 top-16 z-10">
            {error && (
              <div
                className="bg-white shadow-sm border-t-4 p-4 w-52 rounded-sm text-center animate-bounce-short"
                role="alert"
              >
                <p className="font-bold text-lg">{error.toString()}</p>
                <p id="error-message" className="text-lg">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/*Container for the page's contents, + Back button*/}
          <ToastContainer />
          <div className="relative py-8 px-25 w-full">
            <div className="">
              <h1 className="mb-10 flex text-lg text-[#383838] font-normal font-['Montserrat'] underline px-10">
                <Link to="/welcome">
                  <Icon path={mdiChevronLeft} size={1} color="#383838" />
                </Link>
                <Link to="/welcome" className="text-lg text-[#383838] font-normal font-['Montserrat'] " > 
                <button className="cursor-pointer">
                  Voltar
                  </button> {/*Back*/} 
                </Link>
              </h1>
            </div>

            {/*Title*/}
            <h1 className="text-[#383838] text-3xl font-bold font-['Montserrat'] leading-normal self-stretch mb-10 px-10">
              Bem-vindo(a) de volta! {/*Welcome back to Educado!*/}
            </h1>

            {/*Submit form, i.e. fields to write email and password*/}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="stretch flex flex-col space-y-2"
            >
              {/* Email field */}
              <div>
                <div className="relative px-10 pb-8">
                  <label
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 text-[#383838] text-[18px] text-sm font-bold font-['Montserrat'] mt-6"
                    htmlFor="email-field"
                  >
                    Email
                  </label>
                  <input
                    onInput={areFieldsFilled}
                    type="email"
                    id="email-field"
                    className="flex border-gray-300 w-full py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-hidden focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
                    placeholder="usuario@gmail.com"
                    {...register("email", { required: true })}
                  />

                  {emailError && (
                    <div
                      className="flex items-center font-normal font-['Montserrat']"
                      role="alert"
                    >
                      <p className="mt-1 ml-4 text-red-500 text-sm">
                        {emailErrorMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Password field */}
              <div>
                <div className="relative px-10">
                  <label
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 text-[#383838] text-[18px] text-sm font-bold font-['Montserrat'] mt-6"
                    htmlFor="password-field"
                  >
                    Senha {/*Password*/}
                  </label>
                  <input
                    onInput={areFieldsFilled}
                    type={passwordVisible ? "text" : "password"}
                    id="password-field"
                    className="w-full flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-hidden focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
                    placeholder="**********"
                    {...register("password", { required: true })}
                  />

                  {/* Hide and show password button */}
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 px-10"
                    onClick={togglePasswordVisibility}
                    id="hidePasswordIcon"
                  >
                    <Icon
                      path={passwordVisible ? mdiEyeOutline : mdiEyeOffOutline}
                      size={1}
                      color="#A1ACB2"
                    />
                  </button>
                </div>

                {passwordError && (
                  <div
                    className="flex items-center font-normal font-['Montserrat']"
                    role="alert"
                  >
                    <p className="mt-1 ml-4 text-red-500 text-sm">
                      {passwordErrorMessage}
                    </p>
                  </div>
                )}
              </div>
              {/*Forgot password button*/}
              <div className=" flex flex-col items-end gap-3 px-10">
                <span className="text-neutral-700 text-right text-lg font-normal font-['Montserrat']" />{" "}
                <label
                  id="modalToggle"
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="text-[#4E6979] text-lg font-normal font-['Montserrat'] cursor-pointer hover:text-blue-500"
                >
                  Esqueceu sua senha? {/**/}
                </label>
              </div>
              <span className="h-12" /> {/* spacing */}
              {/*Enter button*/}
              <div className="relative flex gap-4 px-10 flex-row items-center justify-center w-full ">
                <div className="flex-auto  h-[3.3rem] w-full items-center justify-center rounded-[15px] text-lg font-bold font-['Montserrat'] bg-[#C1CFD7] inline-flex text-[#809CAD] transform transition duration-100 ease-in ">
                  <button
                    type="submit"
                    id="submit-login-button"
                    className=" "
                    disabled={!submitLoading}
                  >
                    {submitLoading ? (
                      <span className="spinner-border text-[#C1CFD7] animate-spin inline-block  border-2 border-t-transparent rounded-full mr-2 text-[20px]" />
                    ) : (
                      false
                    )}
                    Entrar {/*Enter*/}
                  </button>
                </div>
              </div>
              <span className="h-4" /> {/* spacing */}
              {/*Link to Signup page*/}
              <div className="flex justify-center space-x-1">
                <span className="text-[#A1ACB2] text-lg font-normal font-['Montserrat']">
                  Ainda não tem conta? {/*Don't have an account yet?*/}
                </span>
                <Link
                  to="/signup"
                  className="text-[#383838] text-lg font-normal font-['Montserrat'] underline hover:text-blue-500 gap-4"
                >
                  Cadastre-se agora {/*Register now*/}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showModal && (
        <ToggleModalContext.Provider
          value={() => {
            setShowModal(!showModal);
          }}
        >
          <PasswordRecoveryModal
            toggleModal={() => {
              setShowModal(!showModal);
            }}
            setErrorMessage={setErrorMessage}
          />
        </ToggleModalContext.Provider>
      )}

      {/* Account application success modal */}
      <GenericModalComponent
        title="Aguarde aprovação"
        contentText="Seu cadastro está em análise e você terá retorno em até 7 dias."
        cancelBtnText="Fechar" // Close (functions as the 'ok' button in this particular modal)
        onConfirm={() => {}} // Empty function passed in due to confirm button not being present in this particular modal
        isVisible={isModalVisible}
        onClose={closeModal}
      />
    </main>
  );
};

export default Login;
