
import MiniNavbar from "@/shared/components/MiniNavbar";
import { Button } from "@/shared/components/shadcn/button";

import { Cards } from "../components/signup/SignupCards"

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
