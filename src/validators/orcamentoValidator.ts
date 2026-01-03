import { z } from "zod";

// Status válidos para orçamentos: criado, feito, cancelado
export const statusOrcamento = z.enum([
  "criado",
  "feito",
  "cancelado",
]);

// Schema para criação de orçamento
export const createOrcamentoSchema = z.object({
  clienteId: z.coerce.number().int().positive("ID do cliente deve ser um número positivo"),
  descricao: z
    .string()
    .min(5, "Descrição deve ter pelo menos 5 caracteres")
    .max(500, "Descrição muito longa"),
  valorTotal: z.coerce
    .number()
    .positive("Valor deve ser positivo"),
  status: statusOrcamento.default("criado"),
  observacoes: z.string().max(500, "Observações muito longas").optional().nullable(),
});

// Schema para atualização de orçamento
export const updateOrcamentoSchema = z.object({
  descricao: z
    .string()
    .min(5, "Descrição deve ter pelo menos 5 caracteres")
    .max(500, "Descrição muito longa")
    .optional(),
  valorTotal: z.coerce
    .number()
    .positive("Valor deve ser positivo")
    .optional(),
  status: statusOrcamento.optional(),
  observacoes: z.string().max(500, "Observações muito longas").optional().nullable(),
});

// Schema para atualização de status
export const updateStatusSchema = z.object({
  status: statusOrcamento,
});

// Schema para busca por ID
export const orcamentoIdSchema = z.object({
  id: z.coerce.number().int().positive("ID deve ser um número positivo"),
});

// Schema para busca por cliente
export const orcamentoByClienteSchema = z.object({
  clienteId: z.coerce.number().int().positive("ID do cliente deve ser um número positivo"),
});

// Schema para busca por status
export const orcamentoByStatusSchema = z.object({
  status: statusOrcamento,
});

// Tipos inferidos dos schemas
export type CreateOrcamentoInput = z.infer<typeof createOrcamentoSchema>;
export type UpdateOrcamentoInput = z.infer<typeof updateOrcamentoSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type OrcamentoIdInput = z.infer<typeof orcamentoIdSchema>;
export type OrcamentoByClienteInput = z.infer<typeof orcamentoByClienteSchema>;
export type OrcamentoByStatusInput = z.infer<typeof orcamentoByStatusSchema>;
