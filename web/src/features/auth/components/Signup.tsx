import { yupResolver } from "@hookform/resolvers/yup";
import { zodResolver } from "@hookform/resolvers/zod";
import {mdiEyeOffOutline,mdiEyeOutline,mdiChevronLeft,mdiCheckBold,mdiAlertCircleOutline,} from "@mdi/js";
import { Icon } from "@mdi/react";
import React, {createContext,useState,type FC,type ChangeEvent,} from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "sonner";
import * as Yup from "yup";
import { z } from "zod";



import background from "@/shared/assets/background.jpg";
import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/shadcn/button";
import { Form } from "@/shared/components/shadcn/form";


import MiniNavbar from "../../../shared/components/MiniNavbar";
import { useApi } from "../../../shared/hooks/useAPI";
import Carousel from "../../../unplaced/archive/Carousel";
import AuthServices from "../../../unplaced/services/auth.services";
import { LoginResponseError } from "../types/LoginResponseError";

import EmailVerificationModal from "./email-verification/EmailVerificationModal";
import { StringMatcher } from "node_modules/cypress/types/net-stubbing";



/* =========================
 * Types & Schema
 * =======================*/

// Data the form collects
interface ApplicationInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  token: null; // if you later set a string, change this to string | null
}

// Payload you send to your signup API
interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user";
  token: null;
}

// Minimal shape for the success responses you check in code
type SignupApiResponse =
  | {
      status: 200;
      data: { message: string; };
    }
  | {
      status: 201;
      data: {
        contentCreatorProfile: { baseUser: string };
      };
    }
  | {
      status: number;
      data: Record<string, unknown>;
    };

// Minimal error shape you’re switching on
type ApiError = {
  response?: {
    data?: {
      error?: { code?: string };
    };
  };
};

// Context types
// export const setEmailForModal = createContext<() => void>(() => {});
export const ToggleModalContext = createContext<() => void>(() => {});
export const FormDataContext = createContext<ApplicationInputs | null>(null);

/* =========================
 * Validation Schema (Yup)
 * =======================*/

const SignupSchema = z
  .object({
    firstName: z.string().trim().min(1, "Seu primeiro nome é obrigatório!"),
    lastName: z.string().trim().min(1, "Seu sobrenome é obrigatório!"),
    email: z
      .string()
      .trim()
      .email("Seu email não está correto")
      .min(1, "O email é obrigatório"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Za-z]/, "A senha deve conter pelo menos uma letra"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  type SignupFormValues = z.infer<typeof SignupSchema>;

/* =========================
 * Component
 * =======================*/

const Signup: FC = () => {
  const [emailForModal, setEmailForModal] = useState("");
  
  const navigate = useNavigate();

  type RegisterResponse = {
    status: "approved" | "pending";
    userId: number;
    verifiedAt: string | null;
    message: string;
  }

  const { call: signup, isLoading: submitLoading } = 
  useApi<RegisterResponse,SignupPayload>(AuthServices.postUserSignup);

  const [error, setError] = useState<LoginResponseError.RootObject | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ApplicationInputs | null>(null);
  const [email, setEmail] = useState("");


  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const password = form.watch("password");
  const passLenOK = (password?.length ?? 0) >= 8;
  const passHasLetter = /.*\p{L}.*$/u.test(password ?? "");


  // Submit handler
  
  const onSubmit = async (values: SignupFormValues) => {
    try {
      const res = await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: "user",
        token: null,
      });

        if (res.status === "pending") {
        setEmailForModal(values.email);
        setIsModalVisible(true);
        return;
      }
        if (res.status === "approved") {
        toast.success("Conta criada com sucesso!");
        // use the id returned from backend
        navigate(`/application/${res.userId}`);
        return;
      }
      
      toast.error("Erro inesperado ao registrar o usuário.");
    } catch (err: any) {
      const code = err?.response?.data?.error?.code as string | undefined;

      if (code === "E0201") {
        form.setError("email", {
          type: "server",
          message: "Já existe um usuário com o email fornecido",
        });
        return;
      }

      toast.error("Erro ao registrar. Tente novamente mais tarde.");
    }
  };

     return (
  <main className="bg-gradient-to-br from-[#C9E5EC] to-[#FFFFFF] min-h-screen flex flex-col">
    {/* Mini navbar */}
    <MiniNavbar />

    {/* Layout container */}
    <div className="grid grid-cols-1 md:grid-cols-2 flex-grow">
      {/* Left side - Background and carousel */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden">
        <img
          src={background}
          alt="Background"
          className="object-cover w-full h-full absolute inset-0"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-10">
          <Carousel />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-b from-gradient-start to-gradient-end px-6 md:px-12 py-10">
        <div className="w-full max-w-lg">
          {/* Back link */}
          <div className="mb-6">
            <Link to="/welcome" className="flex items-center gap-2 text-text-black-title underline hover:text-greyscale-text-subtle">
              <Icon path={mdiChevronLeft} size={1} color="primary-text-title" />
              <span>Voltar</span>
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-primary-text-title text-3xl md:text-4xl font-fontFamily-lato-bold leading-tight mb-2">
            Crie a sua conta gratuitamente!
          </h1>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate 
            >
              {/* firstname */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-greyscale-text-subtle"
                  >
                    Nome <span className="text-error-surface-default">*</span>
                  </label>
                  <FormInput
                    control={form.control}
                    fieldName="firstName"
                    placeholder="João"
                    isRequired
                  />
                </div>

                {/* Lastname */}
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-greyscale-text-subtle"
                  >
                    Sobrenome <span className="text-error-surface-default">*</span>
                  </label>
                  <FormInput
                    control={form.control}
                    fieldName="lastName"
                    placeholder="Silva"
                    isRequired
                  
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-greyscale-text-subtle">
                  Email <span className="text-error-surface-default">*</span>
                </label>
                <FormInput
                  control={form.control}
                  fieldName="email"
                  placeholder="usuario@gmail.com"
                  isRequired
                  
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-greyscale-text-subtle">
                  Senha <span className="text-error-surface-default">*</span>
                </label>
                <FormInput
                  control={form.control}
                  fieldName="password"
                  type="password"
                  placeholder="********"
                  description="Mínimo de 8 caracteres e pelo menos uma letra"
                  isRequired
                 
                />
              </div>

              {/* Verify password */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-greyscale-text-subtle"
                >
                  Confirmar senha <span className="text-error-surface-default">*</span>
                </label>
                <FormInput
                  control={form.control}
                  fieldName="confirmPassword"
                  type="password"
                  placeholder="********"
                  isRequired
                 
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitLoading || !form.formState.isValid}
                  className="w-full h-[3.3rem] rounded-lg text-lg font-fontFamily-montserrat-semi-bold"
                >
                  {submitLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>

              <div className="flex justify-center text-center pt-4">
                <span className="text-greyscale-text-subtle text-lg">
                  Já possui conta?{" "}
                  <Link
                    to="/login"
                    className="font-montserrat font-bold underline decoration-current text-greyscale-text-subtle hover:!text-greyscale-border-darker"
                  >
                    Entre agora
                  </Link>
                </span>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>

    {/* Email verification modal */}
    {isModalVisible && (
      <EmailVerificationModal
        toggleModal={() => setIsModalVisible((v) => !v)}
        setErrorMessage={setErrorMessage}
        uemail={emailForModal}
        isLoading={submitLoading}
      />
    )}
  </main>
);

};


export default Signup;

