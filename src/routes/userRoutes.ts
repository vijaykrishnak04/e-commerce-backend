// src/routes/userRoutes.ts

import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserRepository } from "../repositories/UserRepository";
import { SignUpUseCase } from "../use_cases/user/SignUp";
import { LoginUseCase } from "../use_cases/user/Login";
import { signUpValidator, loginValidator } from "../validators/userValidators";

const userController = new UserController(
  new SignUpUseCase(new UserRepository()),
  new LoginUseCase(new UserRepository())
);

const router = Router();

router.post("/signup", signUpValidator, (req: Request, res: Response) =>
  userController.signUp(req, res)
);

router.post("/login", loginValidator, (req: Request, res: Response) =>
  userController.login(req, res)
);



export default router;
