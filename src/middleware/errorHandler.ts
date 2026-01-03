import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodIssue } from "zod";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Middleware global de tratamento de erros
 * Captura erros de validação do Zod e outros erros da aplicação
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("🚨 Erro:", error);

  // Erros de validação do Zod
  if (error instanceof ZodError) {
    const zodError = error as ZodError;
    const errors = zodError.issues.map((issue: ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));


    // Resposta JSON para APIs
    res.status(422).json({
      success: false,
      message: "Erro de validação",
      errors,
    });
    return;
  }

  // Erros do Prisma
  if (error.code === "P2002") {
    const message = "Registro já existe com esses dados";

    res.status(409).json({
      success: false,
      message,
    });
    return;
  }

  if (error.code === "P2025") {
    const message = "Registro não encontrado";

    res.status(404).json({
      success: false,
      message,
    });
    return;
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Erro interno do servidor";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
}

/**
 * Middleware para capturar rotas não encontradas (404)
 */
export function notFoundHandler(req: Request, res: Response): void {
  const message = "Rota não encontrada";

  res.status(404).json({
    success: false,
    message,
    path: req.path,
  });
}
