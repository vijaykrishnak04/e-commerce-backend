import { Request, Response } from "express";
import { LoginUseCase } from "../use_cases/admin/Login";

export class AdminController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      console.log(req.body);
      
      const { accessToken, refreshToken } = await this.loginUseCase.execute(
        email,
        password
      );
      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  
  async getDashboardData(req: Request, res: Response): Promise<Response> {
    try {
      const data = "dashboard data"
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  
}
