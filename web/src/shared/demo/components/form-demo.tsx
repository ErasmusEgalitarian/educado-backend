import { zodResolver } from "@hookform/resolvers/zod";
import { mdiCheck, mdiContentCopy } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/shadcn/button";
import { Card } from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const fullExampleCode = `import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/shared/components/shadcn/form';
import { FormInput } from '@/shared/components/form/form-input';
import { FormActions } from "@/shared/components/form/form-actions";

// Define the Zod schema for validation and form data shape.
const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters.'),
});

// The form component itself
const UsernameForm = () => {

 // Initialize the form with React Hook Form and Zod resolver.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' },
    mode: 'onTouched',
  });

  // Submit handler with inferred data shape from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await new Promise(r => setTimeout(r, 2000));
    toast.success('Submitted values: ' + JSON.stringify(values));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

       {/* Single reusable FormInput component */}
        <FormInput
          control={form.control}
          fieldName="username"
          title="Username"
          placeholder="johndoe"
          label="This is the label"
          isRequired
          description="Your public handle"
        />

        {/* Reusable actions with built-in state handling */}
        <FormActions
            formState={form.formState}
            showReset={true}
            onReset={form.reset}
        />
      </form>
    </Form>
  );
};`;

const FormDemo = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
    mode: "onTouched",
  });
  const [copied, setCopied] = useState(false);

  async function onSubmit(values: FormValues) {
    // eslint-disable-next-line no-console
    console.log(values);
    await new Promise((r) => setTimeout(r, 2000));
    toast.success("Submitted values: " + JSON.stringify(values));
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullExampleCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Form Composition Basics
        </h2>
        <p className="text-muted-foreground text-lg">
          Minimal example showing how to wire Zod + React Hook Form with a
          single reusable <code>FormInput</code> and a submit button.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <div className="flex flex-col gap-4">
          <Card className="p-6 space-y-4">
            <h4 className="font-semibold">Key Steps</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Define a Zod schema for validation & types.</li>
              <li>
                Initialize <code>useForm</code> with <code>zodResolver</code>.
              </li>
              <li>
                Wrap fields in the shared <code>Form</code> provider.
              </li>
              <li>
                Use <code>FormInput</code> with <code>control</code> &{" "}
                <code>fieldName</code> (Or other form primitives).
              </li>
              <li>
                Use <code>FormActions</code> for consistent submit & optional
                reset.
              </li>
            </ol>
          </Card>
          <Card className="p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">
                Live Demo
              </h3>
              <p className="text-muted-foreground text-sm">
                Interact with the form; validation triggers on touch.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
                className="space-y-6"
              >
                <FormInput
                  control={form.control}
                  fieldName="username"
                  label="Username"
                  placeholder="johndoe"
                  isRequired
                  description="Your public handle"
                />
                <FormActions
                  formState={form.formState}
                  showReset={true}
                  onReset={form.reset}
                />
              </form>
            </Form>
          </Card>
        </div>

        <Card className="p-6 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight">Code</h3>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => void handleCopy()}
            >
              {copied ? (
                <Icon path={mdiCheck} size={1} />
              ) : (
                <Icon path={mdiContentCopy} size={1} />
              )}
            </Button>
          </div>
          <div className="bg-muted/50 rounded-lg border p-4 max-h-[480px] overflow-auto">
            <pre className="text-sm">
              <code className="font-mono whitespace-pre">
                {fullExampleCode}
              </code>
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FormDemo;
