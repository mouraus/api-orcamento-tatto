import type { Orcamento, Cliente } from "../../generated/prisma/client";

/**
 * DTO resumido do cliente para usar em orçamentos
 */
export interface ClienteResumoDTO {
  id: number;
  nome: string;
  telefone: string | null;
}

/**
 * DTO resumido do orçamento para usar em cliente
 */
export interface OrcamentoResumoDTO {
  id: number;
  descricao: string;
  valorTotal: number;
  status: string;
  dataCriacao: string;
}

/**
 * DTO base para Orçamento
 */
export interface OrcamentoDTO {
  id: number;
  descricao: string;
  valorTotal: number;
  status: string;
  observacoes: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  clienteId: number;
}

/**
 * DTO para orçamento com dados do cliente
 */
export interface OrcamentoComClienteDTO extends OrcamentoDTO {
  cliente: ClienteResumoDTO;
}

/**
 * DTO para listagem de orçamentos
 */
export interface OrcamentoListDTO {
  id: number;
  descricao: string;
  valorTotal: number;
  status: string;
  dataCriacao: string;
  cliente: ClienteResumoDTO;
}

/**
 * Tipo para orçamento com cliente incluído do Prisma
 */
type OrcamentoComCliente = Orcamento & { cliente: Cliente };

/**
 * Helper para converter Decimal/number para number
 */
function decimalToNumber(value: unknown): number {
  if (typeof value === "number") return value;
  return Number(value);
}

/**
 * Mapper: Converte entidade Cliente para ClienteResumoDTO
 */
export function toClienteResumoDTO(cliente: Cliente): ClienteResumoDTO {
  return {
    id: cliente.id,
    nome: cliente.nome,
    telefone: cliente.telefone,
  };
}

/**
 * Mapper: Converte entidade Orcamento para OrcamentoDTO
 */
export function toOrcamentoDTO(orcamento: Orcamento): OrcamentoDTO {
  return {
    id: orcamento.id,
    descricao: orcamento.descricao,
    valorTotal: decimalToNumber(orcamento.valorTotal),
    status: orcamento.status,
    observacoes: orcamento.observacoes,
    dataCriacao: orcamento.dataCriacao.toISOString(),
    dataAtualizacao: orcamento.dataAtualizacao.toISOString(),
    clienteId: orcamento.clienteId,
  };
}

/**
 * Mapper: Converte entidade Orcamento para OrcamentoResumoDTO
 */
export function toOrcamentoResumoDTO(orcamento: Orcamento): OrcamentoResumoDTO {
  return {
    id: orcamento.id,
    descricao: orcamento.descricao,
    valorTotal: decimalToNumber(orcamento.valorTotal),
    status: orcamento.status,
    dataCriacao: orcamento.dataCriacao.toISOString(),
  };
}

/**
 * Mapper: Converte entidade Orcamento com Cliente para OrcamentoComClienteDTO
 */
export function toOrcamentoComClienteDTO(orcamento: OrcamentoComCliente): OrcamentoComClienteDTO {
  return {
    ...toOrcamentoDTO(orcamento),
    cliente: toClienteResumoDTO(orcamento.cliente),
  };
}

/**
 * Mapper: Converte entidade Orcamento com Cliente para OrcamentoListDTO
 */
export function toOrcamentoListDTO(orcamento: OrcamentoComCliente): OrcamentoListDTO {
  return {
    id: orcamento.id,
    descricao: orcamento.descricao,
    valorTotal: decimalToNumber(orcamento.valorTotal),
    status: orcamento.status,
    dataCriacao: orcamento.dataCriacao.toISOString(),
    cliente: toClienteResumoDTO(orcamento.cliente),
  };
}

/**
 * Mapper: Converte lista de orçamentos para OrcamentoDTO[]
 */
export function toOrcamentoDTOs(orcamentos: Orcamento[]): OrcamentoDTO[] {
  return orcamentos.map(toOrcamentoDTO);
}

/**
 * Mapper: Converte lista de orçamentos para OrcamentoResumoDTO[]
 */
export function toOrcamentoResumoDTOs(orcamentos: Orcamento[]): OrcamentoResumoDTO[] {
  return orcamentos.map(toOrcamentoResumoDTO);
}

/**
 * Mapper: Converte lista de orçamentos com cliente para OrcamentoListDTO[]
 */
export function toOrcamentoListDTOs(orcamentos: OrcamentoComCliente[]): OrcamentoListDTO[] {
  return orcamentos.map(toOrcamentoListDTO);
}

/**
 * Mapper: Converte lista de orçamentos com cliente para OrcamentoComClienteDTO[]
 */
export function toOrcamentoComClienteDTOs(orcamentos: OrcamentoComCliente[]): OrcamentoComClienteDTO[] {
  return orcamentos.map(toOrcamentoComClienteDTO);
}
