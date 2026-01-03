import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../../package.json";

// Construir lista de servidores dinamicamente
const servers: Array<{ url: string; description: string }> = [];

// Servidor de desenvolvimento
const devPort = process.env.PORT || 3000;
servers.push({
  url: `http://localhost:${devPort}`,
  description: "Servidor de Desenvolvimento",
});

// Servidor de producao (opcional, via variavel de ambiente)
if (process.env.PRODUCTION_URL) {
  servers.push({
    url: process.env.PRODUCTION_URL,
    description: "Servidor de Producao",
  });
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Gerenciamento de Tatuadores - API",
      version: version,
      description: `
API REST para gerenciamento de tatuadores, clientes e orcamentos.

## Versao: ${version}

## Funcionalidades

- **Autenticacao**: Sistema de login com JWT
- **Clientes**: Cadastro e gerenciamento de clientes
- **Orcamentos**: Criacao e acompanhamento de orcamentos de tatuagens

## Valores Monetarios

Todos os valores monetarios sao armazenados em **reais** com precisao decimal.
Por exemplo: R$ 100,00 = 100.00

## Status de Orcamentos

- \`criado\`: Aguardando aprovacao do cliente
- \`feito\`: Trabalho finalizado
- \`cancelado\`: Orcamento cancelado

## Autenticacao

Esta API utiliza autenticacao JWT (JSON Web Token). Para acessar rotas protegidas:

1. Faca login em \`POST /auth/login\`
2. Copie o token retornado
3. Adicione o header: \`Authorization: Bearer <seu_token>\`
      `,
      contact: {
        name: "Suporte",
        email: "suporte@tatuadores.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: servers,
    tags: [
      {
        name: "Autenticacao",
        description: "Operacoes de login e registro de usuarios",
      },
      {
        name: "Clientes",
        description: "Operacoes relacionadas a clientes",
      },
      {
        name: "Orcamentos",
        description: "Operacoes relacionadas a orcamentos",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido no login",
        },
      },
      schemas: {
        RegisterInput: {
          type: "object",
          properties: {
            nome: { type: "string", minLength: 2, maxLength: 100, example: "Joao Silva" },
            email: { type: "string", format: "email", example: "joao@email.com" },
            senha: { type: "string", minLength: 6, example: "senha123" },
          },
          required: ["nome", "email", "senha"],
        },
        LoginInput: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", example: "joao@email.com" },
            senha: { type: "string", example: "senha123" },
          },
          required: ["email", "senha"],
        },
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Joao Silva" },
            email: { type: "string", format: "email", example: "joao@email.com" },
            ativo: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Cliente: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Maria Silva" },
            sexo: { type: "string", enum: ["M", "F", "Outro"], nullable: true },
            dataNascimento: { type: "string", format: "date-time", nullable: true },
            telefone: { type: "string", nullable: true, example: "(11) 99999-9999" },
            observacoes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "nome"],
        },
        ClienteInput: {
          type: "object",
          properties: {
            nome: { type: "string", minLength: 2, maxLength: 100, example: "Maria Silva" },
            sexo: { type: "string", enum: ["M", "F", "Outro"] },
            dataNascimento: { type: "string", format: "date-time" },
            telefone: { type: "string", pattern: "^\\(\\d{2}\\) \\d{4,5}-\\d{4}$" },
            observacoes: { type: "string", maxLength: 500 },
          },
          required: ["nome"],
        },
        Orcamento: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            clienteId: { type: "integer", example: 1 },
            descricao: { type: "string", example: "Tatuagem floral no braco" },
            valorTotal: { type: "number", format: "decimal", example: 800.00 },
            status: { type: "string", enum: ["criado", "feito", "cancelado"] },
            observacoes: { type: "string", nullable: true },
            dataCriacao: { type: "string", format: "date-time" },
            dataAtualizacao: { type: "string", format: "date-time" },
            cliente: { $ref: "#/components/schemas/Cliente" },
          },
          required: ["id", "clienteId", "descricao", "valorTotal", "status"],
        },
        OrcamentoInput: {
          type: "object",
          properties: {
            clienteId: { type: "integer", example: 1 },
            descricao: { type: "string", minLength: 5, maxLength: 500 },
            valorTotal: { type: "number", format: "decimal", minimum: 0.01, example: 800.00 },
            status: { type: "string", enum: ["criado", "feito", "cancelado"], default: "criado" },
            observacoes: { type: "string", maxLength: 500 },
          },
          required: ["clienteId", "descricao", "valorTotal"],
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string", example: "Erro de validacao" },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: "Nao autenticado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string", example: "Token de autenticacao nao fornecido" },
                },
              },
            },
          },
        },
        NotFound: {
          description: "Recurso nao encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string", example: "Registro nao encontrado" },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Erro de validacao",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
