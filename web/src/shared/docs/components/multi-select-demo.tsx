import { zodResolver } from "@hookform/resolvers/zod";
import { mdiAccount, mdiStar, mdiHeart, mdiHome } from "@mdi/js";
import Icon from "@mdi/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { Card } from "@/shared/components/shadcn/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/shadcn/form";
import {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectGroup,
} from "@/shared/components/shadcn/multi-select";

import { ComponentDemo } from "./component-demo";

/* ----------------------- MultiSelect Props ----------------------- */
const multiSelectProps = [
  {
    name: "options",
    type: "MultiSelectOption[] | MultiSelectGroup[]",
    description: "Array of options or grouped options to display.",
  },
  {
    name: "onValueChange",
    type: "(value: string[]) => void",
    description: "Callback triggered when selected values change.",
  },
  {
    name: "defaultValue",
    type: "string[]",
    description: "Initial selected values when component mounts.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select options"',
    description: "Placeholder text when no values are selected.",
  },
  {
    name: "variant",
    type: '"default" | "secondary" | "destructive" | "error" | "inverted"',
    default: '"default"',
    description: "Visual style variant for badges.",
  },
  {
    name: "maxCount",
    type: "number",
    default: "3",
    description: "Maximum number of items to display before summarizing.",
  },
  {
    name: "searchable",
    type: "boolean",
    default: "true",
    description: "Shows/hides search functionality in the popover.",
  },
  {
    name: "hideSelectAll",
    type: "boolean",
    default: "false",
    description: "If true, disables the select all functionality.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "If true, disables the component completely.",
  },
  {
    name: "closeOnSelect",
    type: "boolean",
    default: "false",
    description: "Automatically closes popover after selecting an option.",
  },
  {
    name: "emptyIndicator",
    type: "ReactNode",
    description: "Custom message when no options match search.",
  },
  {
    name: "animation",
    type: "number",
    default: "0",
    description: "Animation duration in seconds for visual effects.",
  },
  {
    name: "animationConfig",
    type: "AnimationConfig",
    description: "Advanced animation configuration for different parts.",
  },
  {
    name: "autoSize",
    type: "boolean",
    default: "false",
    description: "Allows component to grow/shrink with content.",
  },
  {
    name: "singleLine",
    type: "boolean",
    default: "false",
    description: "Shows badges in single line with horizontal scroll.",
  },
  {
    name: "responsive",
    type: "boolean | ResponsiveConfig",
    description: "Responsive configuration for different screen sizes.",
  },
  {
    name: "minWidth",
    type: "string",
    description: "Minimum width for the component.",
  },
  {
    name: "maxWidth",
    type: "string",
    description: "Maximum width for the component.",
  },
];

/* ----------------------- Sample Data ----------------------- */
const sampleOptions: MultiSelectOption[] = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Option 4", value: "4" },
  { label: "Option 5", value: "5" },
];

const iconOptions: MultiSelectOption[] = [
  {
    label: "Profile",
    value: "profile",
    icon: ({ className }) => <Icon path={mdiAccount} className={className} />,
  },
  {
    label: "Favorites",
    value: "favorites",
    icon: ({ className }) => <Icon path={mdiStar} className={className} />,
  },
  {
    label: "Liked",
    value: "liked",
    icon: ({ className }) => <Icon path={mdiHeart} className={className} />,
  },
  {
    label: "Home",
    value: "home",
    icon: ({ className }) => <Icon path={mdiHome} className={className} />,
  },
];

const groupedOptions: MultiSelectGroup[] = [
  {
    heading: "Fruits",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Orange", value: "orange" },
    ],
  },
  {
    heading: "Vegetables",
    options: [
      { label: "Carrot", value: "carrot" },
      { label: "Broccoli", value: "broccoli" },
      { label: "Spinach", value: "spinach" },
    ],
  },
];

const disabledOptions: MultiSelectOption[] = [
  { label: "Available", value: "available" },
  { label: "Disabled", value: "disabled", disabled: true },
  { label: "Also Available", value: "also-available" },
];

