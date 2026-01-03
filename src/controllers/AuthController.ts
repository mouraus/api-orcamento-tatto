import type { Request, Response } from "express";
import { authService } from "../services/AuthService";
import { registerUsuarioSchema, loginSchema, updateUsuarioSchema } from "../validators/authValidator";

export class AuthController {
  /**
   * POST /auth/register
   * Registra um novo usuario
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = registerUsuarioSchema.parse(req.body);
      const usuario = await authService.register(data);

      res.status(201).json({
        success: true,
        message: "Usuario registrado com sucesso",
        data: usuario,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(422).json({
          success: false,
          error: "Dados invalidos",
          details: error.errors,
        });
        return;
      }

      if (error.message === "Email ja cadastrado") {
        res.status(409).json({
          success: false,
          error: error.message,
        });
        return;
      }

      console.error("Erro ao registrar usuario:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * POST /auth/login
   * Realiza login do usuario
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = loginSchema.parse(req.body);
      const result = await authService.login(email, senha);

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: {
          usuario: result.usuario,
          token: result.token,
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(422).json({
          success: false,
          error: "Dados invalidos",
          details: error.errors,
        });
        return;
      }

      if (error.message === "Credenciais invalidas" || error.message === "Usuario desativado") {
        res.status(401).json({
          success: false,
          error: error.message,
        });
        return;
      }

      console.error("Erro ao fazer login:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * GET /auth/me
   * Retorna dados do usuario autenticado
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Nao autenticado",
        });
        return;
      }

      const usuario = await authService.findById(req.user.id);
      
      if (!usuario) {
        res.status(404).json({
          success: false,
          error: "Usuario nao encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      console.error("Erro ao buscar usuario:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * PUT /auth/me
   * Atualiza dados do usuario autenticado
   */
  async updateMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Nao autenticado",
        });
        return;
      }

      const data = updateUsuarioSchema.parse(req.body);
      const usuario = await authService.update(req.user.id, data);

      res.json({
        success: true,
        message: "Dados atualizados com sucesso",
        data: usuario,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(422).json({
          success: false,
          error: "Dados invalidos",
          details: error.errors,
        });
        return;
      }

      if (error.message === "Senha atual incorreta" || error.message === "Senha atual e obrigatoria") {
        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      console.error("Erro ao atualizar usuario:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * GET /auth/users
   * Lista todos os usuarios (apenas para admin)
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await authService.findAll();

      res.json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      console.error("Erro ao listar usuarios:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
}

export const authController = new AuthController();
