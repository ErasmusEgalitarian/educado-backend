import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface GenericModalProps {
  title?: string;
  isVisible?: boolean;
  contentText?: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
  isConfirmDisabled?: boolean;
  onConfirm?: (e?: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children?: ReactNode | ReactNode[];
  loading?: boolean;
  // TODO: with some configuration tailwind types could work and this can be changed
  width?: string;
}

const GenericModalComponent: React.FC<GenericModalProps> = ({
  title,
  contentText,
  confirmBtnText,
  cancelBtnText = "Cancelar",
  onClose,
  isVisible = false,
  onConfirm,
  isConfirmDisabled = false,
  children,
  loading = false,
  width,
}) => {
  if (!isVisible) return null;

  return (
    // Overlay: fixed + full screen + center content
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`flex flex-col w-[500px] h-[350px] bg-[#f1f9fb] space-y-8 p-10 rounded-xl text-center ${
          width || ""
        }`}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center">
          {title && <span className="text-[24px] font-['Montserrat'] text-[#141B1F] text-xl">{title}</span>}

          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <MdClose size={25} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div>
        {contentText && (
          <p className="text-[20px] text-[#383838] text-left font-['Montserrat'] whitespace-normal text-wrap">{contentText}</p>
        )}
        {children}
        </div>

        {/* Footer buttons */}
        {(cancelBtnText || confirmBtnText) && (
          <div
            className={`flex w-full ${
              confirmBtnText ? "justify-between" : "justify-end"
            }`}
          >
            {cancelBtnText && (
              <button
                type="button"
                onClick={onClose}
                className="h-[2.5rem] min-w-[100px] px-4 whitespace-nowrap items-center justify-center rounded-[15px] text-lg font-bold font-['Montserrat'] bg-[#D62B25] text-white inline-flex transform transition duration-100 ease-in hover:bg-red-700 hover:text-gray-50"
              >
                {cancelBtnText}
              </button>
            )}

            {confirmBtnText && (
              <button
                type="submit"
                className="btn bg-primary hover:bg-cyan-900 border-none px-10"
                onClick={() => onConfirm?.()}
                disabled={isConfirmDisabled || loading}
              >
                {loading && (
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2" />
                )}
                <span className="normal-case text-base font-bold">
                  {confirmBtnText}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericModalComponent;