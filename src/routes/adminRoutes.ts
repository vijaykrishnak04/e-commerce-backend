import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminRepository } from "../repositories/AdminRespository";
import { LoginUseCase } from "../use_cases/admin/Login";

const router = Router();

const adminController = new AdminController(
  new LoginUseCase(new AdminRepository())
);

router.post("/login", (req: Request, res: Response) => {
  adminController.login(req, res);
});

export default router;
