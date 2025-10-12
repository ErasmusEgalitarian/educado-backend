import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { FormSelect } from "@/shared/components/form/form-select";
import { Card } from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/shared/components/shadcn/select";

import { ComponentDemo } from "./component-demo";

/* ----------------------- Select Props (Primitive) ----------------------- */
const selectPrimitiveProps = [
  {
    name: "value",
    type: "string",
    description: "The controlled value of the select.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback triggered when the selected value changes.",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "The default selected value when component mounts.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "If true, disables the select component.",
  },
  {
    name: "name",
    type: "string",
    description: "The name of the select (for form submission).",
  },
];

/* ----------------------- SelectTrigger Props ----------------------- */
const selectTriggerProps = [
  {
    name: "size",
    type: '"xs" | "sm" | "md" | "lg"',
    default: '"md"',
    description: "Controls the size of the select trigger.",
  },
  {
    name: "variant",
    type: '"default" | "error"',
    default: '"default"',
    description: "Visual style variant for the select trigger.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply.",
  },
];

/* ----------------------- FormSelect Props ----------------------- */
const formSelectProps = [
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
    description: "Visible label text for the select field.",
  },
  {
    name: "options",
    type: "Option[]",
    description: "Array of options with label and value properties.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Choose..."',
    description: "Placeholder text when no value is selected.",
  },
  {
    name: "inputSize",
    type: '"xs" | "sm" | "md" | "lg"',
    default: '"md"',
    description: "Scales label, control and description typography & spacing.",
  },
  {
    name: "isRequired",
    type: "boolean",
    description: "Adds visual + aria required indicators.",
  },
  {
    name: "description",
    type: "string | string[]",
    description: "Helper text or bullet list (array renders as list).",
  },
  {
    name: "hintTooltip",
    type: "string",
    description: "Shows an info icon with provided tooltip content.",
  },
  {
    name: "wrapperClassName",
    type: "string",
    description: "Custom classes applied to the wrapper FormItem container.",
  },
];

/* ----------------------- Sample Data ----------------------- */
interface Option {
  label: string;
  value: string;
}

const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Mango", value: "mango" },
  { label: "Grape", value: "grape" },
];

const countries: Option[] = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "Germany", value: "de" },
];

