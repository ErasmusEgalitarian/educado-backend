import { z } from "zod";

// Matches the previous validation logic

export const courseBasicInfoSchema = z.object({
  // Title: Required, cannot be empty string
  title: z.string().min(1, "Este campo é obrigatório").trim(),

  // Difficulty: Required, must be 1, 2, or 3 (Iniciante, Intermediário, Avançado)
  difficulty: z
    .number({
      required_error: "Este campo é obrigatório",
      invalid_type_error: "Selecione um nível",
    })
    .int()
    .min(1, "Este campo é obrigatório")
    .max(3, "Nível inválido"),

  // Category: Required, cannot be empty string
  category: z.string().min(1, "Este campo é obrigatório").trim(),

  // Description: Required, cannot be empty, max 400 characters
  description: z
    .string()
    .min(1, "Este campo é obrigatório")
    .max(400, "A descrição não pode ter mais de 400 caracteres")
    .trim(),
});

export type CourseBasicInfoFormValues = z.infer<typeof courseBasicInfoSchema>;
