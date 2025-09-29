import { mdiCheck } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useEffect, useState } from "react";

import PasswordEye from "@/shared/components/PasswordEye";
import TextInput from "@/shared/components/TextInput";

interface propsType {
  password: string;
  setPassword: (password: string) => void;
  passwordError: string;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  passwordConfirmationError: string;
  passwordContainsLetter: boolean;
  passwordLengthValid: boolean;
  setPasswordContainsLetter: (passwordContainsLetter: boolean) => void;
  setPasswordLengthValid: (passwordLengthValid: boolean) => void;
}

/**
 * Screen that allows the user to set a new password for their account.
 * @param props
 * - `password`: the password hook
 * - `setPassword`: the function that sets the password hook
 * - `passwordError`: the password error hook
 * - `passwordConfirmation`: the password confirmation hook
 * - `setPasswordConfirmation`: the function that sets the password confirmation hook
 * - `passwordConfirmationError`: the password confirmation error hook
 * - `passwordContainsLetter`: the password contains letter hook
 * - `passwordLengthValid`: the password length valid hook
 * - `setPasswordContainsLetter`: the function that sets the password contains letter hook
 * - `setPasswordLengthValid`: the function that sets the password length valid hook
 * @returns {JSX.Element} the screen component
 */
export default function NewPasswordScreen(props: propsType): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  /**
   * Toggles the password fields' visibilities.
   * @param confirmation whether the password confirmation field is being toggled - if not, the password field is being toggled
   */
  const togglePasswordVisibility = (confirmation: boolean) => {
    if (confirmation) {
      setShowPasswordConfirmation(!showPasswordConfirmation);
      return;
    }
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Updates the password validation checklist
    props.setPasswordContainsLetter(/[a-z]/.test(props.password));
    props.setPasswordLengthValid(props.password.length >= 8);
  }, [props.password]);

  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="-mb-1">
        <div className="relative">
          <TextInput
            id="reset-password-password-field"
            className=""
            hidePassword={!showPassword}
            placeholder="Insira sua senha" // Enter your password
            label="Senha" //Password
            value={props.password}
            onChange={props.setPassword}
          />
          <PasswordEye
            id="reset-password-password-eye"
            passwordVisible={showPassword}
            togglePasswordVisibility={() => {
              togglePasswordVisibility(false);
            }}
          />
        </div>
        <p id="password-error" className="text-error">
          {props.passwordError}
        </p>{" "}
        {/* Display password error in red */}
      </div>
      <div className="flex justify-start h-3">
        <p
          className={
            "text-sm" +
            (props.passwordLengthValid || !props.password
              ? " text-grayMedium"
              : " text-error")
          }
        >
          {/* Minimum 8 characters */}• Mínimo 8 caracteres
        </p>
        <div className="flex-row items-center -translate-y-2">
          {props.passwordLengthValid ? (
            <Icon path={mdiCheck} color="#4AA04A" className="w-8 ml-1" />
          ) : null}
        </div>
      </div>
      <div className="flex justify-start h-6">
        <p
          className={
            "text-sm font-sans" +
            (props.passwordContainsLetter || !props.password
              ? " text-grayMedium"
              : " text-error")
          }
        >
          {/* Must contain at least one letter */}• Conter pelo menos uma letra
        </p>
        <div className="flex-row items-center -translate-y-2">
          {props.passwordContainsLetter ? (
            <Icon path={mdiCheck} color="#4AA04A" className="w-8 ml-1" />
          ) : null}
        </div>
      </div>
      <div className="-mb-1">
        <div className="relative">
          <TextInput
            id="confirm-password-field"
            className=""
            hidePassword={!showPasswordConfirmation}
            placeholder="Insira sua senha" // Enter your password
            label="Confirme nova senha" // Confirm new password
            value={props.passwordConfirmation}
            onChange={props.setPasswordConfirmation}
          />
          <PasswordEye
            passwordVisible={showPasswordConfirmation}
            togglePasswordVisibility={() => {
              togglePasswordVisibility(true);
            }}
          />
        </div>
        <p id="password-confirmation-error" className="text-warning h-5">
          {props.passwordConfirmationError}
        </p>
      </div>
    </div>
  );
}
