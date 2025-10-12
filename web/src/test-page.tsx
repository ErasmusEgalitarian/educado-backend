import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { Form, InputSize } from "@/shared/components/shadcn/form";

import { ErrorDisplay } from "./shared/components/error/error-display";
import FormActions from "./shared/components/form/form-actions";
import { FormInput } from "./shared/components/form/form-input";
import { FormPasswordInput } from "./shared/components/form/form-password-input";
import { FormSelect } from "./shared/components/form/form-select";
import { FormTextarea } from "./shared/components/form/form-textarea";
import { GlobalLoader } from "./shared/components/global-loader";
import { LanguageSwitcher } from "./shared/components/language-switcher";
import { Button } from "./shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./shared/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shared/components/shadcn/select";
import { AppError } from "./shared/types/app-error";
import { Textarea } from "./shared/components/shadcn/textarea";

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

  const sampleError: AppError = {
    message: "This is a sample error message.",
    status: 400,
    title: "Sample Error",
    type: "validation",
    details: "Additional details about the sample error.",
  };

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
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">GlobalLoader Examples</h2>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Spinner Variant</h3>
          <GlobalLoader />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Inline Variant</h3>
          <GlobalLoader variant="inline" message="Loading courses..." />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">
            Container Variant (No Full Height)
          </h3>
          <GlobalLoader
            variant="container"
            title="Loading Data"
            description="Please wait while we fetch your information..."
          />
        </div>

        <div className="border rounded-lg p-4 h-96">
          <h3 className="font-semibold mb-2">
            Container Variant (Full Height within parent)
          </h3>
          <GlobalLoader
            variant="container"
            title="Loading Page"
            description="Setting up your workspace..."
            fullHeight
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Card with Loading & Error States</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card isLoading loadingProps={{ message: "Loading data..." }}>
            <CardHeader>
              <CardTitle>This won't show when loading</CardTitle>
            </CardHeader>
          </Card>

          <Card
            error={sampleError}
            errorProps={{
              actions: [
                {
                  label: "Retry",
                  onClick: () => toast.info("Retry clicked"),
                  variant: "primary",
                },
              ],
            }}
          >
            <CardHeader>
              <CardTitle>This won't show when error</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Normal Card</CardTitle>
              <CardDescription>
                This is a normal card with content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-greyscale-text-body">
                This card has no loading or error state, so it displays
                normally.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Button clicked!")}>
                Click me
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">ErrorDisplay Examples</h2>
        <ErrorDisplay error={sampleError} variant="bar" />
        <ErrorDisplay error={sampleError} variant="card" />
        <ErrorDisplay error={sampleError} variant="page" />
      </div>
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
