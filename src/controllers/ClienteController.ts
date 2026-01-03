import type { Request, Response, NextFunction } from "express";
import { clienteService } from "../services";
import {
  createClienteSchema,
  updateClienteSchema,
  clienteIdSchema,
  searchClienteSchema,
} from "../validators";

export class ClienteController {
  /**
   * Lista todos os clientes
   * GET /clientes
   */
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientes = await clienteService.findAll();
      res.json({ success: true, data: clientes });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo cliente
   * POST /clientes
   */
  async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createClienteSchema.parse(req.body);
      const cliente = await clienteService.create(data);
      res.status(201).json({ success: true, data: cliente });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exibe detalhes de um cliente
   * GET /clientes/:id
   */
  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = clienteIdSchema.parse(req.params);
      const cliente = await clienteService.findByIdWithOrcamentos(id);

      if (!cliente) {
        res.status(404).json({ success: false, message: "Cliente não encontrado" });
        return;
      }

      res.json({ success: true, data: cliente });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um cliente
   * PUT /clientes/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = clienteIdSchema.parse(req.params);
      const data = updateClienteSchema.parse(req.body);

      const cliente = await clienteService.update(id, data);
      res.json({ success: true, data: cliente });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove um cliente
   * DELETE /clientes/:id
   */
  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = clienteIdSchema.parse(req.params);
      await clienteService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca clientes por nome
   * GET /clientes/search?nome=xxx
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome } = searchClienteSchema.parse(req.query);
      const clientes = await clienteService.searchByName(nome);
      res.json({ success: true, data: clientes, termo: nome });
    } catch (error) {
      next(error);
    }
  }
}

export const clienteController = new ClienteController();
