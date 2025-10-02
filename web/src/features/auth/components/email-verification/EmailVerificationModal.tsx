import { createContext, useEffect, useState } from "react";

import CodeVerification from "./CodeVerification";
import NavigationFooter from "./NavigationFooter";

interface propTypes {
  toggleModal: () => void;
  setErrorMessage: (message: string, error?: string) => void;
  uemail: string;
  isLoading?: boolean;
}

export const HandleContinueContext = createContext<() => void>(() => {});

/**
 * Modal that allows the user to reset their password.
 * @param {propTypes} props properties of the component:
 * - `setError`: function that sets the error message
 * - `setErrorMessage`: function that sets the error message
 * @returns {JSX.Element} the modal component
 */
const EmailVerificationModal = (props: propTypes): JSX.Element => {
  const { uemail, toggleModal, setErrorMessage } = props;

  // States that control the flow of the modal
  const [emailSent, setEmailSent] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  // User input
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  // Error messages
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  /**
   * Handles the continue button click. If the email has not been sent yet, validates the email and sends it.
   * If the code has not been verified yet, validates the code and verifies it.
   * If the code has been verified, validates the passwords and updates the password.
   */

  /**
   * Sends an email to the user with a verification code to reset the password.
   * If the email is not registered, sets emailError to the appropriate error message.
   * If an unexpected error occurs, sets error to the appropriate error message.
   * @param email the user's email
   */

  /**
   * Verifies the code entered by the user. If the code is valid, sets codeVerified to true.
   * If the code is invalid, sets codeError to the appropriate error message.
   * @param email the user's email
   * @param code the verification code used to reset the password
   */

  useEffect(() => {
    // Resets errors upon changes
    setCodeError("");
  }, [email, code]);

  return (
    <div
      id="password-reset-modal"
      className="absolute inset-0 grid place-items-center"
    >
      <div
        className="absolute inset-0 bg-[#383838] opacity-60 z-10"
        onClick={toggleModal}
      />

      <div
        className="relative bg-[#F1F9FB] p-10 rounded-xl max-h-full z-20"
        style={{ width: "500px" }}
      >
        <h3 className="font-bold text-xl mb-4">Confirmar email</h3>
        <h1 className="mb-4">
          Enviamos um código para o <b>{uemail}</b>, por favor, insira o mesmo
          abaixo
        </h1>

        {!codeVerified ? (
          <CodeVerification
            setCode={setCode}
            codeError={codeError}
            setCodeEntered={setCodeEntered}
          />
        ) : null}
        <NavigationFooter codeVerified={codeVerified} token={code} />
      </div>
    </div>
  );
};

/*<label id="cancel-button" onClick={toggleModal} className="underline hover:cursor-pointer">
          Cancelar
        </label> */

export default EmailVerificationModal;
