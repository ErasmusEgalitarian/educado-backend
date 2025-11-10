import { mdiChevronLeft, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import { createContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { postContentCreatorLogin } from "@/shared/api/sdk.gen";
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
  >(null); 
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
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
  
  const { call: login, isLoading: submitLoading } = useApi(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    postContentCreatorLogin,
  );
  //Variable determining the error message for both fields.
  const [emailError, setEmailError] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [notApprovedError, setNotApprovedError] = useState(null);

  // Location hook and modal state for account application success modal
  const location = useLocation();

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
       body: {
        email: data.email,
        password: data.password,
        },
    })
      .then((res) => {
        if (res.status == 200) {
          /* eslint-disable  @typescript-eslint/no-unsafe-assignment *//* eslint-disable  @typescript-eslint/no-unsafe-member-access */
          const token = res.jwt; 
          /* eslint-disable  @typescript-eslint/no-unsafe-assignment */
          const user = res.user;
          /* eslint-disable  @typescript-eslint/no-unsafe-argument */
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
        switch (err.response.data.error.details.error.code) {
          case "E0004": //Invalid Email and password
            setEmailError(err);
            setEmailErrorMessage(t("login.email-error"));
            setError("");
            break;

          case "E1001": //User Not Approved
            setNotApprovedError(err);
            
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
    
  const buttonContainer = submitloginButton.parentElement as HTMLDivElement;
    

    if (inputloginEmail.value.trim() && inputloginPass.value.trim() !== "") {
      submitloginButton.removeAttribute("disabled");
      buttonContainer.style.backgroundColor = "#35A1B1";
      submitloginButton.style.color = "#FDFEFF";
    } else {
      submitloginButton.setAttribute("disabled", "true");
      buttonContainer.style.backgroundColor = "#C1CFD7"; // default color when not filled
      submitloginButton.style.color = "#809CAD";         // default text color
    }

    // function to clear error messages once fields are empty
    setEmailError(null);
    setEmailErrorMessage("");
    setNotApprovedError(null);
  }
  
  

  return (
    
    <main className="flex bg-linear-to-br from-gradient-start 0% to-gradient-end 100%">
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
              <h1 className="mb-10 flex text-lg text-primary-text-title font-normal font-montserrat underline px-10">
                <Link to="/welcome">
                  <Icon path={mdiChevronLeft} size={1} color="primary-text-title" />
                </Link>
                <Link to="/welcome" className="text-lg text-primary-text-title font-normal font-montserrat " > 
                  <button className="cursor-pointer">
                    {t("login.back-button")}
                  </button>
                </Link>
              </h1>
            </div>

            {/*Title*/}
            <h1 className="text-primary-text-title text-3xl font-bold font-montserrat leading-normal self-stretch mb-10 px-10">
              {t("login.welcome-back")}{/*Welcome back to Educado!*/}
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
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 text-primary-text-title text-[18px] text-sm font-bold font-montserrat mt-6"
                    htmlFor="email-field"
                  >
                    {t("login.email")} {/*Email*/}
                  </label>
                  <input
                    onInput={areFieldsFilled}
                    type="email"
                    id="email-field"
                    className={`flex w-full py-3 px-4  placeholder-gray-400 text-lg rounded-lg border focus:outline-hidden focus:ring-2 focus:border-transparent ${emailError ? 'bg-error-surface-subtle border-error-surface-default focus:ring-error-surface-default' : ' bg-white border-greyscale-border-default focus:ring-sky-200'}`}
                    placeholder="usuario@gmail.com"
                    {...register("email", { required: true })}
                  />

                  
                </div>
              </div>
              {/* Password field */}
              <div>
                <div className="relative px-10">
                  <label
                    className="after:content-['*'] after:ml-0.5 after:text-error-surface-default text-primary-text-title text-[18px] text-sm font-bold font-montserrat mt-6"
                    htmlFor="password-field"
                  >
                    {t("login.password")}{/*Password*/}
                  </label>
                  <input
                    onInput={areFieldsFilled}
                    type={passwordVisible ? "text" : "password"}
                    id="password-field"
                    className={`flex w-full py-3 px-4  placeholder-greyscale-border-default text-lg rounded-lg border focus:outline-hidden focus:ring-2 focus:border-transparent ${emailError ? 'bg-error-surface-subtle border-error-surface-default focus:ring-error-surface-default' : ' bg-white border-greyscale-border-default focus:ring-sky-200'}`}
                    placeholder="**********"
                    {...register("password", { required: true })}
                  />

                  {/* Hide and show password button */}
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 px-10 cursor-pointer"
                    onClick={togglePasswordVisibility}
                    id="hidePasswordIcon"
                  >
                    <Icon
                      path={passwordVisible ? mdiEyeOutline : mdiEyeOffOutline}
                      size={1}
                      color="primary-text-subtitle"
                    />
                  </button>
                </div>

                {emailError && (
                  <div
                    className="mt-3 flex items-center text-[12px] font-normal font-montserrat"
                    role="alert"
                  >
                    <p className="mt-1 ml-4 text-error-surface-default text-sm px-7 ">
                      {emailErrorMessage}
                    </p>
                  </div>
                )}
              </div>
              {/*Forgot password button*/}
              <div className=" flex flex-col items-end gap-3 px-10">
                <span className="text-neutral-700 text-right text-lg font-normal font-montserrat" />{" "}
                <label
                  id="modalToggle"
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="text--greyscale-text-subtle text-lg font-normal font-montserrat cursor-pointer hover:text-primary-surface-default"
                >
                  {t("login.forgot-password")}{/*Forgot your password?*/}
                </label>
              </div>
              <span className="h-12" /> {/* spacing */}
              {/*Enter button*/}
              <div className="relative flex gap-4 px-10 flex-row items-center justify-center w-full ">
                <div className="flex-auto  h-[3.3rem] w-full items-center justify-center rounded-[15px] text-lg font-bold font-montserrat bg--greyscale-surface-disabled inline-flex text--greyscale-border-default transform transition duration-100 ease-in ">
                  <button
                    type="submit"
                    id="submit-login-button"
                    className=" "
                    disabled={!submitLoading}
                  >
                    {submitLoading ? (
                      <span className="spinner-border text-success-surface-lighter animate-spin inline-block  border-2 border-t-transparent rounded-full mr-2 text-[20px]" />
                    ) : (
                      false
                    )}
                    {t("login.login-button")}{/*Log In*/}
                  </button>
                </div>
              </div>
              <span className="h-4" /> {/* spacing */}
              {/*Link to Signup page*/}
              <div className="flex justify-center space-x-1">
                <span className="text-primary-text-subtitle text-lg font-normal font-['Montserrat']">
                  {t("login.no-account")} {/*Don't have an account yet?*/}
                </span>
                <Link
                  to="/signup"
                  className="text-primary-text-title text-lg font-normal font-montserrat underline hover:text-primary-surface-default gap-4"
                >
                  {t("login.register-now")}{/*Register now*/}
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
        contentText="Seu cadastro está em análise e você receberá um retorno em até x dias. Fique de olho no seu e-mail, avisaremos assim que tudo estiver pronto!"
        cancelBtnText="Fechar" // Close (functions as the 'ok' button in this particular modal)
        onConfirm={() => {setNotApprovedError(null)}} // Empty function passed in due to confirm button not being present in this particular modal
        isVisible={notApprovedError}
        onClose={() => { setNotApprovedError(null); }}
      />
    </main>
  );
};

export default Login;
