import { useState, useEffect, useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/shadcn/button";
import deleteIcon from "@/shared/assets/delete 1.svg";
import plusIcon from "@/shared/assets/plus 2.svg";

import { EDUCATION_OPTIONS } from "@/auth/constants/educationOptions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Checkbox } from "@/shared/components/shadcn/checkbox";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/shared/components/shadcn/card";

const maxChars = 400;
const STATUS = ["In Progress", "Finished"] as const;
const STATUS_OPTIONS = STATUS.map((type) => ({
  value: type,
  label: type,
}));

const educationSchema = z.object({
  educationType: z.string().min(0),
  isInProgress: z.string().min(0),
  course: z.string().min(0),
  institution: z.string().min(0),
  acedemicStartDate: z.string().min(0),
  acedemicEndDate: z.string().min(0),
});

const jobSchema = z.object({
  organization: z.string().min(0),
  jobTitle: z.string().min(0),
  jobStartDate: z.string().min(0),
  jobEndDate: z.string().min(0),
  description: z.string().min(0),
});

// Define the Zod schema for validation and form data shape.
export const formSchema = z.object({
  motivation: z.string().min(0),
  educations: z.array(educationSchema).min(1),
  jobs: z.array(jobSchema).min(1),
});

// Note: the parent container should provide a single useForm instance via
// FormProvider. The child form components below use useFormContext() to
// access the shared methods.

export const MotivationForm = () => {
  const { control, watch } = useFormContext();
  const currentLength =
    (watch("motivation") as string | undefined)?.length ?? 0;
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

// The education form component
export const EducationForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && fields.length === 0) {
      initializedRef.current = true;
      append({
        educationType: "",
        isInProgress: "",
        course: "",
        institution: "",
        acedemicStartDate: "",
        acedemicEndDate: "",
      });
    }
  }, [fields.length, append]);

  return (
    <>
      {fields.map((field, index) => (
        <Card key={field.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-greyscale-text-caption font-bold font-['Montserrat']">
              {`Experincia acedmica ${index + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 grid grid-cols-2 gap-x-6">
              <FormSelect
                control={control}
                fieldName={`educations.${index}.educationType`}
                label="Formação"
                options={EDUCATION_OPTIONS}
                placeholder="Superior"
                isRequired
                wrapperClassName="[&_[role=combobox]]:h-[59px]"
              />

              <FormSelect
                control={control}
                fieldName={`educations.${index}.isInProgress`}
                label="Status"
                options={STATUS_OPTIONS}
                placeholder="Em andamento"
                isRequired
                wrapperClassName="[&_[role=combobox]]:h-[59px]"
              />

              <FormInput
                control={control}
                fieldName={`educations.${index}.course`}
                placeholder="Curso"
                label="Curso"
                isRequired
                className="h-[59px]"
              />

              <FormInput
                control={control}
                fieldName={`educations.${index}.institution`}
                placeholder="Instituição"
                label="Instituição"
                isRequired
                className="h-[59px]"
              />

              <FormInput
                control={control}
                fieldName={`educations.${index}.acedemicStartDate`}
                placeholder="Mês / Ano"
                label="Início"
                isRequired
                className="h-[59px]"
              />

              <FormInput
                control={control}
                fieldName={`educations.${index}.acedemicEndDate`}
                placeholder="Mês / Ano"
                label="Fim"
                isRequired
                className="h-[59px]"
              />
              <div className="pb-2 col-span-2 text-right">
                <CardFooter className="justify-end col-start-2 p-0">
                  <Button
                    variant="link"
                    className=" text-error-surface-default font-['Montserrat'] font-bold p-0"
                    style={{ fontSize: "14px", lineHeight: "17px" }}
                    onClick={() => remove(index)}
                  >
                    <img src={deleteIcon} /> Remover formação
                  </Button>
                </CardFooter>
              </div>
            </div>
            <hr className="border border-greyscale-border-lighter" />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center items-center pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() =>
            append({
              educationType: "",
              isInProgress: "",
              course: "",
              institution: "",
              acedemicStartDate: "",
              acedemicEndDate: "",
            })
          }
        >
          <img src={plusIcon} /> Adicionar outra formação
        </Button>
      </div>
    </>
  );
};

export const ExperienceForm = () => {
  const { control, watch } = useFormContext();
  const currentLength =
    (watch(`jobs.0.description`) as string | undefined)?.length ?? 0;
  const [checked, setChecked] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jobs",
  });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && fields.length === 0) {
      initializedRef.current = true;
      append({
        organization: "",
        jobTitle: "",
        jobStartDate: "",
        jobEndDate: "",
        description: "",
      });
    }
  }, [fields.length, append]);

  return (
    <>
      {fields.map((field, index) => (
        <Card key={field.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-greyscale-text-caption font-bold font-['Montserrat']">{`Experiência profissional ${index + 1}`}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 grid grid-cols-2 gap-x-6">
              <FormInput
                control={control}
                fieldName={`jobs.${index}.orginization`}
                placeholder="Mobile Education"
                label="Empresa"
                isRequired
                className="h-[59px]"
              />
              <FormInput
                control={control}
                fieldName={`jobs.${index}.jobTitle`}
                placeholder="Product Designer"
                label="Cargo"
                isRequired
                className="h-[59px]"
              />
              <FormInput
                control={control}
                fieldName={`jobs.${index}.jobStartDate`}
                placeholder="Mês / Ano"
                label="Início"
                isRequired
                className="h-[59px]"
              />
              <FormInput
                control={control}
                fieldName={`jobs.${index}.jobEndDate`}
                placeholder="Mês / Ano"
                label="Fim"
                isRequired
                className="h-[59px]"
              />

              <div className="col-start-2 flex items-center gap-2 pr-1">
                <Checkbox
                  id={`agree-${index}`}
                  checked={checked}
                  onCheckedChange={(value) => {
                    setChecked(value === true);
                  }}
                  className="border-primary-border-lighter data-[state=checked]:bg-primary-surface-default data-[state=checked]:border-primary-border-lighter"
                />
                <label
                  htmlFor={`agree-${index}`}
                  className="font-['Montserrat'] font-normal text-greyscale-text-body cursor-pointer"
                  style={{ fontSize: "16px", lineHeight: "20.8px" }}
                >
                  Meu emprego atual
                </label>
              </div>

              <div className="col-span-2">
                <FormTextarea
                  control={control}
                  fieldName={`jobs.${index}.description`}
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
              <CardFooter className="justify-end col-start-2 px-0 pt-3">
                <Button
                  variant="link"
                  className=" text-error-surface-default font-['Montserrat'] font-bold p-0"
                  style={{ fontSize: "14px", lineHeight: "17px" }}
                  onClick={() => remove(index)}
                >
                  <img src={deleteIcon} /> Remover experiência
                </Button>
              </CardFooter>
            </div>
            <hr className="border border-greyscale-border-lighter" />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center items-center pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() =>
            append({
              organization: "",
              jobTitle: "",
              jobStartDate: "",
              jobEndDate: "",
              description: "",
            })
          }
        >
          <img src={plusIcon} /> Adicionar outra experiência
        </Button>
      </div>
    </>
  );
};
