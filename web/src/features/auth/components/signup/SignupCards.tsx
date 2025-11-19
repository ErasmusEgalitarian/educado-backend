import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { TypeOf, z } from "zod";
import { formSchema } from "./SignupFormSchema";
// FormActions removed: external "Enviar para análise" button in SignupInformation will submit the form
import {
  MotivationForm,
  EducationForm,
  ExperienceForm,
} from "./SignupFormSchema";
import deleteIcon from "@/shared/assets/delete 1.svg";
import plusIcon from "@/shared/assets/plus 2.svg";
import { Chevron } from "@/shared/components/icons/chevron";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/shared/components/shadcn/card";
import { postUserSignup, SignupPayload } from "@/unplaced/services/auth.services";

type SectionKey = "motive" | "education" | "experience";

const MotivationCard = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card
      className={`p-0  ${open ? "border-2 border-primary-border-default" : ""}`}
    >
      <CardHeader
        className={`py-6 ${
          open ? "bg-primary-surface-default rounded-t-lg" : "bg-transparent"
        }`}
      >
        <button
          type="button"
          className="flex items-center"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="motive-content"
        >
          <Chevron open={open} />
          <h3
            className={`font-['Montserrat'] pl-2 ${
              open
                ? "font-bold text-greyscale-surface-subtle rounded-xl"
                : "font-normal text-greyscale-text-body"
            }`}
            style={{ fontSize: "18px" }}
          >
            Motivações
          </h3>
        </button>
      </CardHeader>

      {open && (
        <>
          <CardHeader className="py-0">
            <h3
              className="font-['Montserrat'] font-normal text-[#383838]"
              style={{ fontSize: 20, lineHeight: "26px" }}
            >
              Queremos saber mais sobre você! Nos conte suas motivações para
              fazer parte do Educado
            </h3>
          </CardHeader>
          <CardContent id="motive-content">
            <MotivationForm />
          </CardContent>
        </>
      )}
    </Card>
  );
};

const EducationCard = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card
      className={`p-0 ${open ? "border-2 border-primary-border-default" : ""}`}
    >
      <CardHeader
        className={`py-6 ${
          open ? "bg-primary-surface-default rounded-t-lg" : "bg-transparent"
        }`}
      >
        <button
          type="button"
          className="flex items-center"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="edu-content"
        >
          <Chevron open={open} />
          <h3
            className={`font-['Montserrat'] pl-2 ${
              open
                ? "font-bold text-greyscale-surface-subtle"
                : "font-normal text-greyscale-text-body"
            }`}
            style={{ fontSize: "18px" }}
          >
            Formação Acadêmica
          </h3>
        </button>
      </CardHeader>

      {open && (
        <div>
          <CardContent id="edu-content" className="pb-6">
            <EducationForm />
          </CardContent>
        </div>
      )}
    </Card>
  );
};

const ExperienceCard = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card
      className={`p-0 ${open ? "border-2 border-primary-border-default" : ""}`}
    >
      <CardHeader
        className={`py-6 ${
          open ? "bg-primary-surface-default rounded-t-lg" : "bg-transparent"
        }`}
      >
        <button
          type="button"
          className="flex items-center"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="exp-content"
        >
          <Chevron open={open} />
          <h3
            className={`font-['Montserrat'] pl-2 ${
              open
                ? "font-bold text-greyscale-surface-subtle"
                : "font-normal text-greyscale-text-body"
            }`}
            style={{ fontSize: "18px" }}
          >
            Experiências profissionais
          </h3>
        </button>
      </CardHeader>

      {open && (
        <div>
          <CardContent id="exp-content" className="pb-6">
            <ExperienceForm />
          </CardContent>
        </div>
      )}
    </Card>
  );
};

type CardsProps = {
  initialData?: any;
};

export const Cards = ({ initialData }: CardsProps) => {
  const [openKey, setOpenKey] = useState<SectionKey | null>("motive");

  const toggle = (key: SectionKey) =>
    setOpenKey((k) => (k === key ? null : key)); // only one card open at a time

  const EducationForm = useForm({
    defaultValues: {
      educationType: "",
      isInProgress: "",
      course: "",
      institution: "",
      acedemicStartDate: "",
      acedemicEndDate: "",
    },
  });

  const jobForm = useForm({
    defaultValues: {
      organization: "",
      jobTitle: "",
      jobStartDate: "",
      jobEndDate: "",
      description: "",
    },
  });

  const methods = useForm({
    defaultValues: {
      motivation: "",
      educations: [],
      jobs: [],
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: any) => {
    console.log("form data", data);
    const payload: SignupPayload = {
      firstName: initialData?.firstName,
      lastName: initialData?.lastName,
      email: initialData?.email,
      password: initialData?.password,
      motivation: data.motivation,
      //job
      company: data.organization,
      title: data.jobTitle,
      jobstartDate: data.jobStartDate,
      jobendDate: data.jobEndDate,
      description: data.description,
      //education
      educationType: data.educationType,
      isInProgress: data.isInProgress,
      course: data.course,
      institution: data.institution,
      edustartDate: data.acedemicStartDate,
      eduendDate: data.acedemicEndDate,
    };

    console.log("submit all values", payload);

    try {
      const response = await postUserSignup(payload);
      console.log("Signup information submitted successfully:", response);
      // Handle successful submission (e.g., navigate to a different page)

    } catch (error) {
      console.error("Error during signup information submission:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="signup-info-form" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 my-20">
          <MotivationCard
            open={openKey === "motive"}
            onToggle={() => toggle("motive")}
          />

          <EducationCard
            open={openKey === "education"}
            onToggle={() => toggle("education")}
          />

          <ExperienceCard
            open={openKey === "experience"}
            onToggle={() => toggle("experience")}
          />
        </div>
      </form>
    </FormProvider>
  );
};
