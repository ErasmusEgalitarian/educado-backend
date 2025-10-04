import { zodResolver } from "@hookform/resolvers/zod";
import { mdiHome, mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormPasswordInput } from "@/shared/components/form/form-password-input";
import { Button } from "@/shared/components/shadcn/button";
import { Card } from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";
import { Input } from "@/shared/components/shadcn/input";

import { ComponentDemo } from "./component-demo";

/* ------------------- Standalone Input Props (primitive) ------------------- */
const standaloneInputProps = [
  {
    name: "type",
    type: '"text" | "email"',
    default: '"text"',
    description: "The HTML input type.",
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text shown when input is empty.",
  },
  {
    name: "startIcon",
    type: "ReactNode",
    description: "Optional icon rendered inside the left side.",
  },
  {
    name: "endIcon",
    type: "ReactNode",
    description: "Optional icon rendered inside the right side.",
  },
  {
    name: "variant",
    type: '"default" | "error"',
    default: '"default"',
    description: "Visual style / validation state.",
  },
  {
    name: "inputSize",
    type: '"xs" | "sm" | "md" | "lg"',
    default: '"md"',
    description: "Control the padding & font sizing.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Whether the input is disabled.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply.",
  },
];

/* ----------------- Form Input (composed) props of interest ---------------- */
// NOTE: FormInput abstracts the primitive Input. Only a curated subset of props are exposed.
const formInputProps = [
  {
    name: "control",
    type: "Control<TFieldValues>",
    description: "React Hook Form control instance (required).",
  },
  {
    name: "fieldName",
    type: "FieldPath<TFieldValues>",
    description: "Field path registered with RHF schema.",
  },
  {
    name: "label",
    type: "string",
    description: "Visible label text. Optional; omit for label-less fields.",
  },
  {
    name: "labelAction",
    type: "ReactNode",
    description: "Inline element rendered beside the label (e.g. link button).",
  },
  {
    name: "description",
    type: "string | string[]",
    description: "Helper text or bullet list (array renders as list).",
  },
  {
    name: "isRequired",
    type: "boolean",
    description:
      "Adds visual + aria required indicators (validation via schema).",
  },
  {
    name: "hintTooltip",
    type: "string",
    description: "Shows an info icon with provided tooltip content.",
  },
  {
    name: "inputSize",
    type: '"xs" | "sm" | "md" | "lg"',
    default: '"md"',
    description: "Scales label, control and description typography & spacing.",
  },
  {
    name: "startIcon",
    type: "ReactNode",
    description: "Icon element rendered inside the left side of the input.",
  },
  {
    name: "endIcon",
    type: "ReactNode",
    description: "Icon element rendered inside the right side of the input.",
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text for the underlying input.",
  },
  {
    name: "type",
    type: '"text" | "email"',
    default: '"text"',
    description: "HTML input type constraint exposed by FormInput.",
  },
  {
    name: "wrapperClassName",
    type: "string",
    description: "Custom classes applied to the wrapper FormItem container.",
  },
];

/* ------------------ Reusable single-field schema factory ------------------ */
// If required is true, enforce min length; otherwise value is optional.
const makeSchema = (required?: boolean) =>
  required === true
    ? z.object({ value: z.string().min(2, "Must be at least 2 chars.") })
    : z.object({ value: z.string().optional() });

// Primitive examples consolidated per spec
const primitiveExamples = [
  {
    title: "Variants",
    description: "Default, error, disabled and icon usage in one place.",
    code: `<Input placeholder="Default" />
<Input variant="error" placeholder="Error state" />
<Input placeholder="Disabled" disabled />
<Input startIcon={<Icon path={mdiHome} size={1} />} placeholder="With icon" />`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Input placeholder="Default" />
        <Input variant="error" placeholder="Error state" />
        <Input placeholder="Disabled" disabled />
        <Input
          startIcon={<Icon path={mdiHome} size={1} />}
          placeholder="With icon"
        />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "All supported inputSize values (xs, sm, md, lg).",
    code: `<Input inputSize="xs" placeholder="XS" />
<Input inputSize="sm" placeholder="SM" />
<Input inputSize="md" placeholder="MD" />
<Input inputSize="lg" placeholder="LG" />`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Input inputSize="xs" placeholder="XS" />
        <Input inputSize="sm" placeholder="SM" />
        <Input inputSize="md" placeholder="MD" />
        <Input inputSize="lg" placeholder="LG" />
      </div>
    ),
  },
];

