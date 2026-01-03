import type { Cliente } from "../../generated/prisma/client";

/**
 * Interface resumida de orçamento para evitar dependência circular
 */
interface OrcamentoResumo {
  id: number;
  descricao: string;
  valorTotal: number;
  status: string;
  dataCriacao: string;
}

/**
 * DTO base para Cliente
 */
export interface ClienteDTO {
  id: number;
  nome: string;
  sexo: string | null;
  telefone: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para listagem de clientes (resumido)
 */
export interface ClienteListDTO {
  id: number;
  nome: string;
  sexo: string | null;
  telefone: string | null;
}

/**
 * DTO para cliente com orçamentos
 */
export interface ClienteComOrcamentosDTO extends ClienteDTO {
  orcamentos: OrcamentoResumo[];
}

/**
 * Mapper: Converte entidade Cliente para ClienteDTO
 */
export function toClienteDTO(cliente: Cliente): ClienteDTO {
  return {
    id: cliente.id,
    nome: cliente.nome,
    sexo: cliente.sexo,
    telefone: cliente.telefone,
    observacoes: cliente.observacoes,
    createdAt: cliente.createdAt.toISOString(),
    updatedAt: cliente.updatedAt.toISOString(),
  };
}

/**
 * Mapper: Converte entidade Cliente para ClienteListDTO
 */
export function toClienteListDTO(cliente: Cliente): ClienteListDTO {
  return {
    id: cliente.id,
    nome: cliente.nome,
    sexo: cliente.sexo,
    telefone: cliente.telefone,
  };
}

/**
 * Mapper: Converte lista de clientes para ClienteListDTO[]
 */
export function toClienteListDTOs(clientes: Cliente[]): ClienteListDTO[] {
  return clientes.map(toClienteListDTO);
}

/**
 * Mapper: Converte lista de clientes para ClienteDTO[]
 */
export function toClienteDTOs(clientes: Cliente[]): ClienteDTO[] {
  return clientes.map(toClienteDTO);
}
