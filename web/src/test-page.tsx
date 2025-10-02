import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/shadcn/form";
import { Input } from "@/shared/components/shadcn/input";
import { toast } from "sonner";

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
    // eslint-disable-next-line no-console
    console.log(values);

    // Wait 2 seconds to simulate a network request and to see "submitting..."
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Submitted values: " + JSON.stringify(values));
  }

  // Helpers for the submit button state
  const { isDirty, isValid, isSubmitting } = form.formState;
  const canSubmit = isDirty && isValid && !isSubmitting;

  return (
    <div className="w-2xl mx-auto mt-10 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Button Testing</h2>
      <div className="flex flex-col gap-4 w-48 mb-8">
        <Button variant="ghost">Foo</Button>
        <Button variant="outline">Foo</Button>
        <Button variant="destructive">Foo</Button>
      </div>
      <h2 className="text-2xl font-bold">Form Testing</h2>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TestPage;
