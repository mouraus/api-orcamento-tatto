import { Router } from "express";
import { orcamentoController } from "../controllers";

const router = Router();

// GET /orcamentos/status/:status - Lista orçamentos por status
router.get("/status/:status", (req, res, next) => orcamentoController.byStatus(req, res, next));

// GET /orcamentos - Lista todos os orçamentos
router.get("/", (req, res, next) => orcamentoController.index(req, res, next));

// GET /orcamentos/create - Formulário de criação
router.get("/create", (req, res, next) => orcamentoController.create(req, res, next));

// POST /orcamentos - Cria um novo orçamento
router.post("/", (req, res, next) => orcamentoController.store(req, res, next));

// GET /orcamentos/:id - Exibe detalhes de um orçamento
router.get("/:id", (req, res, next) => orcamentoController.show(req, res, next));

// GET /orcamentos/:id/edit - Formulário de edição
router.get("/:id/edit", (req, res, next) => orcamentoController.edit(req, res, next));

// PUT /orcamentos/:id - Atualiza um orçamento
router.put("/:id", (req, res, next) => orcamentoController.update(req, res, next));

// PATCH /orcamentos/:id/status - Atualiza o status de um orçamento
router.patch("/:id/status", (req, res, next) => orcamentoController.updateStatus(req, res, next));

// DELETE /orcamentos/:id - Remove um orçamento
router.delete("/:id", (req, res, next) => orcamentoController.destroy(req, res, next));

export default router;
