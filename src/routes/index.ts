import { Router } from "express";
import clienteRoutes from "./clienteRoutes";
import orcamentoRoutes from "./orcamentoRoutes";
import nestedRoutes from "./nestedRoutes";
import authRoutes from "./authRoutes";
import { authMiddleware } from "../middleware/authMiddleware";
import { version, name } from "../../package.json";

const router = Router();

// Rotas de autenticacao (publicas)
router.use("/auth", authRoutes);

// Rotas protegidas por autenticacao
router.use("/clientes", authMiddleware, clienteRoutes);
router.use("/orcamentos", authMiddleware, orcamentoRoutes);
router.use("/clientes", authMiddleware, nestedRoutes);

// Rota raiz - Health check (publica)
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sistema de Gerenciamento de Tatuadores",
    version: version,
    name: name,
    endpoints: {
      docs: "/api-docs",
      auth: "/auth",
      clientes: "/clientes",
      orcamentos: "/orcamentos",
    },
  });
});

// Rota de health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: version,
  });
});

export default router;
