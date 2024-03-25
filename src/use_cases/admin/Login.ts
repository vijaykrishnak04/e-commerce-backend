// use_cases/admin/Login.ts

import { IAdminRespository } from "../../repositories/AdminRespository";
import { IAdmin } from "../../entities/Admin";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils";

export class LoginUseCase {
  constructor(private adminRepository: IAdminRespository) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ accessToken: String; refreshToken: String }> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const isValid = await this.adminRepository.isValidPassword(
      password,
      admin.password
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const adminPayload = {
      _id: admin._id,
      roles: admin.roles,
    };

    const accessToken = await generateAccessToken(adminPayload);
    const refreshToken = await generateRefreshToken(adminPayload);

    return { accessToken, refreshToken };
  }
}