interface SingleFieldFormProps {
  title: string;
  required?: boolean;
  description?: string | string[];
  hintTooltip?: string;
  inputSize?: "xs" | "sm" | "md" | "lg";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholder?: string;
}

const SingleFieldForm = ({
  title,
  required,
  description,
  hintTooltip,
  inputSize = "md",
  startIcon,
  endIcon,
  placeholder,
}: SingleFieldFormProps) => {
  const schema = makeSchema(required);
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
    mode: "onTouched",
  });

  const onSubmit = (vals: Values) => {
    // eslint-disable-next-line no-console
    console.log(`[${title}]`, vals);
    toast.success(`${title} submitted: ${JSON.stringify(vals)}`);
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <FormInput
            control={form.control}
            fieldName="value"
            title={title}
            description={description}
            isRequired={required === true}
            hintTooltip={hintTooltip}
            inputSize={inputSize}
            placeholder={placeholder}
            startIcon={startIcon}
            endIcon={endIcon}
          />
          <FormActions
            formState={form.formState}
            showReset
            onReset={() => {
              form.reset();
            }}
          />
        </form>
      </Form>
    </Card>
  );
};

// Form example configs to produce both code and preview.
const formExampleConfigs: {
  title: string;
  required?: boolean;
  description?: string | string[];
  hintTooltip?: string;
  inputSize?: "xs" | "sm" | "md" | "lg";
  startIcon?: boolean; // flag to include code for icon; preview uses actual icon
  endIcon?: boolean;
  placeholder?: string;
}[] = [
  { title: "Basic", placeholder: "Basic field" },
  {
    title: "Required",
    required: true,
    placeholder: "At least 2 chars",
    description: "Validation enforced via schema. The prop is only cosmetic.",
  },
  {
    title: "With Hint",
    placeholder: "Hover the icon",
    hintTooltip: "This is additional contextual information.",
    description: "Includes tooltip hint next to the label",
    startIcon: true,
  },
  {
    title: "Bullet Description",
    placeholder: "Bullet list",
    description: ["First helpful point", "Second helpful point"],
  },
  {
    title: "Single Description",
    placeholder: "Single description",
    description: "A concise single-line description",
  },
  {
    title: "Extra Small Size",
    inputSize: "xs",
    placeholder: "XS sized",
    description: "Tiny form control variant",
  },
  {
    title: "Small Size",
    inputSize: "sm",
    placeholder: "Small sized",
    description: "Compact label, input & description",
  },
  {
    title: "Medium Size",
    inputSize: "md",
    placeholder: "Medium sized",
    description: "Compact label, input & description",
  },
  {
    title: "Large Size",
    inputSize: "lg",
    placeholder: "Large sized",
    description: "Enlarged label, input & description",
    endIcon: true,
  },
];

