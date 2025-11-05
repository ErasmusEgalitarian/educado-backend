import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import deleteIcon from "@/shared/assets/delete 1.svg";
import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Chevron } from "@/shared/components/icons/Chevron";
import MiniNavbar from "@/shared/components/MiniNavbar";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/shared/components/shadcn/card"; // usually no .tsx in import path
import { Checkbox } from "@/shared/components/shadcn/checkbox";
import { Form } from "@/shared/components/shadcn/form";
import { Link } from "react-router-dom";
const maxChars = 400;

// Submit handler with inferred data shape from the schema.
async function onSubmit(values: z.infer<typeof formSchema>) {
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
const EducationForm = () => {
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
        onSubmit={form.handleSubmit(onSubmit)}
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

const ExperienceForm = () => {
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

  const currentLength = form.watch("descrição")?.length ?? 0;

  const [checked, setChecked] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
        <div className="col-start-2 flex items-center gap-2 pr-[4px]">
          <Checkbox
            id="agree"
            checked={checked}
            onCheckedChange={setChecked}
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

type SectionKey = "motive" | "education" | "experience";

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

const Footer = () => {
  return (
    <div className="flex flex-row">
      <Button
        variant="link"
        className="text-error-surface-default font-bold font-['Montserrat'] underline"
        style={{ fontSize: "18px", lineHeight: "23.4px" }}
      >
        Voltar para o cadastro
      </Button>
      <Button size="lg" className="justify-end ml-auto">
        <label
          htmlFor="ready"
          className="font-['Montserrat'] font-bold"
          style={{ fontSize: "20px", lineHeight: "26px" }}
        >
          {" "}
          Enviar para análise{" "}
        </label>
      </Button>
    </div>
  );
};

const MotivationCard = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) => {
  const [text, setText] = useState("");

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

const Cards = () => {
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

const SignupInfo = () => {
  return (
    <>
      <MiniNavbar />
      <div className="bg-primary-surface-subtle">
        <div className="mx-[220px] my-20">
          <Header />
          <Cards />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SignupInfo;
