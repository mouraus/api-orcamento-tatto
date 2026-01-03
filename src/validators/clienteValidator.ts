import { z } from "zod";

// Schema para criação de cliente
export const createClienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  sexo: z.enum(["M", "F", "Outro"]).optional().nullable(),
  dataNascimento: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido. Use o formato (XX) XXXXX-XXXX")
    .optional()
    .nullable(),
  observacoes: z.string().max(500, "Observações muito longas").optional().nullable(),
});

// Schema para atualização de cliente (todos os campos opcionais)
export const updateClienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo").optional(),
  sexo: z.enum(["M", "F", "Outro"]).optional().nullable(),
  dataNascimento: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido. Use o formato (XX) XXXXX-XXXX")
    .optional()
    .nullable(),
  observacoes: z.string().max(500, "Observações muito longas").optional().nullable(),
});

// Schema para busca por ID
export const clienteIdSchema = z.object({
  id: z.coerce.number().int().positive("ID deve ser um número positivo"),
});

// Schema para busca por nome
export const searchClienteSchema = z.object({
  nome: z.string().min(1, "Nome para busca é obrigatório"),
});

// Tipos inferidos dos schemas
export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
export type ClienteIdInput = z.infer<typeof clienteIdSchema>;
export type SearchClienteInput = z.infer<typeof searchClienteSchema>;
