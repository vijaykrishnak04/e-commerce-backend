import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminRepository } from "../repositories/AdminRespository";
import { LoginUseCase } from "../use_cases/admin/Login";
import { DashboardUseCase } from "../use_cases/admin/Dashboard";

const router = Router();

const adminController = new AdminController(
  new LoginUseCase(new AdminRepository()),
  new DashboardUseCase()
);

router.post("/login", (req: Request, res: Response) => {
  adminController.login(req, res);
});

router.post("/dashboard", (req: Request, res: Response) => {
  adminController.getDashboardData(req, res);
});

export default router;
