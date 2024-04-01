// src/routes/userRoutes.ts

import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserRepository } from "../repositories/UserRepository";
import { SignUpUseCase } from "../use_cases/user/SignUp";
import { LoginUseCase } from "../use_cases/user/Login";
import { signUpValidator, loginValidator } from "../validators/userValidators";
import { OtpVerify } from "../use_cases/user/OtpVerify";
import { authenticateUser } from "../middlewares/authenticate";
import { EditUserDetailsUseCase } from "../use_cases/user/EditUserDetails";
import { SendOtpUseCases } from "../use_cases/user/SendOtp";
import { ChangePasswordUseCase } from "../use_cases/user/ChangePassword";

const userController = new UserController(
  new SignUpUseCase(new UserRepository()),
  new LoginUseCase(new UserRepository()),
  new OtpVerify(new UserRepository()),
  new EditUserDetailsUseCase(new UserRepository()),
  new SendOtpUseCases(new UserRepository()),
  new ChangePasswordUseCase(new UserRepository())
);

const router = Router();

router.post("/signup", signUpValidator, (req: Request, res: Response) =>
  userController.signUp(req, res)
);

router.post("/verify-otp", (req: Request, res: Response) =>
  userController.otVerify(req, res)
);

router.post("/login", loginValidator, (req: Request, res: Response) =>
  userController.login(req, res)
);

router.post("/send-otp", (req: Request, res: Response) =>
  userController.sendOtp(req, res)
);

router.patch("/change-password", (req: Request, res: Response) =>
  userController.changePassword(req, res)
);

router.patch(
  "/edit-user/:userId",
  authenticateUser,
  (req: Request, res: Response) => userController.editUser(req, res)
);
export default router;
