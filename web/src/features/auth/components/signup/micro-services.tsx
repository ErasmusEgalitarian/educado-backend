import { z } from "zod";

// Zod schema for fields (new user registration form)
 export const SignupSchema = z
  .object({
    // Registers user first name and removes leading/trailing whitespaces
    firstName: z
      .string()
      .trim()
      .min(
        1,
        "Seu primeiro nome é obrigatório!"
      ) /*Your first name is Required*/,

    // Registers user last name and removes leading/trailing whitespaces
    lastName: z
      .string()
      .trim()
      .min(1, "Seu sobrenome é obrigatório!") /*Your last name is Required*/,

    password: z.string().min(8, "A senha não é longa o suficiente"),

    confirmPassword: z.string(),

    email: z
      .string()
      .regex(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Seu email não está correto"
      )
      .min(1, "O email é obrigatório"),

    token: z.null().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
