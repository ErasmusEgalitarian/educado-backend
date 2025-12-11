import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface GenericModalProps {
  title?: string;
  header?: string;
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

const hasNonEmptyString = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0;

const DEFAULT_CANCEL_CLASSES =
  "h-[2.5rem] min-w-[100px] px-4 whitespace-nowrap items-center justify-center rounded-[15px] text-lg font-bold font-['Montserrat'] bg-[#D62B25] text-white inline-flex transform transition duration-100 ease-in hover:bg-red-700 hover:text-gray-50";

const DEFAULT_CONFIRM_CLASSES =
  "btn bg-primary hover:bg-cyan-900 border-none px-10 rounded-[15px] font-bold font-['Montserrat']";

type FooterButtonOptions = Pick<
  GenericModalProps,
  | "cancelBtnText"
  | "confirmBtnText"
  | "onClose"
  | "onConfirm"
  | "isConfirmDisabled"
  | "loading"
  | "cancelButtonClassName"
  | "confirmButtonClassName"
  | "footerClassName"
>;

const renderFooterButtons = (
  options: FooterButtonOptions,
): React.ReactElement | null => {
  const {
    cancelBtnText,
    confirmBtnText,
    onClose,
    onConfirm,
    isConfirmDisabled,
    loading,
    cancelButtonClassName,
    confirmButtonClassName,
    footerClassName,
  } = options;

  const showCancelButton = hasNonEmptyString(cancelBtnText);
  const showConfirmButton = hasNonEmptyString(confirmBtnText);

  if (!showCancelButton && !showConfirmButton) {
    return null;
  }

  const cancelClasses = hasNonEmptyString(cancelButtonClassName)
    ? cancelButtonClassName
    : DEFAULT_CANCEL_CLASSES;
  const confirmClasses = hasNonEmptyString(confirmButtonClassName)
    ? confirmButtonClassName
    : DEFAULT_CONFIRM_CLASSES;
  const normalizedConfirmDisabled =
    typeof isConfirmDisabled === "boolean" ? isConfirmDisabled : false;
  const normalizedLoading = typeof loading === "boolean" ? loading : false;
  const disableConfirm = normalizedConfirmDisabled || normalizedLoading;
  const shouldShowSpinner = normalizedLoading;
  const footerJustifyClass = showConfirmButton ? "justify-between" : "justify-end";
  const normalizedFooterClass = hasNonEmptyString(footerClassName)
    ? footerClassName
    : "";

  return (
    <div className={`flex w-full ${footerJustifyClass} ${normalizedFooterClass}`}>
      {showCancelButton ? (
        <button type="button" onClick={onClose} className={cancelClasses}>
          {cancelBtnText}
        </button>
      ) : null}

      {showConfirmButton ? (
        <button
          type="button"
          className={confirmClasses}
          onClick={() => onConfirm?.()}
          disabled={disableConfirm}
        >
          {shouldShowSpinner ? (
            <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2" />
          ) : null}
          <span className="font-['Montserrat'] font-bold text-[20px]">
            {confirmBtnText}
          </span>
        </button>
      ) : null}
    </div>
  );
};

const GenericModalComponent: React.FC<GenericModalProps> = (props) => {
  const {
    title,
    header,
    contentText,
    confirmBtnText,
    cancelBtnText = "Cancelar",
    onClose,
    isVisible = false,
    onConfirm,
    isConfirmDisabled = false,
    children,
    loading = false,
    cancelButtonClassName,
    confirmButtonClassName,
    footerClassName,
    size = "md",
    panelClassName,
  } = props;

  if (!isVisible) return null;

  const legacyWidth = (props as { width?: string }).width;

  const sizeClasses = hasNonEmptyString(panelClassName) ? "" : SIZE_MAP[size];

  // Backward compat: if `width` is given, we treat it as extra className
  const extraWidthClasses = hasNonEmptyString(legacyWidth) ? legacyWidth : "";

  const normalizedPanelClass = hasNonEmptyString(panelClassName)
    ? panelClassName
    : "";
  const showTitle = hasNonEmptyString(title);
  const showHeader = hasNonEmptyString(header);
  const showContentText = hasNonEmptyString(contentText);
  const footerButtons = renderFooterButtons({
    cancelBtnText,
    confirmBtnText,
    onClose,
    onConfirm,
    isConfirmDisabled,
    loading,
    cancelButtonClassName,
    confirmButtonClassName,
    footerClassName,
  });

  return (
    // Overlay: fixed + full screen + center content

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={[
          "flex flex-col bg-[#f1f9fb] rounded-3xl",
          sizeClasses,
          extraWidthClasses,
          normalizedPanelClass,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center">
          {showTitle ? (
            <span className="text-[24px] font-['Montserrat'] text-[#141B1F] text-xl">
              {title}
            </span>
          ) : null}

          {/* Close button */}
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <MdClose size={25} className="text-slate-400" />
          </button>
        </div>
        {showHeader ? (
          <div className="mb-1">
            <h4 className="text-[20px] font-['Montserrat'] text-[#383838] font-bold">
              {header}
            </h4>
          </div>
        ) : null}

        {/* Content */}
        <div>
          {showContentText ? (
            <p className="text-[20px] text-[#383838] text-left font-['Montserrat'] whitespace-normal text-wrap">
              {contentText}
            </p>
          ) : null}
          {children}
        </div>

        {/* Footer buttons */}
        {footerButtons}
      </div>
    </div>
  );
};

export default GenericModalComponent;
