// src/use_cases/Login.ts

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils";
import { IUserRepository } from "../../repositories/UserRepository";
import { IUser } from "src/entities/User";

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string
  ): Promise<{
    userCredentials: IUser;
    accessToken: String;
    refreshToken: String;
  }> {
    //verify the user and generate a JWT token.
    const user = await this.userRepository.findByEmail(email);
    if (
      !user ||
      !(await this.userRepository.isValidPassword(
        password,
        user?.password
      ))
    ) {
      throw new Error("Invalid username or password.");
    }

    const userPayload = {
      _id: user._id,
      roles: user.roles, // Assuming roles is a string array
    };

    // Convert the Mongoose document to a plain JavaScript object
    const userCredentials = user.toObject();

    // Remove the password field from the object
    delete userCredentials.password;

    const accessToken = await generateAccessToken(userPayload);
    const refreshToken = await generateRefreshToken(userPayload);

    return { userCredentials, accessToken, refreshToken };
  }
}
