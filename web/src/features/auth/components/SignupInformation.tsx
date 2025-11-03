import MiniNavbar from "@/shared/components/MiniNavbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
  CardDescription,
  CardAction
} from "@/shared/components/shadcn/card.tsx";

const Header = () => {
  return (
    <div className="flex flex-col items-center my-[80px] mx-[220px] gap-7">
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
const Cards = () => {
  // const [isActive, setIsActive] = useState(false);
  return (
    <div className="flex flex-col gap-10">
      <Card className="">
        <CardHeader>
          <h3 className="font-bold text-lg">Motivações</h3>
        </CardHeader>
        <CardAction>
          <p className="text-sm text-muted-foreground">
            Queremos saber mais sobre você! Nos conte suas motivações para fazer
            parte do Educado
          </p>
        </CardAction>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Escreva aqui por que você quer fazer parte do projeto{" "}
          </p>
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <h3 className="font-bold text-lg">Formação Acadêmica</h3>
        </CardHeader>
      </Card>
      <Card className="">
        <CardHeader>
          <h3 className="font-bold text-lg">Experiências profissionais</h3>
        </CardHeader>
      </Card>
    </div>
  );
};

const SignupInfo = () => {
  return (
    <>
      <MiniNavbar />
      <div className="bg-primary-surface-subtle">
        <div>
          <Header />
          <Cards />
        </div>
      </div>
    </>
  );
};

export default SignupInfo;
