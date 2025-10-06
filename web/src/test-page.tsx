import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { Form, InputSize } from "@/shared/components/shadcn/form";

import FormActions from "./shared/components/form/form-actions";
import { FormInput } from "./shared/components/form/form-input";
import { FormPasswordInput } from "./shared/components/form/form-password-input";
import { FormSelect } from "./shared/components/form/form-select";
import { FormTextarea } from "./shared/components/form/form-textarea";
import { LanguageSwitcher } from "./shared/components/language-switcher";
import { Button } from "./shared/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shared/components/shadcn/select";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  message: z.string().min(2).max(200, "Message must"),
  role: z
    .string({
      required_error: "You must select a role.",
    })
    .min(1, "You must select a role."),
});

const TestPage = () => {
  const [inputSize, setInputSize] = useState<InputSize>("md");
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

  const handleForgotPassword = () => {
    toast.info("Forgot password functionality is not implemented yet.");
  };

  const { t } = useTranslation();

  return (
    <div className="w-2xl mx-auto mt-10 flex flex-col gap-4">
      <LanguageSwitcher />
      <h2 className="text-2xl font-bold">{t("common.edit")}</h2>
      <Select
        onValueChange={(value) => {
          setInputSize(value as InputSize);
        }}
        value={inputSize}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="md" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xs">Extra Small</SelectItem>
          <SelectItem value="sm">Small</SelectItem>
          <SelectItem value="md">Medium</SelectItem>
          <SelectItem value="lg">Large</SelectItem>
        </SelectContent>
      </Select>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormInput
            control={form.control}
            fieldName="username"
            placeholder="johndoe"
            label="Username"
            isRequired={true}
            inputSize={inputSize}
          />
          <FormPasswordInput
            control={form.control}
            fieldName="password"
            placeholder="••••••••"
            label="Password"
            isRequired={true}
            labelAction={
              <Button
                variant="blank"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Button>
            }
          />
          <FormTextarea
            control={form.control}
            fieldName="message"
            label="Message"
            placeholder="Write your message here..."
            inputSize={inputSize}
            rows={4}
          />

          <FormSelect
            control={form.control}
            fieldName="role"
            label="Role"
            placeholder="Choose a role"
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
          />

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
