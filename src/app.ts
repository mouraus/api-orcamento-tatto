import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware";
import { swaggerSpec } from "./config/swagger";

// Criar aplicação Express
const app: Application = express();

const PORT = process.env.PORT || 8080;

// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================

// CORS - Permitir todas as origens (desativado para desenvolvimento)
app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// ==========================================
// DOCUMENTAÇÃO SWAGGER
// ==========================================

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Tatuadores - Documentação",
}));

// Endpoint para JSON da spec OpenAPI
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ==========================================
// ROTAS
// ==========================================

// Rotas da aplicação
app.use(routes);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

// Rota não encontrada (404)
app.use(notFoundHandler);

// Tratamento global de erros
app.use(errorHandler);

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

// Apenas inicia o servidor se não for ambiente de teste
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("================================================");
    console.log("   Sistema de Gerenciamento de Tatuadores");
    console.log("================================================");
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`Documentacao: http://localhost:${PORT}/api-docs`);
    console.log("================================================\n");
    console.log("Rotas disponiveis:");
    console.log("   GET  /api-docs             - Documentação Swagger");
    console.log("   GET  /api-docs.json        - OpenAPI Spec (JSON)");
    console.log("");
    console.log("   GET  /clientes             - Lista de clientes");
    console.log("   POST /clientes             - Criar cliente");
    console.log("   GET  /clientes/:id         - Detalhes do cliente");
    console.log("   PUT  /clientes/:id         - Atualizar cliente");
    console.log("   DELETE /clientes/:id       - Remover cliente");
    console.log("");
    console.log("   GET  /orcamentos           - Lista de orçamentos");
    console.log("   POST /orcamentos           - Criar orçamento");
    console.log("   GET  /orcamentos/:id       - Detalhes do orçamento");
    console.log("   PUT  /orcamentos/:id       - Atualizar orçamento");
    console.log("   PATCH /orcamentos/:id/status - Atualizar status");
    console.log("   DELETE /orcamentos/:id     - Remover orçamento");
    console.log("");
    console.log("   POST /auth/register        - Registrar usuario");
    console.log("   POST /auth/login           - Fazer login");
    console.log("   GET  /auth/me              - Dados do usuario logado");
    console.log("   PUT  /auth/me              - Atualizar usuario");
    console.log("\n================================================\n");
  });
}

// Exportar app para testes
export { app };
