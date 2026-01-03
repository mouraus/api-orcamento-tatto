import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Rotas publicas
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

// Rotas protegidas
router.get("/me", authMiddleware, (req, res) => authController.me(req, res));
router.put("/me", authMiddleware, (req, res) => authController.updateMe(req, res));
router.get("/users", authMiddleware, (req, res) => authController.listUsers(req, res));

export default router;