const priorities: Option[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

/* ----------------------- Primitive Examples ----------------------- */
const primitiveExamples = [
  {
    title: "Basic Usage",
    description: "Simple select with default configuration.",
    code: `const [value, setValue] = useState("");

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>`,
    preview: (
      <div className="max-w-sm">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {fruits.map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "All supported size variants (xs, sm, md, lg).",
    code: `<SelectTrigger size="xs">...</SelectTrigger>
<SelectTrigger size="sm">...</SelectTrigger>
<SelectTrigger size="md">...</SelectTrigger>
<SelectTrigger size="lg">...</SelectTrigger>`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Select>
          <SelectTrigger size="xs">
            <SelectValue placeholder="Extra Small" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="md">
            <SelectValue placeholder="Medium (Default)" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="lg">
            <SelectValue placeholder="Large" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    title: "Variants",
    description: "Default and error variants.",
    code: `<SelectTrigger variant="default">...</SelectTrigger>
<SelectTrigger variant="error">...</SelectTrigger>`,
    preview: (
      <div className="flex flex-col gap-3 max-w-sm">
        <Select>
          <SelectTrigger variant="default">
            <SelectValue placeholder="Default variant" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger variant="error">
            <SelectValue placeholder="Error variant" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    title: "Disabled State",
    description: "Disabled select component.",
    code: `<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="item">Item</SelectItem>
  </SelectContent>
</Select>`,
    preview: (
      <div className="max-w-sm">
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
          <SelectContent>
            {fruits.slice(0, 3).map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    title: "Grouped Options",
    description: "Organize options into groups with labels.",
    code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="broccoli">Broccoli</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
    preview: (
      <div className="max-w-sm">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select food" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
              <SelectItem value="spinach">Spinach</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    title: "With Default Value",
    description: "Pre-selected value on mount.",
    code: `<Select defaultValue="banana">
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>`,
    preview: (
      <div className="max-w-sm">
        <Select defaultValue="banana">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {fruits.map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
  },
];

/* ----------------------- Form Examples ----------------------- */
interface SelectFormProps {
  label: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  inputSize?: "xs" | "sm" | "md" | "lg";
  description?: string | string[];
  hintTooltip?: string;
}

const SelectForm = ({
  label,
  options,
  required,
  placeholder = "Choose...",
  inputSize = "md",
  description,
  hintTooltip,
}: SelectFormProps) => {
  const schema = z.object({
    value: required
      ? z.string().min(1, "Please select an option")
      : z.string().optional(),
  });

  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
    mode: "onTouched",
  });

  const onSubmit = (vals: Values) => {
    // eslint-disable-next-line no-console
    console.log(`[${label}]`, vals);
    toast.success(`${label}: ${vals.value || "No value"} selected`);
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <FormSelect
            control={form.control}
            fieldName="value"
            label={label}
            options={options}
            placeholder={placeholder}
            inputSize={inputSize}
            isRequired={required}
            description={description}
            hintTooltip={hintTooltip}
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

const formExampleConfigs: SelectFormProps[] = [
  {
    label: "Basic Select",
    options: fruits,
    placeholder: "Select a fruit",
  },
  {
    label: "Required Field",
    options: countries,
    required: true,
    placeholder: "Select a country",
    description: "Validation enforced via schema. The prop is only cosmetic.",
  },
  {
    label: "With Hint",
    options: priorities,
    placeholder: "Select priority",
    hintTooltip: "Choose the priority level for this task",
    description: "Includes tooltip hint next to the label",
  },
  {
    label: "Bullet Description",
    options: fruits,
    placeholder: "Pick your favorite",
    description: ["Fresh and organic", "Locally sourced", "Seasonal variety"],
  },
  {
    label: "Extra Small Size",
    options: priorities,
    inputSize: "xs",
    placeholder: "XS sized",
    description: "Tiny form control variant",
  },
  {
    label: "Small Size",
    options: countries,
    inputSize: "sm",
    placeholder: "Small sized",
    description: "Compact label, select & description",
  },
  {
    label: "Medium Size",
    options: fruits,
    inputSize: "md",
    placeholder: "Medium sized (default)",
    description: "Standard label, select & description",
  },
  {
    label: "Large Size",
    options: priorities,
    inputSize: "lg",
    placeholder: "Large sized",
    description: "Enlarged label, select & description",
  },
];

const buildFormUsageCode = (cfg: SelectFormProps) => {
  const lines: string[] = [
    "<FormSelect",
    "  control={form.control}",
    '  fieldName="value"',
    `  label="${cfg.label}"`,
    `  options={options}`,
  ];
  if (cfg.placeholder) lines.push(`  placeholder="${cfg.placeholder}"`);
  if (cfg.description) {
    if (Array.isArray(cfg.description)) {
      const arr = cfg.description.map((d) => `"${d}"`).join(", ");
      lines.push(`  description={[${arr}]}`);
    } else {
      lines.push(`  description="${cfg.description}"`);
    }
  }
  if (cfg.required) lines.push("  isRequired");
  if (cfg.hintTooltip) lines.push(`  hintTooltip="${cfg.hintTooltip}"`);
  if (cfg.inputSize && cfg.inputSize !== "md") {
    lines.push(`  inputSize="${cfg.inputSize}"`);
  }
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
    title: cfg.label,
    description: descText,
    code: buildFormUsageCode(cfg),
    preview: <SelectForm key={cfg.label} {...cfg} />,
  };
});

export const SelectDemo = () => (
  <ComponentDemo
    componentName="Select"
    description="A dropdown select component for single-value selection with form integration."
    props={selectPrimitiveProps}
    examples={primitiveExamples}
    formProps={formSelectProps}
    formExamples={formExamples}
    additionalProps={selectTriggerProps}
    additionalPropsTitle="SelectTrigger Props"
  />
);

export default SelectDemo;
