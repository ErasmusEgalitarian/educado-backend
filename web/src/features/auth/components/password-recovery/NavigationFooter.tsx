import { useContext } from "react";

import { ToggleModalContext } from "../login";

import { HandleContinueContext } from "./PasswordRecoveryModal";

interface propsType {
  codeVerified: boolean;
  isLoading: boolean;
}

/**
 * The navigation footer of the password recovery modal.
 * Contains the cancel and continue buttons.
 * @param props properties of the component:
 * - `codeVerified`: boolean that indicates if the code has been verified
 * @returns {JSX.Element} the navigation footer component for the modal
 */
export const NavigationFooter = (props: Readonly<propsType>): JSX.Element => {
  const toggleModal = useContext(ToggleModalContext);
  const handleContinue = useContext(HandleContinueContext);

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4 w-full mt-8">
        <label
          id="cancel-button"
          onClick={toggleModal}
          className="underline hover:cursor-point"
        >
          Cancelar {/** Cancel */}
        </label>
        <label>
          <button
            id="continue"
            onClick={handleContinue}
            className="py-2 px-7 bg-primary hover:bg-gray-100 border border-primary hover:text-primary text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:ring-offset-2 rounded-sm flex justify-center items-center space-x-2"
          >
            {props.isLoading ? (
              <span className="spinner-border animate-spin rounded-full border-2 border-t-transparent w-4 h-4" />
            ) : null}
            <span>{!props.codeVerified ? "Continuar" : "Redefinir senha"}</span>{" "}
            {/* Continue if code is not verified, else reset password */}
          </button>
        </label>
      </div>
    </div>
  );
};
