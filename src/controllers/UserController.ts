import { Request, Response } from "express";
import { SignUpUseCase } from "../use_cases/user/SignUp";
import { LoginUseCase } from "../use_cases/user/Login";
import { OtpVerify } from "../use_cases/user/OtpVerify";
import mongoose from "mongoose";
import { EditUserDetailsUseCase } from "../use_cases/user/EditUserDetails";
export class UserController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private loginUseCase: LoginUseCase,
    private otpUseCase: OtpVerify,
    private editUserUseCase: EditUserDetailsUseCase
  ) {}

  async signUp(req: Request, res: Response): Promise<Response> {
    const { username, password, email, phone } = req.body;
    try {
      const userCredentials = await this.signUpUseCase.execute(
        username,
        password,
        email,
        phone
      );
      return res.status(200).json({ userCredentials, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async otVerify(req: Request, res: Response): Promise<Response> {
    const { user, otp } = req.body;
    // Convert OTP to number and validate
    const otpNumber = Number(otp);
    // Check if the conversion was successful (not NaN) and it's a 6-digit number
    if (isNaN(otpNumber) || otp.toString().length !== 6) {
      return res.status(400).json({ message: "OTP must be a 6-digit number." });
    }

    try {
      const { userCredentials, accessToken, refreshToken } =
        await this.otpUseCase.execute(user, otpNumber); // Pass otpNumber as a number
      return res
        .status(200)
        .json({ userCredentials, accessToken, refreshToken, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const { userCredentials, accessToken, refreshToken } =
        await this.loginUseCase.execute(email, password);
      return res
        .status(200)
        .json({ userCredentials, accessToken, refreshToken, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async editUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      const userData = req.body;      
      const updatedUser = await this.editUserUseCase.execute(userId, userData);
      return res.status(200).json({ success: true, updatedUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
