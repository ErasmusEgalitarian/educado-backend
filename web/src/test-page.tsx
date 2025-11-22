import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UploadFile } from "@/shared/api/types.gen";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import { Form } from "@/shared/components/shadcn/form";

import {
  MediaDropzone,
  MediaDropzoneVariant,
} from "./features/media/components/media-dropzone";
import { MediaInput } from "./features/media/components/media-input";
import FormActions from "./shared/components/form/form-actions";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  image: z.custom<UploadFile>((val) => {
    return typeof val === "object" && val !== null && "url" in val;
  }, "Image is required"),
});

const TestPage = () => {
  const [dropzoneVariant, setDropzoneVariant] =
    useState<MediaDropzoneVariant>("upload");

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
        {/* Section 1: Form with MediaInput */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Form Integration</h2>
          <Form {...form}>
            <form
              onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
              className="space-y-8"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium">Profile Image (Required)</p>
                <Controller
                  control={form.control}
                  name="image"
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <div>
                      <MediaInput
                        variant="select"
                        value={value}
                        onChange={onChange}
                        maxFiles={2}
                      />
                      {error && (
                        <p className="text-sm text-destructive mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
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

        {/* Section 2: Standalone Dropzone with Toggle */}
        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Standalone Dropzone</h2>
            <Button
              variant="outline"
              onClick={() => {
                setDropzoneVariant((v) =>
                  v === "upload" ? "select" : "upload"
                );
              }}
            >
              Toggle Mode: {dropzoneVariant}
            </Button>
          </div>

          <MediaDropzone
            variant={dropzoneVariant}
            onFileSelect={(files) =>
              toast.info(`Files selected: ${String(files.length)}`)
            }
            onClick={() => toast.info("Clicked (Select Mode)")}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default TestPage;
