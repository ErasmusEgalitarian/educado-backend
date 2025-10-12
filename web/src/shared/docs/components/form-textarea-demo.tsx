import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Card } from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";
import { Textarea } from "@/shared/components/shadcn/textarea";

import { ComponentDemo } from "./component-demo";

/* ------------------- Standalone Textarea Props (primitive) ------------------- */
const standaloneTextareaProps = [
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text shown when textarea is empty.",
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
    name: "rows",
    type: "number",
    description: "Number of visible text rows (affects min-height).",
  },
  {
    name: "maxLength",
    type: "number",
    description: "Maximum number of characters allowed.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Whether the textarea is disabled.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply.",
  },
];

/* ----------------- Form Textarea (composed) props of interest ---------------- */
const formTextareaProps = [
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
    name: "placeholder",
    type: "string",
    description: "Placeholder text for the underlying textarea.",
  },
  {
    name: "rows",
    type: "number",
    description: "Number of visible text rows.",
  },
  {
    name: "maxLength",
    type: "number",
    description: "Maximum character count.",
  },
  {
    name: "wrapperClassName",
    type: "string",
    description: "Custom classes applied to the wrapper FormItem container.",
  },
];

/* ------------------ Reusable single-field schema factory ------------------ */
const makeSchema = (
  required?: boolean,
  minLength?: number,
  maxLength?: number
) => {
  if (required === true) {
    let stringSchema = z
      .string()
      .min(
        minLength ?? 1,
        minLength != null
          ? `Must be at least ${String(minLength)} characters.`
          : "This field is required."
      );

    if (maxLength != null) {
      stringSchema = stringSchema.max(
        maxLength,
        `Must be no more than ${String(maxLength)} characters.`
      );
    }

    return z.object({ value: stringSchema });
  }

  // Optional field
  let stringSchema = z.string().optional();
  if (maxLength != null) {
    stringSchema = z
      .string()
      .max(maxLength, `Must be no more than ${String(maxLength)} characters.`)
      .optional();
  }

  return z.object({ value: stringSchema });
};

// Primitive examples
const primitiveExamples = [
  {
    title: "Variants",
    description: "Default, error, and disabled states.",
    code: `<Textarea placeholder="Default" />
<Textarea variant="error" placeholder="Error state" />
<Textarea placeholder="Disabled" disabled />`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Textarea placeholder="Default" />
        <Textarea variant="error" placeholder="Error state" />
        <Textarea placeholder="Disabled" disabled />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "All supported inputSize values (xs, sm, md, lg).",
    code: `<Textarea inputSize="xs" placeholder="XS" rows={2} />
<Textarea inputSize="sm" placeholder="SM" rows={3} />
<Textarea inputSize="md" placeholder="MD" rows={4} />
<Textarea inputSize="lg" placeholder="LG" rows={4} />`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Textarea inputSize="xs" placeholder="XS" rows={2} />
        <Textarea inputSize="sm" placeholder="SM" rows={3} />
        <Textarea inputSize="md" placeholder="MD" rows={4} />
        <Textarea inputSize="lg" placeholder="LG" rows={4} />
      </div>
    ),
  },
  {
    title: "Rows",
    description: "Control the number of visible text rows.",
    code: `<Textarea placeholder="2 rows" rows={2} />
<Textarea placeholder="4 rows" rows={4} />
<Textarea placeholder="6 rows" rows={6} />`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Textarea placeholder="2 rows" rows={2} />
        <Textarea placeholder="4 rows" rows={4} />
        <Textarea placeholder="6 rows" rows={6} />
      </div>
    ),
  },
];

interface SingleFieldFormProps {
  label: string;
  required?: boolean;
  description?: string | string[];
  hintTooltip?: string;
  inputSize?: "xs" | "sm" | "md" | "lg";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
}

const SingleFieldForm = ({
  label,
  required,
  description,
  hintTooltip,
  inputSize = "md",
  placeholder,
  rows,
  maxLength,
  minLength,
  showCharCount,
}: SingleFieldFormProps) => {
  const schema = makeSchema(required, minLength, maxLength);
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
    mode: "onTouched",
  });

  const onSubmit = (vals: Values) => {
    // eslint-disable-next-line no-console
    console.log(`[${label}]`, vals);
    toast.success(`${label} submitted: ${JSON.stringify(vals)}`);
  };

  const currentLength = (form.watch("value") ?? "").length;

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormTextarea
            control={form.control}
            fieldName="value"
            label={label}
            description={description}
            isRequired={required}
            hintTooltip={hintTooltip}
            inputSize={inputSize}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
          />
          {showCharCount === true && maxLength != null && (
            <div className="text-right text-sm text-greyscale-text-caption">
              {currentLength} / {maxLength} characters
            </div>
          )}
          <FormActions formState={form.formState} />
        </form>
      </Form>
    </Card>
  );
};

