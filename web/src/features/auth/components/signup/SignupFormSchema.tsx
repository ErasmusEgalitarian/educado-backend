import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TypeOf, z } from "zod";

import { EDUCATION_OPTIONS } from "@/auth/constants/educationOptions";
import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Checkbox } from "@/shared/components/shadcn/checkbox";
import { Form, FormItem } from "@/shared/components/shadcn/form";

const maxChars = 400;
const STATUS = ["YES", "NO"] as const;
const STATUS_OPTIONS = STATUS.map((type) => ({
  value: type,
  label: type,
}));

// Submit handler with inferred data shape from the schema.
async function onSubmit(values: z.infer<typeof formSchema>) {
  // eslint-disable-next-line no-console
  console.log(values);
  await new Promise((r) => setTimeout(r, 2000));
  toast.success("Submitted values: " + JSON.stringify(values));
}

// Define the Zod schema for validation and form data shape.
const formSchema = z.object({
  motivation: z.string().min(0),
  educationType: z.string().min(0),
  isInProgress: z.string().min(0),
  course: z.string().min(0),
  institution: z.string().min(0),
  acedemicStartDate: z.string().min(0),
  acedemicEndDate: z.string().min(0),
  organization: z.string().min(0),
  jobTitle: z.string().min(0),
  jobStartDate: z.string().min(0),
  jobEndDate: z.string().min(0),
  description: z.string().min(0),
});

export const MotivationForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivation: "",
    },
    mode: "onTouched",
  });
  const currentLength = form.watch("motivation").length;
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
      >
        <FormTextarea
          control={form.control}
          fieldName="motivation"
          placeholder="Escreva aqui por que você quer fazer parte do projeto"
          rows={3}
          maxLength={maxChars}
          className="resize-none"
        />
        <div
          className="text-right font-normal font-['Montserrat'] text-greyscale-text-caption py-2"
          style={{ fontSize: "14px", lineHeight: "17px" }}
        >
          {currentLength} / {maxChars} caracteres
        </div>
      </form>
    </Form>
  );
};

// The form component itself
export const EducationForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationType: "",
      isInProgress: "",
      course: "",
      institution: "",
      acedemicStartDate: "",
      acedemicEndDate: "",
    },
    mode: "onTouched",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4 grid grid-cols-2 gap-x-6"
      >
        <FormSelect
          control={form.control}
          fieldName="educationType"
          label="Formação"
          options={EDUCATION_OPTIONS}
          placeholder="Superior"
          isRequired
          wrapperClassName="[&_[role=combobox]]:h-[59px]"
        />
        <FormSelect
          control={form.control}
          fieldName="isInProgress"
          label="Status"
          options={STATUS_OPTIONS}
          placeholder="Em andamento"
          isRequired
          wrapperClassName="[&_[role=combobox]]:h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="course"
          placeholder="Curso"
          label="Curso"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="institution"
          placeholder="Instituição"
          label="Instituição"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="acedemicStartDate"
          placeholder="Mês / Ano"
          label="Início"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="acedemicEndDate"
          placeholder="Mês / Ano"
          label="Fim"
          isRequired
          className="h-[59px]"
        />
      </form>
    </Form>
  );
};

export const ExperienceForm = () => {
  // Initialize the form with React Hook Form and Zod resolver.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      jobTitle: "",
      jobStartDate: "",
      jobEndDate: "",
      description: "",
    },
    mode: "onTouched",
  });

  const currentLength = form.watch("description").length;

  const [checked, setChecked] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4 grid grid-cols-2 gap-x-6"
      >
        {/* Single reusable FormInput component */}
        <FormInput
          control={form.control}
          fieldName="organization"
          placeholder="Mobile Education"
          label="Empresa"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="jobTitle"
          placeholder="Product Designer"
          label="Cargo"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="jobStartDate"
          placeholder="Mês / Ano"
          label="Início"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="jobEndDate"
          placeholder="Mês / Ano"
          label="Fim"
          isRequired
          className="h-[59px]"
        />
        <div className="col-start-2 flex items-center gap-2 pr-1">
          <Checkbox
            id="agree"
            checked={checked}
            onCheckedChange={(value) => {
              setChecked(value === true);
            }}
            className="border-primary-border-lighter data-[state=checked]:bg-primary-surface-default data-[state=checked]:border-primary-border-lighter"
          />
          <label
            htmlFor="agree"
            className="font-['Montserrat'] font-normal text-greyscale-text-body cursor-pointer"
            style={{ fontSize: "16px", lineHeight: "20.8px" }}
          >
            Meu emprego atual
          </label>
        </div>
      </form>
      <FormTextarea
        control={form.control}
        fieldName="description"
        placeholder="Escreva aqui as suas responsabilidades"
        label="Descrição das atividades"
        rows={3}
        maxLength={maxChars}
        className="resize-none"
      />
      <div
        className="text-right font-normal font-['Montserrat'] text-greyscale-text-caption py-2"
        style={{ fontSize: "14px", lineHeight: "17px" }}
      >
        {currentLength} / {maxChars} caracteres
      </div>
    </Form>
  );
};
