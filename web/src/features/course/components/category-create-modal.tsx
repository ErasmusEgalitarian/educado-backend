import { zodResolver } from "@hookform/resolvers/zod";
import { mdiFormatLetterCase } from "@mdi/js";
import Icon from "@mdi/react";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import z from "zod";

import { ApiCourseCategoryCourseCategoryDocument } from "@/shared/api";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import { FormInput } from "@/shared/components/form/form-input";
import { OverlayStatusWrapper } from "@/shared/components/overlay-status-wrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/shadcn/alert-dialog";
import { Form } from "@/shared/components/shadcn/form";
import { toAppError } from "@/shared/lib/error-utilities";

import { useCreateCategoryMutation } from "../api/course-mutations";

interface CategoryCreateModalProps<
  T extends ApiCourseCategoryCourseCategoryDocument,
> {
  open: boolean;
  onClose: () => void;
  onCreated: (data: T) => void;
}

const formSchema = z.object({
  categoryName: z.string().min(2, t("multiSelect.minNameLength", { count: 2 })),
});

const CategoryCreateModal = <
  T extends ApiCourseCategoryCourseCategoryDocument,
>({
  open,
  onClose,
  onCreated,
}: CategoryCreateModalProps<T>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const createMutation = useCreateCategoryMutation();
  const mutationLoading = createMutation.isPending;
  const mutationSuccess = createMutation.isSuccess;
  const mutationError = toAppError(createMutation.error);

  // Submit handler. Data shape can be inferred from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createMutation.mutateAsync(values.categoryName);
      // Notify parent, close, and reset immediately
      onCreated(result as T);
      onClose();
      form.reset(); // Clear the form
      createMutation.reset(); // Allow for re-creation
    } catch (error) {
      // Error is handled by the mutation state and displayed in the UI
      console.error("Error creating category:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-8"
      >
        <AlertDialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              // Ensure we reset mutation and form when closing to avoid stale disabled state
              createMutation.reset();
              form.reset();
              onClose();
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("multiSelect.createCategory")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <OverlayStatusWrapper
                  isLoading={mutationLoading}
                  isSuccess={mutationSuccess}
                >
                  <FormInput
                    control={form.control}
                    fieldName="categoryName"
                    label={t("multiSelect.EnterCategoryTitle")}
                    placeholder={t("multiSelect.newCategory")}
                    startIcon={<Icon path={mdiFormatLetterCase} size={1} />}
                  />
                </OverlayStatusWrapper>
                <ErrorDisplay
                  error={mutationError}
                  actions={[
                    {
                      label: t("common.dismiss"),
                      onClick: () => {
                        createMutation.reset();
                      },
                    },
                    {
                      label: t("common.retry"),
                      onClick: () => void form.handleSubmit(onSubmit)(),
                      variant: "primary",
                    },
                  ]}
                  variant="bar"
                  className="mt-4"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={mutationLoading || mutationSuccess}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={
                  mutationLoading || mutationSuccess || mutationError != null
                }
                onClick={(e) => {
                  e.preventDefault();
                  void form.handleSubmit(onSubmit)();
                }}
              >
                {t("common.create")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default CategoryCreateModal;
