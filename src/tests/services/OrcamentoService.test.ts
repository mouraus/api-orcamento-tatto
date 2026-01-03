import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../generated/prisma/client";
import { testData } from "../helpers/testHelpers";

// Criar instância de teste isolada
const adapter = new PrismaBetterSqlite3({ url: ":memory:" });
const prisma = new PrismaClient({ adapter });

// Mock do service com prisma de teste
class TestOrcamentoService {
  async create(data: any) {
    return prisma.orcamento.create({ data });
  }

  async createForCliente(clienteId: number, data: any) {
    return prisma.orcamento.create({
      data: { ...data, clienteId },
    });
  }

  async findAll() {
    return prisma.orcamento.findMany({
      orderBy: { dataCriacao: "desc" },
      include: { cliente: true },
    });
  }

  async findById(id: number) {
    return prisma.orcamento.findUnique({
      where: { id },
      include: { cliente: true },
    });
  }

  async findByClienteId(clienteId: number) {
    return prisma.orcamento.findMany({
      where: { clienteId },
      orderBy: { dataCriacao: "desc" },
    });
  }

  async findByStatus(status: string) {
    return prisma.orcamento.findMany({
      where: { status },
      orderBy: { dataCriacao: "desc" },
    });
  }

  async update(id: number, data: any) {
    return prisma.orcamento.update({ where: { id }, data });
  }

  async updateStatus(id: number, status: string) {
    return prisma.orcamento.update({ where: { id }, data: { status } });
  }

  async delete(id: number) {
    return prisma.orcamento.delete({ where: { id } });
  }
}

const orcamentoService = new TestOrcamentoService();

describe("OrcamentoService", () => {
  let clienteId: number;

  beforeAll(async () => {
    // Criar tabelas
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        sexo TEXT,
        dataNascimento DATETIME,
        telefone TEXT,
        email TEXT UNIQUE,
        endereco TEXT,
        observacoes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Orcamento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clienteId INTEGER NOT NULL,
        descricao TEXT NOT NULL,
        valorTotal DECIMAL NOT NULL,
        status TEXT DEFAULT 'criado',
        dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        observacoes TEXT,
        FOREIGN KEY (clienteId) REFERENCES Cliente(id)
      )
    `;
  });

  beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM Orcamento`;
    await prisma.$executeRaw`DELETE FROM Cliente`;

    // Criar cliente para os testes
    const cliente = await prisma.cliente.create({
      data: testData.cliente.valid,
    });
    clienteId = cliente.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("create", () => {
    it("deve criar um orçamento", async () => {
      const orcamento = await orcamentoService.createForCliente(
        clienteId,
        testData.orcamento.valid
      );

      expect(orcamento).toBeDefined();
      expect(orcamento.id).toBeDefined();
      expect(orcamento.descricao).toBe(testData.orcamento.valid.descricao);
      expect(Number(orcamento.valorTotal)).toBe(testData.orcamento.valid.valorTotal);
      expect(orcamento.status).toBe("criado");
    });

    it("deve criar orçamento com status específico", async () => {
      const orcamento = await orcamentoService.createForCliente(
        clienteId,
        testData.orcamento.feito
      );

      expect(orcamento.status).toBe("feito");
    });
  });

  describe("findAll", () => {
    it("deve retornar todos os orçamentos com cliente", async () => {
      await orcamentoService.createForCliente(clienteId, testData.orcamento.valid);
      await orcamentoService.createForCliente(clienteId, testData.orcamento.feito);

      const orcamentos = await orcamentoService.findAll();

      expect(orcamentos).toHaveLength(2);
      expect(orcamentos[0].cliente).toBeDefined();
    });
  });

  describe("findById", () => {
    it("deve retornar orçamento com cliente", async () => {
      const created = await orcamentoService.createForCliente(
        clienteId,
        testData.orcamento.valid
      );

      const found = await orcamentoService.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.cliente).toBeDefined();
      expect(found?.cliente.nome).toBe(testData.cliente.valid.nome);
    });

    it("deve retornar null para ID inexistente", async () => {
      const found = await orcamentoService.findById(999);
      expect(found).toBeNull();
    });
  });

  describe("findByClienteId", () => {
    it("deve retornar orçamentos do cliente", async () => {
      await orcamentoService.createForCliente(clienteId, testData.orcamento.valid);
      await orcamentoService.createForCliente(clienteId, testData.orcamento.feito);

      const orcamentos = await orcamentoService.findByClienteId(clienteId);

      expect(orcamentos).toHaveLength(2);
    });

    it("deve retornar lista vazia para cliente sem orçamentos", async () => {
      const orcamentos = await orcamentoService.findByClienteId(clienteId);
      expect(orcamentos).toEqual([]);
    });
  });

  describe("findByStatus", () => {
    it("deve filtrar orçamentos por status", async () => {
      await orcamentoService.createForCliente(clienteId, testData.orcamento.valid);
      await orcamentoService.createForCliente(clienteId, testData.orcamento.feito);

      const criados = await orcamentoService.findByStatus("criado");
      const feitos = await orcamentoService.findByStatus("feito");

      expect(criados).toHaveLength(1);
      expect(feitos).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("deve atualizar dados do orçamento", async () => {
      const created = await orcamentoService.createForCliente(
        clienteId,
        testData.orcamento.valid
      );

      const updated = await orcamentoService.update(created.id, {
        descricao: "Descrição atualizada",
        valorTotal: 750.00,
      });

      expect(updated.descricao).toBe("Descrição atualizada");
      expect(Number(updated.valorTotal)).toBe(750.00);
    });
  });

  describe("updateStatus", () => {
    it("deve atualizar apenas o status", async () => {
      const created = await orcamentoService.createForCliente(
        clienteId,
        testData.orcamento.valid
      );

      const updated = await orcamentoService.updateStatus(created.id, "feito");

      expect(updated.status).toBe("feito");
      expect(updated.descricao).toBe(created.descricao);
    });
  });

  describe("delete", () => {
    it("deve remover o orçamento", async () => {
      const created = await orcamentoService.createForCliente(
        clienteId,
        testData.orcamento.valid
      );

      await orcamentoService.delete(created.id);

      const found = await orcamentoService.findById(created.id);
      expect(found).toBeNull();
    });
  });
});
