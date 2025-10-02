//Imports
import { mdiCheckBold, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState } from "react";

//Exporting UI content&structure of Modal
export default function PersonalInformationForm({
  isSecondModalOpen,
  modalInputValue,
  handleInputNumbersOnly,
  intError,
  setIsSecondModalOpen,
  isModalOpen,
  setIsModalOpen,
}: Readonly<{
  isModalOpen: any;
  setIsModalOpen: any;
  isSecondModalOpen: any;
  modalInputValue: any;
  handleInputNumbersOnly: any;
  intError: any;
  setIsSecondModalOpen: any;
}>) {
  //States for password
  const [passwordCheck1, setPasswordCheck1] = useState(false);
  const [passwordCheck2, setPasswordCheck2] = useState(false);
  const [passwordVisibleRepeat, setPasswordVisibleRepeat] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  //Open new model
  const handleModalButton = () => {
    setIsSecondModalOpen(true);
  };

  //Hide & display password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibilityRepeat = () => {
    setPasswordVisibleRepeat(!passwordVisibleRepeat);
  };
  return (
    <>
      {/* Content of first modal when open*/}
      {isModalOpen && (
        <div className="grid grid-cols-2 gap-2">
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
            <div
              className="bg-[#E4F2F5] rounded-lg p-9 h-97"
              style={{ width: "520px" }}
            >
              <div className="flex flex-col ">
                <h1 className="text-xl font-bold text-black ">
                  Redefinição de senha
                </h1>
                <label
                  className="py-6 font-['Montserrat']"
                  htmlFor="newPassword"
                >
                  Enviamos um código par ao seu email de redefinição de senha,
                  por favor, insira o mesmo abaixo:
                </label>
                <div className="flex justify-center items-center mt-6">
                  <input
                    className="bg-white rounded-lg text-center border-none w-72"
                    placeholder="XXXX"
                    type="text"
                    name="newPassword"
                    value={modalInputValue}
                    onChange={handleInputNumbersOnly}
                  />
                </div>
                {intError && (
                  <span className=" ml-28 ">Por favor, coloque um numero</span>
                )}
                {/* //Display error message if an int is not entered */}

                <div className="flex justify-center items-center gap-2 py-2">
                  <p className="text-[#A1ACB2]">O cogió não chegou?</p>
                  <button
                    type="button"
                    className=" underline"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Reenviar código
                  </button>
                </div>
                {/* Close Modal */}
                <div className="grid grid-cols-2">
                  <button
                    type="button"
                    className="text-[#166276] underline py-0 mt-7 text-left"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Cancelar
                  </button>

                  <div className="">
                    <button
                      type="button"
                      className="space-x-44 disabled:opacity-20 disabled:bg-cyan-500 rounded-lg bg-[#166276] 
                          transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50 text-white text-lg font-bold font-['Montserrat'] mt-7 w-40 p-3"
                      onClick={() => {
                        if (!intError) {
                          handleModalButton();
                        }
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content of second modal when open*/}
      {isSecondModalOpen && (
        <div className="grid grid-cols-2 gap-2">
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
            <div
              className="bg-[#E4F2F5] rounded-lg p-9 h-97"
              style={{ width: "520px" }}
            >
              <div className="flex flex-col ">
                <h1 className="text-xl font-bold text-black text-left">
                  Redefinição de senha
                </h1>

                {/*Password Field*/}
                <div className="relative">
                  <label
                    className=" flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5"
                    htmlFor="passwordField"
                  >
                    Senha {/*Password*/}
                    <span className=" text-[#FF4949] text-sm font-normal font-['Montserrat']">
                      *
                    </span>
                  </label>

                  {/* Change password visibility and icons*/}
                  <input
                    data-cy="password-field"
                    type={passwordVisible ? "text" : "password"}
                    id="passwordField"
                    className="w-full hflex border-gray-300  py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-hidden focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
                    placeholder="**********"
                  />

                  <button
                    data-cy="password-eye"
                    type="button"
                    className="absolute right-3 bottom-3"
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

                {/*Password Checks*/}
                <div className="px-3">
                  <div className="items-stretch text-[#A1ACB2] text-sm font-normal font-['Montserrat'] mt-2 text-left">
                    {passwordCheck1 ? (
                      <Icon
                        className=" left-20 float-left"
                        path={mdiCheckBold}
                        size={0.55}
                        color=" green"
                      />
                    ) : null}
                    &bull; Mínimo 8 caracteres {/*Minimum 8 characters*/}
                  </div>

                  <div className="text-[#A1ACB2] text-sm font-normal font-['Montserrat'] items-stretch text-left">
                    {passwordCheck2 ? (
                      <Icon
                        className="left-20 float-left"
                        path={mdiCheckBold}
                        size={0.55}
                        color="green"
                      />
                    ) : null}
                    &bull; Conter pelo menos uma letra{" "}
                    {/*Contain at least one letter*/}
                  </div>
                </div>

                {/*Confirm Password Fields */}
                <div className="relative">
                  <label
                    className=" flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-6"
                    htmlFor="passwordFieldRepeat"
                  >
                    Confirmar novo senha
                    <span className="text-[#FF4949] text-sm font-normal font-['Montserrat']">
                      *
                    </span>
                  </label>
                  {/* Change password visibility and icons*/}
                  <input
                    type={passwordVisibleRepeat ? "text" : "password"}
                    id="passwordFieldRepeat"
                    placeholder="********** "
                    className="w-full flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-hidden focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute right-3 bottom-3"
                    onClick={togglePasswordVisibilityRepeat}
                  >
                    <Icon
                      path={
                        passwordVisibleRepeat ? mdiEyeOutline : mdiEyeOffOutline
                      }
                      size={1}
                      color="#A1ACB2"
                    />
                  </button>
                </div>

                {/* Close modal */}
                <div className="grid grid-cols-2 gap-3 ">
                  <button
                    type="button"
                    className="text-[#166276] underline py-0 mt-7 text-left"
                    onClick={() => {
                      setIsSecondModalOpen(false);
                    }}
                  >
                    Cancelar
                  </button>

                  {/* Save Changes */}
                  <div className="">
                    <button
                      type="button"
                      className="space-x-44 disabled:opacity-20 disabled:bg-cyan-500 rounded-lg bg-[#166276] 
                          transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50 text-white text-lg font-bold font-['Montserrat'] mt-7 w-56 p-3"
                    >
                      Salvar novo senha
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
