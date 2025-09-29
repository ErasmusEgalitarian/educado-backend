import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { createContext, useContext, useState } from "react";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "@mdi/react";
import {
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiChevronLeft,
  mdiCheckBold,
  mdiAlertCircleOutline,
} from "@mdi/js";
import Carousel from "../components/archive/Carousel";
import EmailVerificationModal from "../components/emailVerification/EmailVerificationModal";
import NavigationFooter from "../components/emailVerification/NavigationFooter";
import { useApi } from "../hooks/useAPI";

export const ToggleModalContext = createContext<() => void>(() => {});
export const FormDataContext = createContext<any>(null);

// Static assets
import background from "../assets/background.jpg";

// interfaces
import { LoginResponseError } from "../interfaces/LoginResponseError";

// services
import AuthServices from "../services/auth.services";
import { NonProtectedRoute } from "../services/auth.guard";
import MiniNavbar from "../components/navbar/MiniNavbar";

// Form input interface
interface ApplicationInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  token: null;
}

// Yup schema for fields (new user registration form)
const SignupSchema = Yup.object().shape({
  // Registers user first name and removes leading/trailing whitespaces
  firstName: Yup.string().trim()
    .required("Seu primeiro nome é obrigatório!"), /*Your first name is Required*/

  // Registers user last name and removes leading/trailing whitespaces
  lastName: Yup.string().trim()
    .required("Seu sobrenome é obrigatório!"), /*Your last name is Required*/ 

  password: Yup.string()
    .min(8, "Muito curto!")
    .required("A senha não é longa o suficiente"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "As senhas não coincidem"
  ),
  email: Yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Seu email não está correto').required("O email é obrigatório"),
});

