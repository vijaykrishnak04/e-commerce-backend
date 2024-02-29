import { Request, Response } from "express";
import { SignUpUseCase } from "../use_cases/user/SignUp";
import { LoginUseCase } from "../use_cases/user/Login";

export class UserController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  async signUp(req: Request, res: Response): Promise<Response> {
    const { username, password, email } = req.body;
    try {
      const user = await this.signUpUseCase.execute(username, password, email);
      return res.status(201).json(user);
    } catch (error) {
      // Here you're catching any errors thrown during the signup process
      // and sending them back in the response with a 400 Bad Request status
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const token = await this.loginUseCase.execute(email, password);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
