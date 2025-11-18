import { zodResolver } from "@hookform/resolvers/zod";
import { mdiFormatLetterCase } from "@mdi/js";
import Icon from "@mdi/react";
import { t } from "i18next";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CourseCategory } from "@/shared/api/types.gen";
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

import { useCreateCategoryMutation } from "../api/category-mutations";

interface CategoryCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (data: CourseCategory) => void;
}

const formSchema = z.object({
  categoryName: z.string().min(2, t("multiSelect.minNameLength", { count: 2 })),
});

const CategoryCreateModal = ({
  open,
  onClose,
  onCreated,
}: CategoryCreateModalProps) => {
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

  // Store the last successful result for use in onSuccessComplete
  const lastResultRef = useRef<CourseCategory | null>(null);

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createMutation.mutateAsync(values.categoryName);

      // Extract the CourseCategory from the response and store it
      if (result?.data) {
        lastResultRef.current = result.data;
        // Note: onCreated, onClose, form.reset, and createMutation.reset()
        // are all handled by OverlayStatusWrapper's onSuccessComplete, so they
        // happen after animated success message display
      } else {
        throw new Error("Category created but no data returned");
      }
    } catch (error) {
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
                  onSuccessComplete={() => {
                    // After success message has been displayed, complete the action
                    if (lastResultRef.current) {
                      onCreated(lastResultRef.current);
                      lastResultRef.current = null;
                    }
                    form.reset();
                    createMutation.reset();
                    onClose();
                  }}
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
