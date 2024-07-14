// src/use_cases/EditUserDetails.ts

import { IUserRepository } from "../../repositories/UserRepository";
import { IUser } from "../../entities/User";
import mongoose from "mongoose";

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
  ): Promise<IUser[] | null> {
    // Check if the user exists
    const users = await this.userRepository.findAll();
    if (!users && users.length === 0) {
      throw new Error("User not found");
    }
    return users;
  }
}
