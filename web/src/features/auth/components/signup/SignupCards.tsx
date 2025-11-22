import { FormProvider} from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { formSchema } from "./SignupFormSchema";
import {
  MotivationForm,
  EducationForm,
  ExperienceForm,
} from "./SignupFormSchema";
import { Chevron } from "@/shared/components/icons/chevron";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/shared/components/shadcn/card";
import { postUserSignup, SignupPayload } from "@/unplaced/services/auth.services";
import { useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

type SectionKey = "motive" | "education" | "experience";
type FormData = z.infer<typeof formSchema>;
type CardsProps = {
  initialData?: any;
  onFormStateChange?: (state:{
    isValid: boolean;
    isSubmitting: boolean;
  }) => void;
};

export const Cards = ({ initialData, onFormStateChange }: CardsProps) =>  {
  const [openKey, setOpenKey] = useState<SectionKey | null>("motive");
  const navigate = useNavigate();


  const toggle = (key: SectionKey) =>
    setOpenKey((k) => (k === key ? null : key)); // only one card open at a time

    const methods = useForm<FormData>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
        motivation: "",
        educations: [],
        jobs: [],
      },
      shouldUnregister: false
  });
  
    const {
      handleSubmit,
      formState: { isValid, isSubmitting },
    } = methods;

    useEffect(() => {
      if (onFormStateChange) {
        onFormStateChange({ isValid, isSubmitting });
      }
    }, [isValid, isSubmitting, onFormStateChange]);


    const onSubmit = async (data: FormData) => {
        console.log("form data", data);


        const jobs = data.jobs.map(job => ({
            company: job.organization,
            title: job.jobTitle,
            startDate: job.jobStartDate,
            endDate: job.jobEndDate ?? "Current",
            description: job.description,
        }));

        const educations = data.educations.map(edu => ({
            educationType: edu.educationType,
            isInProgress: edu.isInProgress,
            course: edu.course,
            institution: edu.institution,
            startDate: edu.acedemicStartDate,
            endDate: edu.acedemicEndDate,
        }));

        const payload: SignupPayload = {
            firstName: initialData?.firstName,
            lastName: initialData?.lastName,
            email: initialData?.email,
            password: initialData?.password,
            motivation: data.motivation,

            jobs: jobs,
            educations: educations,
        };

        console.log("submit all values", payload);

        try {
            const response = await postUserSignup(payload);
            console.log("Signup information submitted successfully:", response);
          
            navigate("/login", { replace: true });

        } catch (error) {
            console.error("Error during signup information submission:", error);
        }
    };

  // Prevent form submission on Enter key press
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      // allow Enter in textareas (multi-line) and any element that explicitly wants Enter
      if (target.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="signup-info-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        onKeyDown={handleFormKeyDown}
      >
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
