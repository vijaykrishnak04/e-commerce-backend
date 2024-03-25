// src/use_cases/EditUserDetails.ts

import { IUserRepository } from "../../repositories/UserRepository";
import { IUser } from "../../entities/User";
import mongoose from "mongoose";

export class EditUserDetailsUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: mongoose.Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    // Check if the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Update user details
    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new Error("Unable to update user details.");
    }

    return updatedUser;
  }
}
