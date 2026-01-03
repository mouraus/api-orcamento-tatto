import type { Request, Response, NextFunction } from "express";
import { orcamentoService, clienteService } from "../services";
import {
  createOrcamentoSchema,
  updateOrcamentoSchema,
  updateStatusSchema,
  orcamentoIdSchema,
  orcamentoByClienteSchema,
  orcamentoByStatusSchema,
} from "../validators";

export class OrcamentoController {
  /**
   * Lista todos os orçamentos
   * GET /orcamentos
   */
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orcamentos = await orcamentoService.findAll();
      res.json({ success: true, data: orcamentos });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo orçamento
   * POST /orcamentos
   */
  async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createOrcamentoSchema.parse(req.body);
      const { clienteId, ...orcamentoData } = data;

      const orcamento = await orcamentoService.createForCliente(clienteId, orcamentoData);
      res.status(201).json({ success: true, data: orcamento });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exibe detalhes de um orçamento
   * GET /orcamentos/:id
   */
  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = orcamentoIdSchema.parse(req.params);
      const orcamento = await orcamentoService.findById(id);

      if (!orcamento) {
        res.status(404).json({ success: false, message: "Orçamento não encontrado" });
        return;
      }

      res.json({
        success: true,
        data: orcamento,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um orçamento
   * PUT /orcamentos/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = orcamentoIdSchema.parse(req.params);
      const data = updateOrcamentoSchema.parse(req.body);

      const orcamento = await orcamentoService.update(id, data);
      res.json({ success: true, data: orcamento });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza o status de um orçamento
   * PATCH /orcamentos/:id/status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = orcamentoIdSchema.parse(req.params);
      const { status } = updateStatusSchema.parse(req.body);

      const orcamento = await orcamentoService.updateStatus(id, status);
      res.json({ success: true, data: orcamento });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove um orçamento
   * DELETE /orcamentos/:id
   */
  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = orcamentoIdSchema.parse(req.params);
      await orcamentoService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista orçamentos de um cliente
   * GET /clientes/:clienteId/orcamentos
   */
  async byCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clienteId } = orcamentoByClienteSchema.parse(req.params);
      const cliente = await clienteService.findById(clienteId);

      if (!cliente) {
        res.status(404).json({ success: false, message: "Cliente não encontrado" });
        return;
      }

      const orcamentos = await orcamentoService.findByClienteId(clienteId);
      res.json({ success: true, data: { cliente, orcamentos } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista orçamentos por status
   * GET /orcamentos/status/:status
   */
  async byStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = orcamentoByStatusSchema.parse(req.params);
      const orcamentos = await orcamentoService.findByStatus(status);
      res.json({ success: true, data: orcamentos, status });
    } catch (error) {
      next(error);
    }
  }
}

export const orcamentoController = new OrcamentoController();
