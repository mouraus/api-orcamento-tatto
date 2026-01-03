import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../lib/prisma";
import { testData, createTestUserAndToken } from "../helpers/testHelpers";

describe("Cliente API Integration Tests", () => {
  let authToken: string;

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.orcamento.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    
    // Criar usuário de teste e obter token
    const { token } = await createTestUserAndToken(prisma);
    authToken = token;
  });

  afterAll(async () => {
    await prisma.orcamento.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /clientes", () => {
    it("deve retornar lista vazia inicialmente", async () => {
      const response = await request(app)
        .get("/clientes")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("deve retornar todos os clientes", async () => {
      await prisma.cliente.create({ data: testData.cliente.valid });

      const response = await request(app)
        .get("/clientes")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toBe(testData.cliente.valid.nome);
    });

    it("deve retornar 401 sem autenticacao", async () => {
      const response = await request(app).get("/clientes");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /clientes", () => {
    it("deve criar um novo cliente", async () => {
      const response = await request(app)
        .post("/clientes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testData.cliente.valid);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.nome).toBe(testData.cliente.valid.nome);
    });

    it("deve falhar sem campo nome obrigatorio", async () => {
      const response = await request(app)
        .post("/clientes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /clientes/:id", () => {
    it("deve retornar cliente por ID", async () => {
      const cliente = await prisma.cliente.create({ data: testData.cliente.valid });

      const response = await request(app)
        .get(`/clientes/${cliente.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(cliente.id);
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const response = await request(app)
        .get("/clientes/999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /clientes/:id", () => {
    it("deve atualizar cliente", async () => {
      const cliente = await prisma.cliente.create({ data: testData.cliente.valid });

      const response = await request(app)
        .put(`/clientes/${cliente.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ nome: "Nome Atualizado" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe("Nome Atualizado");
    });
  });

  describe("DELETE /clientes/:id", () => {
    it("deve deletar cliente", async () => {
      const cliente = await prisma.cliente.create({ data: testData.cliente.valid });

      const response = await request(app)
        .delete(`/clientes/${cliente.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      const found = await prisma.cliente.findUnique({ where: { id: cliente.id } });
      expect(found).toBeNull();
    });
  });

  describe("GET /clientes/search", () => {
    it("deve buscar clientes por nome", async () => {
      await prisma.cliente.create({ data: testData.cliente.valid });
      await prisma.cliente.create({ data: testData.cliente.validWithAllFields });

      const response = await request(app)
        .get("/clientes/search?nome=João")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.termo).toBe("João");
    });
  });
});
