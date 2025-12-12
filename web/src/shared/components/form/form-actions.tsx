// Export only FormActions. Legacy FormSubmitButton name has been removed intentionally.
import { FieldValues, FormState, useFormContext } from "react-hook-form";
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
  /** If not provided, the component will read formState from FormProvider via useFormContext(). */
  readonly formState?: FormState<TFieldValues>;
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
  /** Optional target form id to allow placing the submit button outside the form. */
  readonly formId?: string;
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
  formId,
}: FormActionsProps<TFieldValues>) => {
  const { t } = useTranslation();

  // Allow callers to either pass formState explicitly or let this component
  // access the current form context. This makes the component easier to use
  // when wrapped in a FormProvider.
  // Try to read formState from context if the caller didn't provide it.
  let ctxFormState: FormState<TFieldValues> | undefined;
  try {
    const ctx = useFormContext<TFieldValues>();
    ctxFormState = ctx.formState;
  } catch {
    ctxFormState = undefined;
  }

  const localFormState: FormState<TFieldValues> | undefined = formState ?? ctxFormState;

  /* --------------------------------- Labels --------------------------------- */
  const finalSubmitLabel = submitLabel ?? t("form.submit");
  const finalSubmittingLabel = submittingLabel ?? t("form.submitting") + "...";
  const finalResetLabel = resetLabel ?? t("form.reset");

  /* ------------------------------ Button State ------------------------------ */
  const { isDirty, isValid, isSubmitting } = localFormState ?? {
    isDirty: false,
    isValid: true,
    isSubmitting: false,
  };
  const canSubmitByState = (allowPristineSubmit || isDirty) && isValid && !isSubmitting;

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
        form={formId}
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
