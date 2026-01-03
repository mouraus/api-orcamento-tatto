import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../lib/prisma";
import { testData, createTestUserAndToken } from "../helpers/testHelpers";

describe("Orcamento API Integration Tests", () => {
  let clienteId: number;
  let authToken: string;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.orcamento.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    
    // Criar usuário de teste e obter token
    const { token } = await createTestUserAndToken(prisma);
    authToken = token;

    // Criar cliente para os testes
    const cliente = await prisma.cliente.create({ data: testData.cliente.valid });
    clienteId = cliente.id;
  });

  afterAll(async () => {
    await prisma.orcamento.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /orcamentos", () => {
    it("deve retornar lista vazia inicialmente", async () => {
      const response = await request(app)
        .get("/orcamentos")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("deve retornar todos os orcamentos com cliente", async () => {
      await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });

      const response = await request(app)
        .get("/orcamentos")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].cliente).toBeDefined();
    });

    it("deve retornar 401 sem autenticacao", async () => {
      const response = await request(app).get("/orcamentos");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /orcamentos", () => {
    it("deve criar um novo orcamento", async () => {
      const response = await request(app)
        .post("/orcamentos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testData.orcamento.valid, clienteId });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.descricao).toBe(testData.orcamento.valid.descricao);
    });

    it("deve criar orcamento com status padrao criado", async () => {
      const { status, ...orcamentoSemStatus } = testData.orcamento.valid;
      
      const response = await request(app)
        .post("/orcamentos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...orcamentoSemStatus, clienteId });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe("criado");
    });
  });

  describe("GET /orcamentos/:id", () => {
    it("deve retornar orcamento com cliente", async () => {
      const orcamento = await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });

      const response = await request(app)
        .get(`/orcamentos/${orcamento.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cliente).toBeDefined();
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const response = await request(app)
        .get("/orcamentos/999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /orcamentos/:id", () => {
    it("deve atualizar orcamento", async () => {
      const orcamento = await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });

      const response = await request(app)
        .put(`/orcamentos/${orcamento.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ descricao: "Nova descricao atualizada" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.descricao).toBe("Nova descricao atualizada");
    });
  });

  describe("PATCH /orcamentos/:id/status", () => {
    it("deve atualizar status do orcamento", async () => {
      const orcamento = await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });

      const response = await request(app)
        .patch(`/orcamentos/${orcamento.id}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "feito" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("feito");
    });

    it("deve rejeitar status invalido", async () => {
      const orcamento = await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });

      const response = await request(app)
        .patch(`/orcamentos/${orcamento.id}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "invalido" });

      expect(response.status).toBe(422);
    });
  });

  describe("DELETE /orcamentos/:id", () => {
    it("deve deletar orcamento", async () => {
      const orcamento = await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });

      const response = await request(app)
        .delete(`/orcamentos/${orcamento.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      const found = await prisma.orcamento.findUnique({ where: { id: orcamento.id } });
      expect(found).toBeNull();
    });
  });

  describe("GET /clientes/:clienteId/orcamentos", () => {
    it("deve retornar orcamentos do cliente", async () => {
      await prisma.orcamento.create({
        data: { ...testData.orcamento.valid, clienteId },
      });
      await prisma.orcamento.create({
        data: { ...testData.orcamento.feito, clienteId },
      });

      const response = await request(app)
        .get(`/clientes/${clienteId}/orcamentos`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.orcamentos).toHaveLength(2);
    });
  });
});
