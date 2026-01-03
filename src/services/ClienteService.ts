import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import {
  type ClienteDTO,
  type ClienteListDTO,
  type ClienteComOrcamentosDTO,
  toClienteDTO,
  toClienteDTOs,
  toClienteListDTOs,
} from "../dtos/ClienteDTO";
import { toOrcamentoResumoDTOs } from "../dtos/OrcamentoDTO";

export class ClienteService {
  /**
   * Cria um novo cliente
   */
  async create(data: Prisma.ClienteCreateInput): Promise<ClienteDTO> {
    const cliente = await prisma.cliente.create({ data });
    return toClienteDTO(cliente);
  }

  /**
   * Busca todos os clientes
   */
  async findAll(): Promise<ClienteListDTO[]> {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
    });
    return toClienteListDTOs(clientes);
  }

  /**
   * Busca um cliente por ID
   */
  async findById(id: number): Promise<ClienteDTO | null> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });
    return cliente ? toClienteDTO(cliente) : null;
  }

  /**
   * Busca um cliente por ID com seus orçamentos
   */
  async findByIdWithOrcamentos(id: number): Promise<ClienteComOrcamentosDTO | null> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { orcamentos: true },
    });
    
    if (!cliente) return null;
    
    return {
      ...toClienteDTO(cliente),
      orcamentos: toOrcamentoResumoDTOs(cliente.orcamentos),
    };
  }

  /**
   * Atualiza um cliente
   */
  async update(id: number, data: Prisma.ClienteUpdateInput): Promise<ClienteDTO> {
    const cliente = await prisma.cliente.update({
      where: { id },
      data,
    });
    return toClienteDTO(cliente);
  }

  /**
   * Remove um cliente
   */
  async delete(id: number): Promise<ClienteDTO> {
    const cliente = await prisma.cliente.delete({
      where: { id },
    });
    return toClienteDTO(cliente);
  }

  /**
   * Busca clientes por nome (busca parcial)
   */
  async searchByName(nome: string): Promise<ClienteListDTO[]> {
    const clientes = await prisma.cliente.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
      orderBy: { nome: "asc" },
    });
    return toClienteListDTOs(clientes);
  }
}

export const clienteService = new ClienteService();
