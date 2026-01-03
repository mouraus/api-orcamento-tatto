import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import {
  type OrcamentoDTO,
  type OrcamentoComClienteDTO,
  type OrcamentoResumoDTO,
  toOrcamentoDTO,
  toOrcamentoComClienteDTO,
  toOrcamentoComClienteDTOs,
  toOrcamentoResumoDTOs,
} from "../dtos/OrcamentoDTO";

export class OrcamentoService {
  /**
   * Cria um novo orçamento
   */
  async create(data: Prisma.OrcamentoCreateInput): Promise<OrcamentoDTO> {
    const orcamento = await prisma.orcamento.create({ data });
    return toOrcamentoDTO(orcamento);
  }

  /**
   * Cria um orçamento vinculado a um cliente existente por ID
   */
  async createForCliente(
    clienteId: number,
    data: Omit<Prisma.OrcamentoCreateInput, "cliente">
  ): Promise<OrcamentoDTO> {
    const orcamento = await prisma.orcamento.create({
      data: {
        ...data,
        cliente: { connect: { id: clienteId } },
      },
    });
    return toOrcamentoDTO(orcamento);
  }

  /**
   * Busca todos os orçamentos
   */
  async findAll(): Promise<OrcamentoComClienteDTO[]> {
    const orcamentos = await prisma.orcamento.findMany({
      orderBy: { dataCriacao: "desc" },
      include: { cliente: true },
    });
    return toOrcamentoComClienteDTOs(orcamentos);
  }

  /**
   * Busca um orçamento por ID
   */
  async findById(id: number): Promise<OrcamentoComClienteDTO | null> {
    const orcamento = await prisma.orcamento.findUnique({
      where: { id },
      include: { cliente: true },
    });
    return orcamento ? toOrcamentoComClienteDTO(orcamento) : null;
  }

  /**
   * Busca orçamentos de um cliente específico
   */
  async findByClienteId(clienteId: number): Promise<OrcamentoResumoDTO[]> {
    const orcamentos = await prisma.orcamento.findMany({
      where: { clienteId },
      orderBy: { dataCriacao: "desc" },
    });
    return toOrcamentoResumoDTOs(orcamentos);
  }

  /**
   * Busca orçamentos por status
   */
  async findByStatus(status: string): Promise<OrcamentoComClienteDTO[]> {
    const orcamentos = await prisma.orcamento.findMany({
      where: { status },
      orderBy: { dataCriacao: "desc" },
      include: { cliente: true },
    });
    return toOrcamentoComClienteDTOs(orcamentos);
  }

  /**
   * Atualiza um orçamento
   */
  async update(id: number, data: Prisma.OrcamentoUpdateInput): Promise<OrcamentoDTO> {
    const orcamento = await prisma.orcamento.update({
      where: { id },
      data,
    });
    return toOrcamentoDTO(orcamento);
  }

  /**
   * Atualiza o status de um orçamento
   */
  async updateStatus(id: number, status: string): Promise<OrcamentoDTO> {
    const orcamento = await prisma.orcamento.update({
      where: { id },
      data: { status },
    });
    return toOrcamentoDTO(orcamento);
  }

  /**
   * Remove um orçamento
   */
  async delete(id: number): Promise<OrcamentoDTO> {
    const orcamento = await prisma.orcamento.delete({
      where: { id },
    });
    return toOrcamentoDTO(orcamento);
  }
}

export const orcamentoService = new OrcamentoService();
