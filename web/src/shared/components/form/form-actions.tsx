// Export only FormActions. Legacy FormSubmitButton name has been removed intentionally.
import { FieldValues, FormState } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/shadcn/button";

/**
 * FormActions
 * A small helper component that renders a submit button (with built-in disabled logic)
 * and, optionally, a reset button.
 */
export interface FormActionsProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  readonly formState: FormState<TFieldValues>;
  readonly submitLabel?: string;
  readonly submittingLabel?: string;
  readonly showReset?: boolean;
  readonly resetLabel?: string;
  /** Callback invoked when reset is clicked. Provide your form.reset wrapper here. */
  readonly onReset?: () => void;
  /** If true, the submit button will remain enabled even when the form is pristine. */
  readonly allowPristineSubmit?: boolean;
  readonly className?: string;
  /** Disable the submit button explicitly (overrides internal logic). */
  readonly disableSubmit?: boolean;
}

const FormActions = <TFieldValues extends FieldValues = FieldValues>({
  formState,
  submitLabel,
  submittingLabel,
  showReset = false,
  resetLabel,
  onReset,
  allowPristineSubmit = false,
  className,
  disableSubmit,
}: FormActionsProps<TFieldValues>) => {
  const { t } = useTranslation();

  /* --------------------------------- Labels --------------------------------- */
  const finalSubmitLabel = submitLabel ?? t("common.submit");
  const finalSubmittingLabel =
    submittingLabel ?? t("common.submitting") + "...";
  const finalResetLabel = resetLabel ?? t("common.reset");

  /* ------------------------------ Button State ------------------------------ */
  const { isDirty, isValid, isSubmitting } = formState;
  const canSubmitByState =
    (allowPristineSubmit || isDirty) && isValid && !isSubmitting;

  const submitDisabled = disableSubmit ?? !canSubmitByState;
  const containerClass = className ?? "flex items-center gap-3";
  const resetDisabled = isSubmitting || !onReset;

  const handleReset = () => {
    if (onReset) onReset();
  };

  return (
    <div className={containerClass}>
      <Button
        type="submit"
        disabled={isSubmitting || submitDisabled}
        aria-disabled={submitDisabled}
      >
        {isSubmitting ? finalSubmittingLabel : finalSubmitLabel}
      </Button>
      {showReset && (
        <Button
          type="button"
          variant="secondary"
          disabled={resetDisabled}
          aria-disabled={resetDisabled}
          onClick={handleReset}
        >
          {finalResetLabel}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
