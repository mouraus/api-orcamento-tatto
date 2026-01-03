import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../generated/prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

/**
 * Cria uma instância de PrismaClient configurada para testes
 * Usa banco SQLite em memória para isolamento
 */
export function createTestPrisma(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: ":memory:" });
  return new PrismaClient({ adapter });
}

/**
 * Cria um token JWT para testes
 */
export function createTestToken(userId: number = 1): string {
  return jwt.sign(
    { userId, email: "test@test.com" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

/**
 * Cria um usuário de teste e retorna o token
 */
export async function createTestUserAndToken(prisma: PrismaClient): Promise<{ token: string; userId: number }> {
  const hashedPassword = await bcrypt.hash("senha123", 10);
  const user = await prisma.usuario.create({
    data: {
      nome: "Usuario Teste",
      email: `test-${Date.now()}@test.com`,
      senha: hashedPassword,
      ativo: true,
    },
  });
  // Token deve ter 'id' e não 'userId' para corresponder ao JwtPayload do AuthService
  const token = jwt.sign(
    { id: user.id, email: user.email, nome: user.nome },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { token, userId: user.id };
}

/**
 * Helper para criar dados de teste
 */
export const testData = {
  cliente: {
    valid: {
      nome: "João da Silva",
      sexo: "M" as const,
      telefone: "(11) 99999-9999",
    },
    validWithAllFields: {
      nome: "Maria Santos",
      sexo: "F" as const,
      telefone: "(21) 98888-8888",
      observacoes: "Cliente VIP",
    },
  },
  orcamento: {
    valid: {
      descricao: "Tatuagem tribal no braço",
      valorTotal: 500.00,
      status: "criado" as const,
    },
    feito: {
      descricao: "Tatuagem colorida nas costas",
      valorTotal: 1500.00,
      status: "feito" as const,
    },
    cancelado: {
      descricao: "Tatuagem cancelada",
      valorTotal: 800.00,
      status: "cancelado" as const,
    },
  },
};

/**
 * Helper para criar cliente de teste
 */
export async function createTestCliente(
  prisma: PrismaClient,
  data = testData.cliente.valid
) {
  return prisma.cliente.create({ data });
}

/**
 * Helper para criar orçamento de teste
 */
export async function createTestOrcamento(
  prisma: PrismaClient,
  clienteId: number,
  data = testData.orcamento.valid
) {
  return prisma.orcamento.create({
    data: {
      ...data,
      clienteId,
    },
  });
}
