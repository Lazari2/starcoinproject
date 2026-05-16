import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .regex(/[A-Z]/, "Inclua pelo menos 1 letra maiúscula")
  .regex(/[a-z]/, "Inclua pelo menos 1 letra minúscula")
  .regex(/[0-9]/, "Inclua pelo menos 1 número")
  .regex(/[^A-Za-z0-9]/, "Inclua pelo menos 1 caractere especial");

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(1, "Informe sua senha").max(128),
  remember: z.boolean().optional(),
});

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Informe seu nome").max(100),
    email: z.string().trim().email("E-mail inválido").max(255),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: "Você precisa aceitar os termos" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export const forgotSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
});

export const resetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  avatarUrl: z.string().url().max(500).or(z.literal("")).optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotValues = z.infer<typeof forgotSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;

/**
 * Calcula força da senha (0-4): comprimento, maiúsc/minúsc, número, especial.
 */
export function passwordStrength(pwd: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Excelente"];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}