// Form example configs
const formExampleConfigs: {
  label: string;
  required?: boolean;
  description?: string | string[];
  hintTooltip?: string;
  inputSize?: "xs" | "sm" | "md" | "lg";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
}[] = [
  {
    label: "Basic",
    placeholder: "Enter your text here...",
    rows: 3,
  },
  {
    label: "Required",
    required: true,
    minLength: 10,
    placeholder: "At least 10 characters required",
    description: "Validation enforced via schema. The prop is only cosmetic.",
    rows: 3,
  },
  {
    label: "With Character Limit",
    placeholder: "Maximum 200 characters",
    maxLength: 200,
    showCharCount: true,
    description: "Character counter shown below the field",
    rows: 4,
  },
  {
    label: "With Hint",
    placeholder: "Hover the icon for help",
    hintTooltip: "This is additional contextual information about this field.",
    description: "Includes tooltip hint next to the label",
    rows: 3,
  },
  {
    label: "Bullet Description",
    placeholder: "Multiple guidelines...",
    description: [
      "First helpful point about formatting",
      "Second helpful point about content",
      "Third helpful point about length",
    ],
    rows: 4,
  },
  {
    label: "Extra Small Size",
    inputSize: "xs",
    placeholder: "XS sized textarea",
    description: "Tiny form control variant",
    rows: 2,
  },
  {
    label: "Small Size",
    inputSize: "sm",
    placeholder: "Small sized textarea",
    description: "Compact label, textarea & description",
    rows: 3,
  },
  {
    label: "Medium Size",
    inputSize: "md",
    placeholder: "Medium sized textarea",
    description: "Default size variant",
    rows: 4,
  },
  {
    label: "Large Size",
    inputSize: "lg",
    placeholder: "Large sized textarea",
    description: "Enlarged label, textarea & description",
    rows: 4,
  },
];

const buildFormUsageCode = (cfg: (typeof formExampleConfigs)[number]) => {
  const lines: string[] = [
    "<FormTextarea",
    "  control={form.control}",
    '  fieldName="value"',
    `  label="${cfg.label}"`,
  ];
  if (cfg.placeholder != null && cfg.placeholder !== "")
    lines.push(`  placeholder="${cfg.placeholder}"`);
  if (cfg.description != null) {
    if (Array.isArray(cfg.description)) {
      const descArray = cfg.description.map((d) => `"${d}"`).join(", ");
      lines.push(`  description={[${descArray}]}`);
    } else if (cfg.description !== "") {
      lines.push(`  description="${cfg.description}"`);
    }
  }
  if (cfg.required === true) lines.push("  isRequired");
  if (cfg.hintTooltip != null && cfg.hintTooltip !== "")
    lines.push(`  hintTooltip="${cfg.hintTooltip}"`);
  if (cfg.inputSize != null) {
    if (cfg.inputSize === "md") {
      // Default, can omit
    } else {
      lines.push(`  inputSize="${cfg.inputSize}"`);
    }
  }
  if (cfg.rows != null) {
    lines.push(`  rows={${String(cfg.rows)}}`);
  }
  if (cfg.maxLength != null) {
    lines.push(`  maxLength={${String(cfg.maxLength)}}`);
  }
  lines.push("/>");

  if (cfg.showCharCount === true && cfg.maxLength != null) {
    lines.push("");
    lines.push("/* Optional character counter */");
    lines.push(
      '<div className="text-right text-sm text-greyscale-text-caption">'
    );
    lines.push(
      `  {(form.watch("value") ?? "").length} / ${String(cfg.maxLength)} characters`
    );
    lines.push("</div>");
  }

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
    title: cfg.label,
    description: descText,
    code: buildFormUsageCode(cfg),
    preview: (
      <SingleFieldForm
        key={cfg.label}
        label={cfg.label}
        required={cfg.required === true}
        description={cfg.description}
        hintTooltip={cfg.hintTooltip}
        inputSize={cfg.inputSize}
        placeholder={cfg.placeholder}
        rows={cfg.rows}
        maxLength={cfg.maxLength}
        minLength={cfg.minLength}
        showCharCount={cfg.showCharCount}
      />
    ),
  };
});

/* ------------------------- Course Description Example ------------------------ */
const CourseDescriptionForm = () => {
  const schema = z.object({
    description: z
      .string()
      .min(16, "Description must be at least 16 characters")
      .max(400, "Description must be no more than 400 characters"),
  });

  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { description: "" },
    mode: "onTouched",
  });

  const onSubmit = (vals: Values) => {
    // eslint-disable-next-line no-console
    console.log("[Course Description]", vals);
    toast.success("Course description submitted!");
  };

  const currentLength = form.watch("description").length;

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormTextarea
            control={form.control}
            fieldName="description"
            label="Course Description"
            placeholder="Provide a brief description of the course content and objectives..."
            inputSize="sm"
            rows={4}
            maxLength={400}
            isRequired
            description="A concise description helps students understand what they'll learn."
          />
          <div className="text-right text-sm text-greyscale-text-caption">
            {currentLength} / 400 characters
          </div>
          <FormActions formState={form.formState} />
        </form>
      </Form>
    </Card>
  );
};

const courseDescriptionExample = {
  title: "Real-World Example: Course Description",
  description:
    "From the Course Editor - a textarea with character count and validation (16-400 chars).",
  code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

const schema = z.object({
  description: z
    .string()
    .min(16, "Description must be at least 16 characters")
    .max(400, "Description must be no more than 400 characters"),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { description: "" },
  mode: "onTouched",
});

const currentLength = form.watch("description")?.length ?? 0;

<FormTextarea
  control={form.control}
  fieldName="description"
  label="Course Description"
  placeholder="Provide a brief description..."
  inputSize="sm"
  rows={4}
  maxLength={400}
  isRequired
  description="A concise description helps students understand what they'll learn."
/>
<div className="text-right text-sm text-greyscale-text-caption">
  {currentLength} / 400 characters
</div>`,
  preview: <CourseDescriptionForm />,
};

const allFormExamples = [...formExamples, courseDescriptionExample];

export const FormTextareaDemo = () => (
  <ComponentDemo
    componentName="Textarea"
    description="Multi-line text input primitive and form-integrated composite variant."
    props={standaloneTextareaProps}
    examples={primitiveExamples}
    formProps={formTextareaProps}
    formExamples={allFormExamples}
  />
);

export default FormTextareaDemo;
