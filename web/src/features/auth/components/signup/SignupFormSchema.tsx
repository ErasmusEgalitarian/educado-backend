import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Checkbox } from "@/shared/components/shadcn/checkbox";
import { Form } from "@/shared/components/shadcn/form";

const maxChars = 400;

// Submit handler with inferred data shape from the schema.
async function onSubmit(values: z.infer<typeof formSchema>) {
  // eslint-disable-next-line no-console
  console.log(values);
  await new Promise((r) => setTimeout(r, 2000));
  toast.success("Submitted values: " + JSON.stringify(values));
}

// Define the Zod schema for validation and form data shape.
const formSchema = z.object({
  formação: z.string().min(0),
  curso: z.string().min(0),
  início: z.string().min(0),
  status: z.string().min(0),
  instituição: z.string().min(0),
  fim: z.string().min(0),
  empresa: z.string().min(0),
  cargo: z.string().min(0),
  descrição: z.string().min(0),
});

// The form component itself
export const EducationForm = () => {
  // Initialize the form with React Hook Form and Zod resolver.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formação: "",
      curso: "",
      início: "",
      status: "",
      instituição: "",
      fim: "",
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
        {/* Single reusable FormInput component */}
        <FormInput
          control={form.control}
          fieldName="formação"
          title="Formação"
          placeholder="Superior"
          label="Formação"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="status"
          title="Status"
          placeholder="Em andamento"
          label="Status"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="curso"
          title="Curso"
          placeholder="Curso"
          label="Curso"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="instituição"
          title="Instituição"
          placeholder="Instituição"
          label="Instituição"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="início"
          title="Início"
          placeholder="Mês / Ano"
          label="Início"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="fim"
          title="Fim"
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
      empresa: "",
      cargo: "",
      início: "",
      fim: "",
      descrição: "",
    },
    mode: "onTouched",
  });

  const currentLength = form.watch("descrição").length;

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
          fieldName="empresa"
          title="Empresa"
          placeholder="Mobile Education"
          label="Empresa"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="cargo"
          title="Cargo"
          placeholder="Product Designer"
          label="Cargo"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="início"
          title="Início"
          placeholder="Mês / Ano"
          label="Início"
          isRequired
          className="h-[59px]"
        />
        <FormInput
          control={form.control}
          fieldName="fim"
          title="Fim"
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
            I agree to sell my soul
          </label>
        </div>
      </form>
      <FormTextarea
        control={form.control}
        fieldName="descrição"
        placeholder="Escreva aqui as suas responsabilidades"
        label="Descrição das atividades"
        rows={3}
        maxLength={maxChars}
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
