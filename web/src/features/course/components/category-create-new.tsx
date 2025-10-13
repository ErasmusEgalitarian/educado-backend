import { zodResolver } from "@hookform/resolvers/zod";
import { mdiFormatLetterCase } from "@mdi/js";
import Icon from "@mdi/react";
import { useForm } from "react-hook-form";
import z from "zod";

import { ApiCourseCategoryCourseCategoryDocument } from "@/shared/api";
import { FormInput } from "@/shared/components/form/form-input";
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
import { useCreateCategoryMutation } from "../api/course-mutations";
import { toAppError } from "@/shared/lib/error-utilities";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import GlobalLoader from "@/shared/components/global-loader";

interface CategoryCreateNewProps<
  T extends ApiCourseCategoryCourseCategoryDocument,
> {
  open: boolean;
  onClose: () => void;
  onCreated: (data: T) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const CategoryCreateNew = <T extends ApiCourseCategoryCourseCategoryDocument>({
  open,
  onClose,
  onCreated,
}: CategoryCreateNewProps<T>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    mode: "onTouched", // Only validate when the user has interacted
  });

  const createMutation = useCreateCategoryMutation();
  const mutationLoading = createMutation.isPending;
  const mutationSuccess = createMutation.isSuccess;
  const mutationError = toAppError(createMutation.error);

  // Submit handler. Data shape can be inferred from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createMutation.mutateAsync(values.name);
      createMutation.reset();

      onCreated(result as T);
    } catch (error) {
      const appError = toAppError(error);
      console.log("Error creating category: " + appError.message);
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
            if (!isOpen) onClose();
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {mutationSuccess}
                {mutationLoading}
                <FormInput
                  control={form.control}
                  fieldName="name"
                  label="With Hint"
                  placeholder="Hover the icon"
                  description="Includes tooltip hint next to the label"
                  hintTooltip="This is additional contextual information."
                  startIcon={<Icon path={mdiFormatLetterCase} size={1} />}
                />
                {mutationLoading && (
                  <GlobalLoader variant="inline" message="Creating category" />
                )}
                <ErrorDisplay
                  error={mutationError}
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
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={mutationLoading || mutationSuccess}
                onClick={(e) => {
                  e.preventDefault();
                  void form.handleSubmit(onSubmit)();
                }}
              >
                Create
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default CategoryCreateNew;
