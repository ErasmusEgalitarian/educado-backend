import { z } from "zod";
import MiniNavbar from "@/shared/components/MiniNavbar";
import { Button } from "@/shared/components/shadcn/button";
import { SignupSchema } from "../components/signup/micro-services";
import { useLocation, useNavigate } from "react-router-dom";
import { Cards } from "../components/signup/SignupCards";
import { useForm } from "react-hook-form";
import { formSchema } from "../components/signup/SignupFormSchema";
import { useState } from "react";



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

type FooterProps = {
  isSubmitDisabled: boolean;
};

const Footer = ({ isSubmitDisabled }: FooterProps) => {
    const navigateBack = useNavigate();
    return (
    <div className="flex flex-row">
      <Button
        type="button"
        variant="link"
        className="text-error-surface-default font-bold font-['Montserrat'] underline"
        style={{ fontSize: "18px", lineHeight: "23.4px" }}
        onClick={() => navigateBack(-1)}
      >
        Voltar para o cadastro
      </Button>
      <Button
        size="lg"
        className="justify-end ml-auto disabled:opacity-20 disabled:bg-slate-600"
        type="submit"
        form="signup-info-form"
        disabled={isSubmitDisabled}
      >
        <span
          className="font-['Montserrat'] font-bold"
          style={{ fontSize: 20, lineHeight: "26px" }}
        >
          Enviar para análise
        </span>
      </Button>
    </div>
  );
};

const SignupInfo = () => {
   const navigate = useNavigate();

  const location = useLocation() as {
    state?: { initial?: z.infer<typeof SignupSchema> };
  };

  //Not working yet
  /* useEffect(() => {
    if (!location.state?.initial) {
      navigate("/signup", { replace: true });
    }
  }, [location.state, navigate]); */

  const initial = location.state?.initial;

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);


  return (
    <>
      <MiniNavbar />
      <div className="bg-primary-surface-subtle">
        <div className="mx-[220px] my-20">
          <Header />
          <Cards initialData = {initial}
           onFormStateChange={({ isValid, isSubmitting }) => {
              setIsSubmitDisabled(!isValid || isSubmitting);
            }}
          />
          <Footer isSubmitDisabled={isSubmitDisabled}/>
        </div>
      </div>
    </>
  );
};

export default SignupInfo;

