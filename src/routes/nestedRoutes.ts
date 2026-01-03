import { Router } from "express";
import { orcamentoController } from "../controllers";

// Rotas aninhadas para relações entre entidades
const router = Router();

// GET /clientes/:clienteId/orcamentos - Lista orçamentos de um cliente
router.get("/:clienteId/orcamentos", (req, res, next) => orcamentoController.byCliente(req, res, next));

export default router;
