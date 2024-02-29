// src/use_cases/SignUp.ts

import { User, IUser } from "../../entities/User";
import { IUserRepository } from "../../repositories/UserRepository";
import bcrypt from "bcryptjs";

export class SignUpUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    username: string,
    password: string,
    email: string
  ): Promise<IUser> {
    // Input validation (this can be more complex with proper validation rules)
    if (!username.trim() || !password || password.length < 6 || !email.trim()) {
      throw new Error("Invalid input data");
    }

    // Check for existing users with the same username or email
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with the given username or email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user entity
    const user = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });

    // Persist the new user entity to the repository
    return await this.userRepository.create(user);
  }
}
