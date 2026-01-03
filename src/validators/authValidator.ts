import { z } from "zod";

// Schema para registro de usuario
export const registerUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email invalido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100, "Senha muito longa"),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  senha: z.string().min(1, "Senha e obrigatoria"),
});

// Schema para atualizacao de usuario
export const updateUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo").optional(),
  email: z.string().email("Email invalido").optional(),
  senhaAtual: z.string().optional(),
  novaSenha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100, "Senha muito longa").optional(),
}).refine((data) => {
  // Se novaSenha for fornecida, senhaAtual tambem deve ser
  if (data.novaSenha && !data.senhaAtual) {
    return false;
  }
  return true;
}, {
  message: "Senha atual e obrigatoria para alterar a senha",
  path: ["senhaAtual"],
});

// Tipos inferidos
export type RegisterUsuarioInput = z.infer<typeof registerUsuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
