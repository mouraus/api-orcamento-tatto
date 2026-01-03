import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../generated/prisma/client";
import { testData } from "../helpers/testHelpers";

// Criar instância de teste isolada
const adapter = new PrismaBetterSqlite3({ url: ":memory:" });
const prisma = new PrismaClient({ adapter });

// Mock do service com prisma de teste
class TestClienteService {
  async create(data: any) {
    return prisma.cliente.create({ data });
  }

  async findAll() {
    return prisma.cliente.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: number) {
    return prisma.cliente.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return prisma.cliente.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.cliente.delete({ where: { id } });
  }

  async searchByName(nome: string) {
    return prisma.cliente.findMany({
      where: { nome: { contains: nome } },
      orderBy: { nome: "asc" },
    });
  }
}

const clienteService = new TestClienteService();

describe("ClienteService", () => {
  beforeAll(async () => {
    // Criar tabela
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        sexo TEXT,
        dataNascimento DATETIME,
        telefone TEXT,
        observacoes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
  });

  beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM Cliente`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("create", () => {
    it("deve criar um cliente com dados válidos", async () => {
      const cliente = await clienteService.create(testData.cliente.valid);

      expect(cliente).toBeDefined();
      expect(cliente.id).toBeDefined();
      expect(cliente.nome).toBe(testData.cliente.valid.nome);
      expect(cliente.telefone).toBe(testData.cliente.valid.telefone);
    });

    it("deve criar um cliente com todos os campos", async () => {
      const cliente = await clienteService.create(testData.cliente.validWithAllFields);

      expect(cliente).toBeDefined();
      expect(cliente.nome).toBe(testData.cliente.validWithAllFields.nome);
      expect(cliente.observacoes).toBe(testData.cliente.validWithAllFields.observacoes);
    });
  });

  describe("findAll", () => {
    it("deve retornar lista vazia quando não há clientes", async () => {
      const clientes = await clienteService.findAll();
      expect(clientes).toEqual([]);
    });

    it("deve retornar todos os clientes cadastrados", async () => {
      await clienteService.create(testData.cliente.valid);
      await clienteService.create(testData.cliente.validWithAllFields);

      const clientes = await clienteService.findAll();
      expect(clientes).toHaveLength(2);
    });
  });

  describe("findById", () => {
    it("deve retornar o cliente pelo ID", async () => {
      const created = await clienteService.create(testData.cliente.valid);
      const found = await clienteService.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.nome).toBe(created.nome);
    });

    it("deve retornar null para ID inexistente", async () => {
      const found = await clienteService.findById(999);
      expect(found).toBeNull();
    });
  });

  describe("update", () => {
    it("deve atualizar os dados do cliente", async () => {
      const created = await clienteService.create(testData.cliente.valid);
      const updated = await clienteService.update(created.id, {
        nome: "Nome Atualizado",
      });

      expect(updated.nome).toBe("Nome Atualizado");
      expect(updated.telefone).toBe(created.telefone);
    });

    it("deve falhar ao atualizar cliente inexistente", async () => {
      await expect(
        clienteService.update(999, { nome: "Teste" })
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("deve remover o cliente", async () => {
      const created = await clienteService.create(testData.cliente.valid);
      await clienteService.delete(created.id);

      const found = await clienteService.findById(created.id);
      expect(found).toBeNull();
    });

    it("deve falhar ao remover cliente inexistente", async () => {
      await expect(clienteService.delete(999)).rejects.toThrow();
    });
  });

  describe("searchByName", () => {
    it("deve encontrar clientes por nome parcial", async () => {
      await clienteService.create(testData.cliente.valid);
      await clienteService.create(testData.cliente.validWithAllFields);

      const found = await clienteService.searchByName("Silva");
      expect(found).toHaveLength(1);
      expect(found[0].nome).toContain("Silva");
    });

    it("deve retornar lista vazia quando não encontra", async () => {
      await clienteService.create(testData.cliente.valid);
      const found = await clienteService.searchByName("XYZ");
      expect(found).toEqual([]);
    });
  });
});
