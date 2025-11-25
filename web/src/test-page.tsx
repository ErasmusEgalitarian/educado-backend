import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { MediaPickerTrigger } from "@/features/media/components/media-picker-trigger";
import { MediaUploadZone } from "@/features/media/components/media-upload-zone";
import type { UploadFile } from "@/shared/api/types.gen";
import { PageContainer } from "@/shared/components/page-container";
import { Form } from "@/shared/components/shadcn/form";

import FormActions from "./shared/components/form/form-actions";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  image: z.custom<UploadFile>((val) => {
    return typeof val === "object" && val !== null && "url" in val;
  }, "Image is required"),
});

const TestPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
    mode: "onTouched",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Submitted: ${values.image.name ?? "file"}`);
  }

  return (
    <PageContainer title="Test Page">
      <div className="grid gap-8">
        {/* Section 1: Form with MediaPickerTrigger (select from library or upload) */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            MediaPickerTrigger - Form Integration (Select/Upload)
          </h2>
          <Form {...form}>
            <form
              onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
              className="space-y-8"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium">Cover Image (Required)</p>
                <MediaPickerTrigger
                  value={form.watch("image")}
                  onChange={(file) => {
                    form.setValue("image", file ?? undefined, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  fileTypes="image"
                  maxFiles={1}
                />
                {form.formState.errors.image && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>

              <FormActions
                formState={form.formState}
                showReset={true}
                onReset={() => {
                  form.reset();
                }}
              />
            </form>
          </Form>
        </div>

        {/* Section 2: MediaUploadZone - Direct upload with previews */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            MediaUploadZone - Direct Upload with Metadata
          </h2>
          <MediaUploadZone
            fileTypes={["image", "video"]}
            maxFiles={5}
            onUploadComplete={(files) => {
              toast.success(`Uploaded ${String(files.length)} file(s)`);
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default TestPage;
