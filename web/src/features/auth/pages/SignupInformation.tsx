import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import MiniNavbar from "@/shared/components/MiniNavbar";
import { Button } from "@/shared/components/shadcn/button";
import { SignupSchema } from "../components/signup/micro-services";
import { useLocation, useNavigate } from "react-router-dom";
import { Cards } from "../components/signup/SignupCards";

const Header = () => {
  //logic here
  const navigate = useNavigate();

  const location = useLocation() as {
    state?: { initial?: z.infer<typeof SignupSchema> };
  };

  useEffect(() => {
    if (!location.state?.initial) {
      navigate("/signup", { replace: true });
    }
  }, [location.state, navigate]);

  const initial = location.state?.initial;

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

//signup call
// Show the email verification modal
// await signup({
//   firstName: data.firstName,
//   lastName: data.lastName,
//   email: data.email,
//   password: data.password,
//   role: "user",
//   token: null,
// })
//   .then((res) => {
//     if (
//       res.status === 200 ||
//       res.data.message ===
//         "Verification email sent. Please verify to complete registration."
//     ) {
//       If the signup is successful, show the modal
//       setIsModalVisible(true);
//     } else if (res.status === 201) {
//       const id = res.data.contentCreatorProfile.baseUser;
//       navigate(`/application/${id}`);
//     }
//   })
//   .catch((err) => {
//     setError(err);
//     if (!err.response?.data) {
//       console.error(err);
//     } else {
//       switch (err.response.data.error.code) {
//         case "E0201": // Email already exists
//           setEmailExistError(err);
//           setErrorExistMessage(
//             "Já existe um usuário com o email fornecido"
//           );
//           setPasswordMismatchError(null);
//           setPasswordMismatchErrorMessage("");
//           break;
//         case "E0105": // Password mismatch
//           setPasswordMismatchError(err);
//           setPasswordMismatchErrorMessage("As senhas não combinam");
//           setEmailExistError(null);
//           setErrorExistMessage("");
//           break;
//         default:
//           console.error(error);
//       }
//     }
//   });
