import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/shared/components/shadcn/form";

import FormActions from "./shared/components/form/form-actions";
import { FormInput } from "./shared/components/form/form-input";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
});

const TestPage = () => {
  // Use React Hook Form and Zod to manage the form state and validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
    mode: "onTouched", // Only validate when the user has interacted
  });

  // Submit handler. Data shape can be inferred from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Wait 2 seconds to simulate a network request and to see "submitting..."
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Submitted values: " + JSON.stringify(values));
  }

  return (
    <div className="w-2xl mx-auto mt-10 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Form Testing</h2>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormInput
            control={form.control}
            fieldName="username"
            title="Username"
            placeholder="johndoe"
            label="This is the label"
          />
          <FormActions formState={form.formState} />
        </form>
      </Form>
    </div>
  );
};

export default TestPage;
