import { zodResolver } from "@hookform/resolvers/zod";
import { mdiHome, mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
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
const formInputProps = [
  {
    name: "title",
    type: "string",
    description: "Visible field label (optional).",
  },
  {
    name: "fieldName",
    type: "FieldPath<TFieldValues>",
    description: "Form field path registered with RHF.",
  },
  {
    name: "control",
    type: "Control<TFieldValues>",
    description: "React Hook Form control instance.",
  },
  {
    name: "description",
    type: "string | string[]",
    description: "Optional help text or bullet list (array).",
  },
  {
    name: "hintTooltip",
    type: "string",
    description: "Tooltip content displayed next to the title.",
  },
  {
    name: "isRequired",
    type: "boolean",
    description: "Adds a required indicator (does not enforce validation).",
  },
  {
    name: "inputSize",
    type: '"xs" | "sm" | "md" | "lg"',
    description: "Size applied to label, description and input.",
  },
  {
    name: "startIcon / endIcon",
    type: "ReactNode",
    description: "Optional icons inside the input control.",
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

export const FormInputDemo = () => (
  <ComponentDemo
    componentName="Input"
    description="Text input primitive and form-integrated composite variant."
    props={standaloneInputProps}
    examples={primitiveExamples}
    formProps={formInputProps}
    formExamples={formExamples}
  />
);

export default FormInputDemo;
