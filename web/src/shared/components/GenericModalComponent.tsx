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

  /** @deprecated use `size` instead */
  width?: string;

  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
  footerClassName?: string;

  size?: "sm" | "md" | "lg";
  panelClassName?: string;
}

const SIZE_MAP: Record<NonNullable<GenericModalProps["size"]>, string> = {
  sm: "w-[500px] max-w-[95vw] max-h-[80vw] py-10 px-10 space-y-7",
  md: "w-[500px] max-w-[95vw] max-h-[80vw] py-10 px-10 space-y-8",
  lg: "w-[640px] max-w-[95vw] max-h-[80vw] pt-10 px-10 space-y-9",
};

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
  cancelButtonClassName,
  confirmButtonClassName,
  footerClassName,
  size = "md",
  panelClassName,
}) => {
  if (!isVisible) return null;

  const defaultCancelClasses =
    "h-[2.5rem] min-w-[100px] px-4 whitespace-nowrap items-center justify-center rounded-[15px] text-lg font-bold font-['Montserrat'] bg-[#D62B25] text-white inline-flex transform transition duration-100 ease-in hover:bg-red-700 hover:text-gray-50";

  const defaultConfirmClasses =
    "btn bg-primary hover:bg-cyan-900 border-none px-10 rounded-[15px] font-bold font-['Montserrat']";

  const sizeClasses = panelClassName ? "" : (SIZE_MAP[size] ?? SIZE_MAP.md);

    // Backward compat: if `width` is given, we treat it as extra className
  const extraWidthClasses = width ?? "";

  return (
    // Overlay: fixed + full screen + center content

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={
          [
            "flex flex-col bg-[#f1f9fb] rounded-3xl text-center",
            sizeClasses,
            extraWidthClasses,
            panelClassName,
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        {/* Top bar */}
        <div className="flex justify-between items-center">
          {title && (
            <span className="text-[24px] font-['Montserrat'] text-[#141B1F] text-xl">
              {title}
            </span>
          )}

          {/* Close button */}
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <MdClose size={25} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div>
          {contentText && (
            <p className="text-[20px] text-[#383838] text-left font-['Montserrat'] whitespace-normal text-wrap">
              {contentText}
            </p>
          )}
          {children}
        </div>

        {/* Footer buttons */}
        {(cancelBtnText || confirmBtnText) && (
          <div
            className={`flex w-full ${
              confirmBtnText ? "justify-between" : "justify-end"
            } ${footerClassName || ""}`}
          >
            {cancelBtnText && (
              <button
                type="button"
                onClick={onClose}
                className={
                  cancelButtonClassName
                    ? cancelButtonClassName
                    : defaultCancelClasses
                }
              >
                {cancelBtnText}
              </button>
            )}

            {confirmBtnText && (
              <button
                type="button"
                className={
                  confirmButtonClassName
                    ? confirmButtonClassName
                    : defaultConfirmClasses
                }
                onClick={() => onConfirm?.()}
                disabled={isConfirmDisabled || loading}
              >
                {loading && (
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2" />
                )}
                <span className="font-['Montserrat'] font-bold text-[20px]">
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
