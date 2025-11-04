import { useState } from "react";

import { Chevron } from "@/shared/components/icons/Chevron";
import MiniNavbar from "@/shared/components/MiniNavbar";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/shared/components/shadcn/card"; // usually no .tsx in import path

type SectionKey = "motive" | "education" | "experience";


const toggle = (key: SectionKey) =>
    setOpenKey((k) => (k === key ? null : key)); // only one card open at a time

const Header = () => {
  return (
    <div className="flex flex-col items-center gap-7 mx-32">
      <h2
        className="font-bold font-['Montserrat'] text-center text-primary-text-label"
        style={{
          lineHeight: "44.2px",
          fontSize: "34px",
          verticalAlign: "middle",
        }}
      >
        Que bom que você quer fazer parte do Educado!
      </h2>
      <h4
        className="font-normal font-['Montserrat'] text-center text-[#383838]"
        style={{
          lineHeight: "26px",
          fontSize: "20px",
          verticalAlign: "middle",
        }}
      >
        Precisamos de algumas informações para aprovar seu acesso de criador de
        conteúdo. Retornaremos com uma resposta via e-mail
      </h4>
    </div>
  );
};


const MotivationCard = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => {
  const [text, setText] = useState("");
  const maxChars = 400;

  return ( 
    <Card
        className={`p-0  ${open ? "border-2 border-primary-border-default" : ""}`}
      >
        <CardHeader
          className={`py-6 ${
            open
              ? "bg-primary-surface-default rounded-t-lg"
              : "bg-transparent"
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
            <CardHeader>
              <h3
                className="font-['Montserrat'] font-normal text-[#383838]"
                style={{ fontSize: 20, lineHeight: "26px" }}
              >
                Queremos saber mais sobre você! Nos conte suas motivações para
                fazer parte do Educado
              </h3>
            </CardHeader>
            <CardContent id="motive-content">
              <textarea
                id="motivation"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                rows={5}
                maxLength={maxChars}
                placeholder="Escreva aqui por que você quer fazer parte do projeto"
                className="w-full rounded-lg border-[1.5px] border-greyscale-border-lighter px-3 py-3 font-normal font-['Montserrat'] text-greyscale-text-subtle focus:outline-none focus:border-greyscale-border-default focus:border-2 resize-none placeholder:text-greyscale-text-subtle"
                style={{ fontSize: "18px", lineHeight: "23.4px" }}
              />
              <CardFooter
                className="flex justify-end pb-5 pt-2 px-0 text-greyscale-text-caption font-normal font-['Montserrat']"
                style={{ fontSize: "14px", lineHeight: "18.2px" }}
              >
                {text.length} / {maxChars} caracteres
              </CardFooter>
            </CardContent>
          </>
        )}
      </Card>
  );
};

const EducationCard = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => {
  return ( 
    <Card
        className={`p-0 ${open ? "border-2 border-primary-border-default" : ""}`}
      >
        <CardHeader
          className={`py-6 ${
            open 
              ? "bg-primary-surface-default rounded-t-lg"
              : "bg-transparent"
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
            <p className="text-sm text-muted-foreground">Sua formação…</p>
          </CardContent>
        )}
      </Card>
  );
};

const ExperienceCard = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => {
  return (
    <Card
        className={`p-0 ${open ? "border-2 border-primary-border-default" : ""}`}
      >
        <CardHeader
          className={`py-6 ${
            open
              ? "bg-primary-surface-default rounded-t-lg"
              : "bg-transparent"
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
            <p className="text-sm text-muted-foreground">Suas experiências…</p>
          </CardContent>
        )}
      </Card>
  );
};

const Cards = () => {
  const [openKey, setOpenKey] = useState<SectionKey | null>("motive");

  const toggle = (key: SectionKey) =>
    setOpenKey((k) => (k === key ? null : key)); // only one card open at a time

  return (
    <div className="flex flex-col gap-6 my-20">
      <MotivationCard open={openKey === "motive"} onToggle={() => toggle("motive")} />
      <EducationCard open={openKey === "education"} onToggle={() => toggle("education")} />
      <ExperienceCard open={openKey === "experience"} onToggle={() => toggle("experience")} />
    </div>
  );
};

const SignupInfo = () => {
  return (
    <>
      <MiniNavbar />
      <div className="bg-primary-surface-subtle">
        <div className="mx-[220px] my-20">
          <Header />
          <Cards />
        </div>
      </div>
    </>
  );
};

export default SignupInfo;