const Signup = () => {
  const [error, setError] = useState<LoginResponseError.RootObject | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ApplicationInputs | null>(null);
  const [email, setEmail] = useState(""); // Replace with actual email logic


  // callback 
  const {call: signup, isLoading : submitLoading} = useApi(AuthServices.postUserSignup);
  // Navigation hook
  const navigate = useNavigate();

  // Use-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationInputs>({
    resolver: yupResolver(SignupSchema),
  });

  const [emailExistsError, setEmailExistError] = useState(null);
  const [emailNotValid, setEmailNotValid] = useState(false);
  const [emailExistsErrorMessage, setErrorExistMessage] = useState("");
  const [passwordMismatchError, setPasswordMismatchError] = useState(null);
  const [passwordMismatchErrorMessage, setPasswordMismatchErrorMessage] =
    useState("");

  /**
   * OnSubmit function for Signup.
   * Takes the submitted data from the form and sends it to the backend through a service.
   *
   * @param {JSON} data Includes firstName, lastName, email, password fields.
   */
  const onSubmit = async (data: any) => {

    setFormData(data); // Store the form data in state
    setEmail(data.email);

    // Show the email verification modal
    await signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: 'user',
      token: null,
    })
    
      .then((res) => {
        if (
          res.status === 200 ||
          res.data.message ===
            "Verification email sent. Please verify to complete registration.") {
          // If the signup is successful, show the modal
          setIsModalVisible(true);
        } else if ( res.status === 201){
          const id = res.data.contentCreatorProfile.baseUser;
          navigate(`/application/${id}`);
        }
      })
      .catch((err) => {
        setError(err);
        if (!err.response?.data) {
          console.error(err);
        } else {
          switch (err.response.data.error.code) {
            case "E0201": // Email already exists
            setEmailExistError(err);
            setErrorExistMessage(
              "Já existe um usuário com o email fornecido"
            );
            setPasswordMismatchError(null);
            setPasswordMismatchErrorMessage("");
            break;
            case "E0105": // Password mismatch
              setPasswordMismatchError(err);
              setPasswordMismatchErrorMessage("As senhas não combinam");
              setEmailExistError(null);
              setErrorExistMessage("");
              break;
            default:
              console.error(error);
          }
        }
      });
  };

  // Variables determining whether or not the password is visible
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [passwordVisibleRepeat, setPasswordVisibleRepeat] = useState(false);
  const togglePasswordVisibilityRepeat = () => {
    setPasswordVisibleRepeat(!passwordVisibleRepeat);
  };

  // Variables and functions for checking and setting password checks
  const [passwordCheck1, setPasswordCheck1] = useState(false);
  const [passwordCheck2, setPasswordCheck2] = useState(false);

  const handlePasswordChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordCheck1(password.length >= 8);
    setPasswordCheck2(/.*\p{L}.*$/u.test(password)); // At least one letter
  };

  // Function for validating that all fields are filled in
  function areFieldsFilled() {
    const inputSignupFirstName = document.getElementById(
      "firstNameField"
    ) as HTMLInputElement;
    const inputSignupLastName = document.getElementById(
      "lastNameField"
    ) as HTMLInputElement;
    const inputSignupEmail = document.getElementById(
      "email-field"
    ) as HTMLInputElement;
    const inputSignupPass = document.getElementById(
      "password-field"
    ) as HTMLInputElement;
    const inputSignupRedoPass = document.getElementById(
      "password-field-repeat"
    ) as HTMLInputElement;
    const submitSignupButton = document.getElementById(
      "submit-signup-button"
    ) as HTMLButtonElement;

    if (
      inputSignupFirstName.value.trim() &&
      inputSignupLastName.value.trim() &&
      inputSignupEmail.value.trim() &&
      inputSignupPass.value.trim() &&
      inputSignupRedoPass.value.trim() !== ""
    ) {
      submitSignupButton.removeAttribute("disabled");
      submitSignupButton.classList.remove("opacity-20");
    } else {
      submitSignupButton.setAttribute("disabled", "true");
      submitSignupButton.classList.add("opacity-20");
    }
    setPasswordMismatchError(null);
    setPasswordMismatchErrorMessage("");
    setEmailExistError(null);
    setErrorExistMessage("");
  }

  return (
    <ToggleModalContext.Provider
      value={() => setIsModalVisible(!isModalVisible)}>
      <FormDataContext.Provider value={formData}>
        <main className="bg-gradient-to-br from-[#C9E5EC] 0% to-[#FFF] 100%">
          {/* Mini navbar */}
          <MiniNavbar />

          {/* Container for the entire page */}
          <div className="grid grid-cols-1 md:grid-cols-2 m-auto w-full h-screen">
            {/* Left side with background image and carousel */}
            <div className="relative w-full h-screen hidden md:block container overflow-hidden">
              <img
                src={background}
                alt="w-[42.375rem]"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Carousel />
              </div>
            </div>

            {/* Right side - form section */}
            <div className="relative right-0 h-screen flex flex-col justify-center items-center">
              <ToastContainer />
              <div className="relative py-8 px-10 w-full">
                <div className="self-stretch">
                  <h1 className="mb-4 flex text-lg text-[#383838] font-normal font-['Montserrat'] underline">
                    <Link to="/welcome">
                      <Icon path={mdiChevronLeft} size={1} color="#383838" />
                    </Link>
                    <Link
                      to="/welcome"
                      className="text-lg text-[#383838] font-normal font-['Montserrat']">
                      Voltar
                    </Link>
                  </h1>
                </div>

                <h1 className="text-[#383838] text-3xl font-bold font-['Lato'] leading-normal self-stretch ">
                  Crie a sua conta gratuitamente!
                </h1>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="stretch flex flex-col"
                  noValidate>
                  <div className="flex">
                    <div className="relative flex-1">
                      <label
                        className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 "
                        htmlFor="firstNameField">
                        Nome
                      </label>
                      <input
                        onInput={areFieldsFilled}
                        type="text"
                        id="firstNameField"
                        className="w-[95%] flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg text-[#383838] focus:outline-none focus:ring-2 focus:border-transparent focus:ring-sky-200 rounded-lg"
                        placeholder="Nome"
                        {...register("firstName", {
                          required: "digite seu primeiro nome.",
                        })}
                      />
                    </div>

                    <div className="relative flex-1 ml-2">
                      <label
                        className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 "
                        htmlFor="lastNameField">
                        Sobrenome
                      </label>
                      <input
                        onInput={areFieldsFilled}
                        type="text"
                        id="lastNameField"
                        className="w-[100%] flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg text-[#383838] focus:outline-none focus:ring-2 focus:border-transparent focus:ring-sky-200 rounded-lg"
                        placeholder="Sobrenome"
                        {...register("lastName", {
                          required: "digite seu sobrenome.",
                        })}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 "
                      htmlFor="email-field">  
                      Email
                    </label>
                    <input
                      onInput={areFieldsFilled}
                      type="email"
                      id="email-field"
                      className="w-[100%] flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-sky-200 rounded-lg"
                      placeholder="usuario@gmail.com"
                      {...register("email", {
                        required: "introduza o seu e-mail.",
                      })}
                    />
                    {errors.email && 
                     <div
                     className="flex items-center font-normal font-['Montserrat']"
                     role="alert">
                     <p className="mt-1 ml-1 text-red-500 text-sm">
                      {errors.email.message}
                     </p>
                   </div>
                    }
                    {emailExistsError && (
                      <div
                        className="flex items-center font-normal font-['Montserrat']"
                        role="alert">
                        <p className="mt-1 ml-1 text-red-500 text-sm">
                          {emailExistsErrorMessage}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 "
                      htmlFor="password-field">
                      Senha
                    </label>
                    <input
                      onInput={areFieldsFilled}
                      type={passwordVisible ? "text" : "password"}
                      id="password-field"
                      className="w-[100%] flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-sky-200 rounded-lg"
                      placeholder="**********"
                      {...register("password", { required: "insira a senha." })}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 bottom-3"
                      onClick={togglePasswordVisibility}
                      id="hidePasswordIcon">
                      <Icon
                        path={
                          passwordVisible ? mdiEyeOutline : mdiEyeOffOutline
                        }
                        size={1}
                        color="#A1ACB2"
                      />
                    </button>
                  </div>

                  <div className="px-3">
                    <div className="items-stretch text-[#A1ACB2] text-sm font-normal font-['Montserrat'] mt-2">
                      {passwordCheck1 && (
                        <Icon
                          className="left-20 float-left"
                          path={mdiCheckBold}
                          size={0.55}
                          color="green"
                        />
                      )}
                      &bull; Mínimo 8 caracteres
                    </div>

                    <div className="text-[#A1ACB2] text-sm font-normal font-['Montserrat'] items-stretch">
                      {passwordCheck2 && (
                        <Icon
                          className="left-20 float-left"
                          path={mdiCheckBold}
                          size={0.55}
                          color="green"
                        />
                      )}
                      &bull; Conter pelo menos uma letra
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-6 after:content-['*'] after:ml-0.5 after:text-red-500 "
                      htmlFor="password-field-repeat">
                      Confirmar Senha
                    </label>
                    <input
                      onInput={areFieldsFilled}
                      type={passwordVisibleRepeat ? "text" : "password"}
                      id="password-field-repeat"
                      placeholder="**********"
                      className="w-[100%] flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-sky-200 rounded-lg"
                      {...register("confirmPassword", {
                        required: "insira a senha.",
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 bottom-3"
                      onClick={togglePasswordVisibilityRepeat}>
                      <Icon
                        path={
                          passwordVisibleRepeat
                            ? mdiEyeOutline
                            : mdiEyeOffOutline
                        }
                        size={1}
                        color="#A1ACB2"
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && 
                     <div
                     className="flex items-center font-normal font-['Montserrat']"
                     role="alert">
                     <p className="mt-1 ml-1 text-red-500 text-sm">
                      {errors.confirmPassword.message}
                     </p>
                   </div>
                    }
                  {passwordMismatchError && (
                    <div
                      className="flex items-center font-normal font-['Montserrat']"
                      role="alert">
                      <Icon
                        path={mdiAlertCircleOutline}
                        size={0.6}
                        color="red"
                      />
                      <p className="mt-1 ml-1 text-red-500 text-sm">
                        {passwordMismatchErrorMessage}
                      </p>
                    </div>
                  )}

                  <span className="h-10" />

                  <button
                    type="submit"
                    id="submit-signup-button"
                    className="disabled:opacity-20 disabled:bg-slate-600 flex-auto w-[100%] h-[3.3rem] rounded-lg bg-[#166276] text-[#FFF] transition duration-100 ease-in hover:bg-cyan-900 hover:text-gray-50 text-lg font-bold font-['Montserrat']"
                    disabled={submitLoading}>
                    {submitLoading? (
                    <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2"></span>
                    ) : null}
                    Cadastrar
                  </button>

                  <span className="h-2" />

                  <div className="flex justify-center space-x-1">
                    <span className="text-[#A1ACB2] text-lg font-normal font-['Montserrat']">
                      Já possui conta?
                    </span>
                    <Link
                      to="/login"
                      className="text-[#383838] text-lg font-normal font-['Montserrat'] underline hover:text-blue-500 gap-6">
                      Entre agora
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            {isModalVisible && (
              <EmailVerificationModal
                toggleModal={() => setIsModalVisible(!isModalVisible)}
                setErrorMessage={(message: string, error?: string) => setErrorMessage(message)}
                uemail={email}
                isLoading={submitLoading}
              />
            )}
          </div>
        </main>
      </FormDataContext.Provider>
    </ToggleModalContext.Provider>
  );
};

export default Signup;
