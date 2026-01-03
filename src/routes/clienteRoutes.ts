import { Router } from "express";
import { clienteController } from "../controllers";

const router = Router();

// GET /clientes/search - Busca clientes por nome
router.get("/search", (req, res, next) => clienteController.search(req, res, next));

// GET /clientes - Lista todos os clientes
router.get("/", (req, res, next) => clienteController.index(req, res, next));

// GET /clientes/create - Formulário de criação
router.get("/create", (req, res, next) => clienteController.create(req, res, next));

// POST /clientes - Cria um novo cliente
router.post("/", (req, res, next) => clienteController.store(req, res, next));

// GET /clientes/:id - Exibe detalhes de um cliente
router.get("/:id", (req, res, next) => clienteController.show(req, res, next));

// GET /clientes/:id/edit - Formulário de edição
router.get("/:id/edit", (req, res, next) => clienteController.edit(req, res, next));

// PUT /clientes/:id - Atualiza um cliente
router.put("/:id", (req, res, next) => clienteController.update(req, res, next));

// DELETE /clientes/:id - Remove um cliente
router.delete("/:id", (req, res, next) => clienteController.destroy(req, res, next));

export default router;
