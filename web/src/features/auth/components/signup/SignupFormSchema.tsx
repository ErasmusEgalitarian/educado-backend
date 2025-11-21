import { useState, useEffect, useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/shadcn/button";
import deleteIcon from "@/shared/assets/delete 1.svg";
import plusIcon from "@/shared/assets/plus 2.svg";

import { EDUCATION_OPTIONS } from "@/auth/constants/educationOptions";
import { FormInput } from "@/shared/components/form/form-input";
import { MonthYearInput } from "@/auth/components/signup/MonthYearInput";
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
const STATUS = ["Em andamento", "Concluída"] as const;
const STATUS_OPTIONS = STATUS.map((type) => ({
  value: type,
  label: type,
}));

const educationSchema = z.object({
  educationType: z.string().min(1),
  isInProgress: z.string().min(1),
  course: z.string().min(1),
  institution: z.string().min(1),
  acedemicStartDate: z.string().min(1),
  acedemicEndDate: z.string().min(1),
});

const jobSchema = z.object({
  organization: z.string().min(1),
  jobTitle: z.string().min(1),
  jobStartDate: z.string().min(1),
  jobEndDate: z.string().min(1),
  description: z.string(),
});


export const formSchema = z.object({
  motivation: z.string().min(1, "Campo obrigatório"),
  educations: z.array(educationSchema).min(1),
  jobs: z.array(jobSchema).min(1),
});

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
        className="resize-none placeholder:text-greyscale-text-body font-['Montserrat'] border-greyscale-border-lighter"
      />
      <div
        className="text-right font-['Montserrat'] text-greyscale-text-caption py-2"
        style={{ fontSize: "14px", lineHeight: "17px" }}
      >
        {currentLength} / {maxChars} caracteres
      </div>
    </div>
  );
};

// The form component itself
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
                wrapperClassName="[&_[role=combobox]]:h-[59px] [&_[data-slot=select-trigger]]:text-base [&_[data-slot=select-value]]:text-base [&_[data-slot=select-value]]:font-['Montserrat'] [&_[role=combobox]]:border-greyscale-border-lighter [&_[role=combobox]]:text-greyscale-text-body"
              />
              <FormSelect
                control={control}
                fieldName={`educations.${index}.isInProgress`}
                label="Status"
                options={STATUS_OPTIONS}
                placeholder="Em andamento"
                isRequired
                wrapperClassName="[&_[role=combobox]]:h-[59px] [&_[data-slot=select-trigger]]:text-base [&_[data-slot=select-value]]:text-base [&_[data-slot=select-value]]:font-['Montserrat'] [&_[role=combobox]]:border-greyscale-border-lighter [&_[role=combobox]]:text-greyscale-text-body"
              />
              <FormInput
                control={control}
                fieldName={`educations.${index}.course`}
                placeholder="Curso"
                label="Curso"
                isRequired
                className="h-[59px] border-greyscale-border-lighter placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
              />
              <FormInput
                control={control}
                fieldName={`educations.${index}.institution`}
                placeholder="Instituição"
                label="Instituição"
                isRequired
                className="h-[59px] border-greyscale-border-lighter placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
              />
              <MonthYearInput
                control={control}
                name={`educations.${index}.acedemicStartDate`}
                label="Início"
                placeholder="Mês / Ano"
                className="h-[59px] placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
                isRequired={true}
              />
              <MonthYearInput
                control={control}
                name={`educations.${index}.acedemicEndDate`}
                label="Fim"
                placeholder="Mês / Ano"
                className="h-[59px] placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
                isRequired={true}
              />
              <div className="pb-2 col-span-2 text-right">
                <CardFooter className="justify-end col-start-2 p-0">
                  <Button
                    type="button"
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
          className="w-full border-greyscale-border-default border-dash-long font-['Montserrat'] text-greyscale-text-body font-normal"
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
                fieldName={`jobs.${index}.organization`}
                placeholder="Mobile Education"
                label="Empresa"
                isRequired
                className="h-[59px] border-greyscale-border-lighter placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
              />
              <FormInput
                control={control}
                fieldName={`jobs.${index}.jobTitle`}
                placeholder="Product Designer"
                label="Cargo"
                isRequired
                className="h-[59px] border-greyscale-border-lighter placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
              />
              <MonthYearInput
                control={control}
                name={`jobs.${index}.jobStartDate`}
                label="Início"
                placeholder="Mês / Ano"
                className="h-[59px] placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
                isRequired={true}
              />
              <MonthYearInput
                control={control}
                name={`jobs.${index}.jobEndDate`}
                label="Fim"
                placeholder="Mês / Ano"
                className="h-[59px] placeholder:text-greyscale-text-body font-['Montserrat'] shadow-none"
                isRequired={true}
                disabled={checked}
              />
              <div className="col-start-2 flex items-center gap-2 pr-1">
                <Checkbox
                  id={`isCurrentJob-${index}`}
                  checked={checked}
                  onCheckedChange={(value) => {
                    setChecked(value === true);
                  }}
                  className="border-primary-border-lighter data-[state=checked]:bg-primary-surface-default data-[state=checked]:border-primary-border-lighter cursor-pointer"
                />
                <label
                  htmlFor={`isCurrentJob-${index}`}
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
                  className="resize-none placeholder:text-greyscale-text-body font-['Montserrat'] border-greyscale-border-lighter"
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
          className="w-full border-greyscale-border-default border-dash-long font-['Montserrat'] text-greyscale-text-body font-normal"
        >
          <img src={plusIcon} /> Adicionar outra experiência
        </Button>
      </div>
    </>
  );
};