/* ----------------------- Primitive Examples ----------------------- */
const primitiveExamples = [
  {
    title: "Basic Usage",
    description: "Simple multi-select with default configuration.",
    code: `const [selected, setSelected] = useState<string[]>([]);

<MultiSelect
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ]}
  onValueChange={setSelected}
  placeholder="Select options"
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={sampleOptions}
          onValueChange={(values) => {
            // eslint-disable-next-line no-console
            console.log("Selected:", values);
          }}
          placeholder="Select options"
        />
      </div>
    ),
  },
  {
    title: "With Icons",
    description: "Multi-select with icons for each option.",
    code: `<MultiSelect
  options={[
    { 
      label: "Profile", 
      value: "profile",
      icon: ({ className }) => <Icon path={mdiAccount} className={className} />
    },
    { 
      label: "Favorites", 
      value: "favorites",
      icon: ({ className }) => <Icon path={mdiStar} className={className} />
    },
  ]}
  onValueChange={setSelected}
  placeholder="Select with icons"
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={iconOptions}
          onValueChange={(values) => {
            // eslint-disable-next-line no-console
            console.log("Selected:", values);
          }}
          placeholder="Select with icons"
        />
      </div>
    ),
  },
  {
    title: "Grouped Options",
    description: "Organize options into groups with headings.",
    code: `<MultiSelect
  options={[
    {
      heading: "Fruits",
      options: [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
      ],
    },
    {
      heading: "Vegetables",
      options: [
        { label: "Carrot", value: "carrot" },
        { label: "Broccoli", value: "broccoli" },
      ],
    },
  ]}
  onValueChange={setSelected}
  placeholder="Select grouped items"
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={groupedOptions}
          onValueChange={(values) => {
            // eslint-disable-next-line no-console
            console.log("Selected:", values);
          }}
          placeholder="Select grouped items"
        />
      </div>
    ),
  },
  {
    title: "Variants",
    description: "Different visual styles for badges.",
    code: `<MultiSelect variant="default" ... />
<MultiSelect variant="secondary" ... />
<MultiSelect variant="destructive" ... />
<MultiSelect variant="error" ... />`,
    preview: (
      <div className="flex flex-col gap-3">
        <MultiSelect
          options={sampleOptions.slice(0, 3)}
          onValueChange={() => {}}
          placeholder="Default variant"
          defaultValue={["1", "2"]}
        />
        <MultiSelect
          options={sampleOptions.slice(0, 3)}
          onValueChange={() => {}}
          placeholder="Secondary variant"
          variant="secondary"
          defaultValue={["1", "2"]}
        />
        <MultiSelect
          options={sampleOptions.slice(0, 3)}
          onValueChange={() => {}}
          placeholder="Destructive variant"
          variant="destructive"
          defaultValue={["1", "2"]}
        />
        <MultiSelect
          options={sampleOptions.slice(0, 3)}
          onValueChange={() => {}}
          placeholder="Error variant"
          variant="error"
          defaultValue={["1", "2"]}
        />
      </div>
    ),
  },
  {
    title: "Disabled Options",
    description: "Some options can be disabled individually.",
    code: `<MultiSelect
  options={[
    { label: "Available", value: "available" },
    { label: "Disabled", value: "disabled", disabled: true },
    { label: "Also Available", value: "also-available" },
  ]}
  onValueChange={setSelected}
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={disabledOptions}
          onValueChange={(values) => {
            // eslint-disable-next-line no-console
            console.log("Selected:", values);
          }}
          placeholder="Try selecting disabled option"
        />
      </div>
    ),
  },
  {
    title: "Max Count & Display",
    description: "Limit displayed badges, summarize extras.",
    code: `<MultiSelect
  options={options}
  onValueChange={setSelected}
  maxCount={2}
  defaultValue={["1", "2", "3", "4"]}
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={sampleOptions}
          onValueChange={() => {}}
          maxCount={2}
          defaultValue={["1", "2", "3", "4"]}
          placeholder="Max 2 displayed"
        />
      </div>
    ),
  },
  {
    title: "Close on Select",
    description: "Automatically close popover after selection.",
    code: `<MultiSelect
  options={options}
  onValueChange={setSelected}
  closeOnSelect
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={sampleOptions}
          onValueChange={(values) => {
            // eslint-disable-next-line no-console
            console.log("Selected:", values);
          }}
          closeOnSelect
          placeholder="Closes after each selection"
        />
      </div>
    ),
  },
  {
    title: "No Search",
    description: "Disable search functionality.",
    code: `<MultiSelect
  options={options}
  onValueChange={setSelected}
  searchable={false}
/>`,
    preview: (
      <div className="max-w-sm">
        <MultiSelect
          options={sampleOptions}
          onValueChange={(values) => {
            // eslint-disable-next-line no-console
            console.log("Selected:", values);
          }}
          searchable={false}
          placeholder="No search available"
        />
      </div>
    ),
  },
];

