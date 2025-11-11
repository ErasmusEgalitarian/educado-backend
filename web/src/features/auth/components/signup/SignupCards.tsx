import { useState } from "react";

import {
  MotivationForm,
  EducationForm,
  ExperienceForm,
} from "./SignupFormSchema";
import deleteIcon from "@/shared/assets/delete 1.svg";
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
            <MotivationForm/>
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
        <CardContent id="edu-content" className="pb-6">
          <EducationForm />
          <CardFooter className="justify-end p-0">
            <Button
              variant="link"
              className=" text-error-surface-default font-['Montserrat'] font-bold p-0"
              style={{ fontSize: "14px", lineHeight: "17px" }}
            >
              <img src={deleteIcon} />
              Remover formação
            </Button>
          </CardFooter>
          <hr className="border border-greyscale-border-lighter my-4" />
        </CardContent>
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
        <CardContent id="exp-content" className="pb-6">
          <ExperienceForm />
          <CardFooter className="justify-end p-0">
            <Button
              variant="link"
              className=" text-error-surface-default font-['Montserrat'] font-bold p-0"
              style={{ fontSize: "14px", lineHeight: "17px" }}
            >
              <img src={deleteIcon} />
              Remover formação
            </Button>
          </CardFooter>
          <hr className="border border-greyscale-border-lighter my-4" />
        </CardContent>
      )}
    </Card>
  );
};

export const Cards = () => {
  const [openKey, setOpenKey] = useState<SectionKey | null>("motive");

  const toggle = (key: SectionKey) =>
    setOpenKey((k) => (k === key ? null : key)); // only one card open at a time

  return (
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
  );
};