const buildFormUsageCode = (cfg: (typeof formExampleConfigs)[number]) => {
  const lines: string[] = [
    "<FormInput",
    "  control={form.control}",
    '  fieldName="value"',
    `  title="${cfg.title}"`,
  ];
  if (cfg.placeholder != null && cfg.placeholder !== "")
    lines.push(`  placeholder="${cfg.placeholder}"`);
  if (cfg.description != null) {
    if (Array.isArray(cfg.description)) {
      const arr = cfg.description.map((d) => `"${d}"`).join(", ");
      lines.push(`  description={[${arr}]}`);
    } else if (cfg.description !== "") {
      lines.push(`  description="${cfg.description}"`);
    }
  }
  if (cfg.required === true) lines.push("  isRequired");
  if (cfg.hintTooltip != null && cfg.hintTooltip !== "")
    lines.push(`  hintTooltip="${cfg.hintTooltip}"`);
  if (cfg.inputSize != null) {
    if (cfg.inputSize === "md") {
      lines.push('  inputSize="md" // default');
    } else {
      lines.push(`  inputSize="${cfg.inputSize}"`);
    }
  }
  if (cfg.startIcon === true)
    lines.push("  startIcon={<Icon path={mdiInformationOutline} size={1} /> }");
  if (cfg.endIcon === true)
    lines.push("  endIcon={<Icon path={mdiHome} size={1} /> }");
  lines.push("/>");
  return lines.join("\n");
};

const formExamples = formExampleConfigs.map((cfg) => {
  let descText: string | undefined;
  if (typeof cfg.description === "string") {
    descText = cfg.description;
  } else if (Array.isArray(cfg.description)) {
    descText = "Bullet list description example";
  }
  return {
    title: cfg.title,
    description: descText,
    code: buildFormUsageCode(cfg),
    preview: (
      <SingleFieldForm
        key={cfg.title}
        title={cfg.title}
        required={cfg.required === true}
        description={cfg.description}
        hintTooltip={cfg.hintTooltip}
        inputSize={cfg.inputSize}
        placeholder={cfg.placeholder}
        startIcon={
          cfg.startIcon === true ? (
            <Icon path={mdiInformationOutline} size={1} />
          ) : undefined
        }
        endIcon={
          cfg.endIcon === true ? <Icon path={mdiHome} size={1} /> : undefined
        }
      />
    ),
  };
});

/* ------------------------- Password Field Example ------------------------ */
const PasswordExampleForm = () => {
  const form = useForm<{ password: string }>({
    defaultValues: { password: "" },
    mode: "onTouched",
  });
  const handleForgotPassword = () => {
    toast.info("Forgot password functionality is not implemented yet.");
  };
  const onSubmit = (vals: { password: string }) => {
    // eslint-disable-next-line no-console
    console.log("[Password Field]", vals);
    toast.success("Password submitted: " + JSON.stringify(vals));
  };
  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <FormPasswordInput
            control={form.control}
            fieldName="password"
            placeholder="••••••••"
            label="Password"
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
          <FormActions formState={form.formState} />
        </form>
      </Form>
    </Card>
  );
};

const passwordExample = {
  title: "Password Field",
  description:
    "Password input with show/hide toggle and a 'Forgot password?' action.",
  code: `import { useForm } from 'react-hook-form';\nimport { toast } from 'sonner';\nimport { Form } from '@/shared/components/shadcn/form';\nimport { FormPasswordInput } from '@/shared/components/form/form-password-input';\nimport FormActions from '@/shared/components/form/form-actions';\nimport { Button } from '@/shared/components/shadcn/button';\n\nconst form = useForm<{ password: string }>({ defaultValues: { password: '' } });\n\nconst handleForgotPassword = () => {\n  toast.info('Forgot password functionality is not implemented yet.');\n};\n\n<form onSubmit={form.handleSubmit(values => { toast.success('Password submitted'); })}>\n  <FormPasswordInput\n    control={form.control}\n    fieldName="password"\n    label="Password"\n    placeholder="••••••••"\n    labelAction={<Button variant="blank" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }} className="ml-auto text-sm underline-offset-4 hover:underline">Forgot password?</Button>}\n  />\n  <FormActions formState={form.formState} />\n</form>`,
  preview: <PasswordExampleForm />,
};

const allFormExamples = [...formExamples, passwordExample];

export const FormInputDemo = () => (
  <ComponentDemo
    componentName="Input"
    description="Text input primitive and form-integrated composite variant."
    props={standaloneInputProps}
    examples={primitiveExamples}
    formProps={formInputProps}
    formExamples={allFormExamples}
  />
);

export default FormInputDemo;