/* ----------------------- Form Examples ----------------------- */
interface MultiSelectFormProps {
  label: string;
  options: MultiSelectOption[] | MultiSelectGroup[];
  required?: boolean;
  maxCount?: number;
  variant?: "default" | "secondary" | "destructive" | "error";
  hideSelectAll?: boolean;
  closeOnSelect?: boolean;
}

const MultiSelectForm = ({
  label,
  options,
  required,
  maxCount,
  variant,
  hideSelectAll,
  closeOnSelect,
}: MultiSelectFormProps) => {
  const schema = z.object({
    selected: required
      ? z.array(z.string()).min(1, "Please select at least one option")
      : z.array(z.string()),
  });

  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { selected: [] },
    mode: "onTouched",
  });

  const onSubmit = (vals: Values) => {
    // eslint-disable-next-line no-console
    console.log(`[${label}]`, vals);
    toast.success(`${label}: ${vals.selected.length} items selected`);
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="selected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <MultiSelect
                  options={options}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  variant={variant}
                  maxCount={maxCount}
                  hideSelectAll={hideSelectAll}
                  closeOnSelect={closeOnSelect}
                />
                {form.formState.errors.selected && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.selected.message}
                  </p>
                )}
              </FormItem>
            )}
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

const formExampleConfigs: MultiSelectFormProps[] = [
  {
    label: "Basic Form Field",
    options: sampleOptions,
  },
  {
    label: "Required Selection",
    options: sampleOptions,
    required: true,
  },
  {
    label: "With Icons",
    options: iconOptions,
    maxCount: 2,
  },
  {
    label: "Grouped Options",
    options: groupedOptions,
    hideSelectAll: true,
  },
  {
    label: "Error Variant",
    options: sampleOptions,
    variant: "error",
    required: true,
  },
  {
    label: "Close on Select",
    options: sampleOptions,
    closeOnSelect: true,
  },
];

const formExamples = formExampleConfigs.map((cfg) => ({
  title: cfg.label,
  description: cfg.required
    ? "Validation enforced via schema"
    : "Optional multi-select field",
  code: `<FormField
  control={form.control}
  name="selected"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${cfg.label}</FormLabel>
      <MultiSelect
        options={options}
        onValueChange={field.onChange}
        defaultValue={field.value}${cfg.variant ? `\n        variant="${cfg.variant}"` : ""}${cfg.maxCount ? `\n        maxCount={${cfg.maxCount}}` : ""}${cfg.hideSelectAll ? `\n        hideSelectAll` : ""}${cfg.closeOnSelect ? `\n        closeOnSelect` : ""}
      />
    </FormItem>
  )}
/>`,
  preview: <MultiSelectForm key={cfg.label} {...cfg} />,
}));

export const MultiSelectDemo = () => (
  <ComponentDemo
    componentName="MultiSelect"
    description="A fully-featured multi-select component with search, grouping, icons, and animations."
    props={multiSelectProps}
    examples={primitiveExamples}
    formExamples={formExamples}
  />
);

export default MultiSelectDemo;
