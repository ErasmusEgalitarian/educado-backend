import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useFileUpload } from "@/shared/hooks/use-file-upload";

import { FormFileUpload } from "./shared/components/form/form-file-upload";

import { Form } from "@/shared/components/shadcn/form";

import FormActions from "./shared/components/form/form-actions";
import { FileWithMetadataSchema } from "./shared/components/file-upload";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  image: z.array(FileWithMetadataSchema).optional(),
});

const TestPage = () => {
  const { uploadFile } = useFileUpload();
  // Use React Hook Form and Zod to manage the form state and validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
    mode: "onTouched", // Only validate when the user has interacted
  });

  // Submit handler. Data shape can be inferred from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (values.image == undefined) {
      return;
    }
    const ids = await uploadFile(values.image);
    console.log("ids: " + ids);

    // Wait 2 seconds to simulate a network request and to see "submitting..."
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Submitted values: " + JSON.stringify(values));
  }

  return (
    <div className="w-2xl mx-auto mt-10 flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormFileUpload name="image" control={form.control} />
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
  );
};

export default TestPage;
