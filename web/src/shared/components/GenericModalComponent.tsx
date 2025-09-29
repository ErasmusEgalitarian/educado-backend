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
  confirmBtnText, // If empty, no confirmation button will be displayed
  cancelBtnText = "Cancelar", // Renameable to e.g. "Fechar" (close) when invoking the component
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
    <div className={`modal ${isVisible ? "modal-open" : null}`}>
      <div
        className={`modal-box flex flex-col w-auto min-w-[300px] max-w-[85%] max-h-[85%] bg-[#f1f9fb] space-y-8 m-10 p-10 ${
          width || ""
        }`}
      >
        {/* Top bar */}
        <div className="flex justify-between">
          {title !== null ? (
            <span className="font-bold text-xl">{title}</span>
          ) : null}

          {/* Window close button (X) */}
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <MdClose size={25} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto">
          {contentText !== null ? (
            <p className="whitespace-normal text-wrap">{contentText}</p>
          ) : null}
          {children}
        </div>

        {(cancelBtnText || confirmBtnText) && (
          <div
            className={`flex w-full ${
              confirmBtnText === null ? "justify-center" : "justify-between"
            }`}
          >
            {/* Cancel */}
            {cancelBtnText && (
              <button
                id="confirm-button"
                type="button"
                className="flex flex-col btn bg-transparent border-none hover:bg-transparent px-0"
                onClick={onClose}
              >
                <span className="text-primary normal-case text-lg">
                  {cancelBtnText}
                </span>
                <hr className="w-4/5 border-primary" />
              </button>
            )}

            {confirmBtnText && (
              <button
                type="submit"
                className="btn bg-primary hover:bg-cyan-900 border-none px-10"
                onClick={() => onConfirm?.()}
                disabled={isConfirmDisabled || loading}
              >
                {loading ? (
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2" />
                ) : null}
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
