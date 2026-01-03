import type { Request, Response, NextFunction } from "express";
import { authService, type JwtPayload } from "../services/AuthService";

// Extender a interface Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware de autenticacao JWT
 * Protege rotas que requerem autenticacao
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obter token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: "Token de autenticacao nao fornecido",
      });
      return;
    }

    // Verificar formato Bearer token
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        success: false,
        error: "Formato de token invalido. Use: Bearer <token>",
      });
      return;
    }

    const token = parts[1];

    // Verificar e decodificar token
    try {
      const decoded = authService.verifyToken(token);
      
      // Verificar se usuario ainda existe e esta ativo
      const usuario = await authService.findById(decoded.id);
      if (!usuario) {
        res.status(401).json({
          success: false,
          error: "Token invalido ou expirado",
        });
        return;
      }

      // Adicionar dados do usuario na requisicao
      req.user = decoded;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: "Token invalido ou expirado",
      });
      return;
    }
  } catch (error) {
    console.error("Erro no middleware de autenticacao:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};
