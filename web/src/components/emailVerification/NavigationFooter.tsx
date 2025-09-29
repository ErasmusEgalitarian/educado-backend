import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { setUserInfo } from "../../helpers/userInfo";
import { useApi } from "../../hooks/useAPI";
import { LoginResponseError } from "../../interfaces/LoginResponseError";
import { FormDataContext } from "../../pages/Signup"; // Import the context
import { ToggleModalContext } from "../../pages/Signup";
import AuthServices from "../../services/auth.services";

import { HandleContinueContext } from "./EmailVerificationModal";

interface propsType {
  codeVerified: boolean;
  token: string; // Add the token (code) prop
  isLoading?: boolean;
}

export default function NavigationFooter(props: propsType): JSX.Element {
  const { token, codeVerified, isLoading } = props; // Destructure token from props
  const toggleModal = useContext(ToggleModalContext);
  const handleContinue = useContext(HandleContinueContext);
  const formData = useContext(FormDataContext); // Access form data from context
  const navigate = useNavigate();
  const [error, setError] = useState<LoginResponseError.RootObject | null>(
    null,
  );
  const [cooldown, setCooldown] = useState(0); // Cooldown state for resend button

  const { call: verifyUser, isLoading: isVerifyingUser } = useApi(
    AuthServices.postUserVerification,
  );
  const { call: loginUser, isLoading: isLoggingIn } = useApi(
    AuthServices.postUserLogin,
  );

  const resendEmail = async () => {
    if (!formData) {
      console.error("Form data is not available");
      return;
    }

    if (cooldown === 0) {
      // Start cooldown
      setCooldown(30);
      // Trigger resend email functionality
      await AuthServices.postUserSignup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        token: token,
        role: formData.role,
      });
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timerId = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);

      // Clear interval when cooldown reaches 0
      return () => {
        clearInterval(timerId);
      };
    }
  }, [cooldown]);

  const onSubmit1 = async () => {
    if (!formData) {
      console.error("Form data is not available");
      return;
    }

    try {
      await verifyUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        token: token,
        role: formData.role,
      });

      const res = await loginUser({
        isContentCreator: true,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200) {
        const id = res.data.baseUser;
        navigate(`/application/${id}`);
      }
      if (res.status === 202) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("id", res.data.userInfo.id);
        setUserInfo(res.data.userInfo);
        navigate("/courses");
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <label className="w-full">
        <button
          id="continue"
          onClick={onSubmit1} // Call onSubmit when clicked
          className="py-2 px-7 mt-8 bg-primary hover:bg-gray-100 border border-primary hover:text-primary text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:ring-offset-2 rounded flex justify-center items-center space-x-2"
        >
          {isLoading || isVerifyingUser || isLoggingIn ? (
            <span className="spinner-border animate-spin rounded-full border-2 border-t-transparent w-4 h-4" />
          ) : null}
          <span>{!props.codeVerified ? "Continuar" : "Redefinir senha"}</span>{" "}
          {/* Continue or reset password */}
        </button>
      </label>

      <label className="flex items-center justify-center w-full mt-4">
        <p className="mr-2 text-l text-gray-600">O código não chegou?</p>
        <button
          id="resend-email"
          onClick={resendEmail} // Call resendEmail when clicked
          disabled={cooldown > 0} // Disable button during cooldown
          className={`text-primary underline transition ease-in duration-200 text-l font-medium 
            ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : "hover:text-primary-dark"}`}
        >
          {cooldown > 0 ? `Reenviar código em ${cooldown}s` : "Reenviar código"}
        </button>
      </label>
    </div>
  );
}
