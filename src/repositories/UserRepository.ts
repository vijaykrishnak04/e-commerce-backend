// src/repositories/UserRepository.ts
import { User, IUser } from "../entities/User";
import bcrypt from "bcryptjs";

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  isValidPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  // Other necessary methods...
}


export class UserRepository implements IUserRepository {
  async create(userData: IUser): Promise<IUser> {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).exec();
    return user ? user : null;
  }

  async isValidPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Implement other methods as required...
}
