import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { TypeOf, z } from "zod";

import { EDUCATION_OPTIONS } from "@/auth/constants/educationOptions";
// FormActions is provided by the parent form container; child components do not need it here
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

// Note: the parent container should provide a single useForm instance via
// FormProvider. The child form components below use useFormContext() to
// access the shared methods.

export const MotivationForm = () => {
  const { control, watch } = useFormContext();
  const currentLength = (watch("motivation") as string | undefined)?.length ?? 0;
  return (
    <div>
        <FormTextarea
          control={control}
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
    </div>
  );
};

// The form component itself
export const EducationForm = () => {
  const { control, watch } = useFormContext();

  return (
    // two-column layout: inputs occupy two columns, spacing matches previous layout
    <div className="space-y-4 grid grid-cols-2 gap-x-6">
      <FormSelect
        control={control}
        fieldName="educationType"
        label="Formação"
        options={EDUCATION_OPTIONS}
        placeholder="Superior"
        isRequired
        wrapperClassName="[&_[role=combobox]]:h-[59px]"
      />
      <FormSelect
        control={control}
        fieldName="isInProgress"
        label="Status"
        options={STATUS_OPTIONS}
        placeholder="Em andamento"
        isRequired
        wrapperClassName="[&_[role=combobox]]:h-[59px]"
      />
      <FormInput
        control={control}
        fieldName="course"
        placeholder="Curso"
        label="Curso"
        isRequired
        className="h-[59px]"
      />
      <FormInput
        control={control}
        fieldName="institution"
        placeholder="Instituição"
        label="Instituição"
        isRequired
        className="h-[59px]"
      />
      <FormInput
        control={control}
        fieldName="acedemicStartDate"
        placeholder="Mês / Ano"
        label="Início"
        isRequired
        className="h-[59px]"
      />
      <FormInput
        control={control}
        fieldName="acedemicEndDate"
        placeholder="Mês / Ano"
        label="Fim"
        isRequired
        className="h-[59px]"
      />
    </div>
  );
};

export const ExperienceForm = () => {
  const { control, watch } = useFormContext();
  const currentLength = (watch("description") as string | undefined)?.length ?? 0;
  const [checked, setChecked] = useState(false);

  return (
    <div>
      {/* Two-column grid for the top inputs */}
      <div className="space-y-4 grid grid-cols-2 gap-x-6">
        <FormInput
          control={control}
          fieldName="organization"
          placeholder="Mobile Education"
          label="Empresa"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={control}
          fieldName="jobTitle"
          placeholder="Product Designer"
          label="Cargo"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={control}
          fieldName="jobStartDate"
          placeholder="Mês / Ano"
          label="Início"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={control}
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

        {/* Description should span both columns */}
        <div className="col-span-2">
          <FormTextarea
            control={control}
            fieldName="description"
            placeholder="Escreva aqui as suas responsabilidades"
            label="Descrição das atividades"
            rows={3}
            maxLength={maxChars}
            className="resize-none"
          />
        </div>
      </div>

      <div
        className="text-right font-normal font-['Montserrat'] text-greyscale-text-caption py-2"
        style={{ fontSize: "14px", lineHeight: "17px" }}
      >
        {currentLength} / {maxChars} caracteres
      </div>
    </div>
  );
};
