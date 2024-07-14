// src/repositories/UserRepository.ts
import mongoose from "mongoose";
import Otp, { IOtp } from "../entities/Otp";
import { User, IUser } from "../entities/User";
import bcrypt from "bcryptjs";

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  create(userData: IUser): Promise<IUser>;
  findById(userId: mongoose.Types.ObjectId): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  isValidPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  findOtp(email: string): Promise<IOtp | null>;
  update(
    userId: mongoose.Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  async findAll(): Promise<IUser[]> {
    return User.find().select("-password");
  }
  async create(userData: IUser): Promise<IUser> {
    const newUser = new User(userData);
    await newUser.save();

    // Convert the Mongoose document to a plain JavaScript object
    const userObject = newUser.toObject();

    // Remove the password field from the object
    delete userObject.password;

    // Return the object without the password field
    return userObject;
  }

  async findById(userId: mongoose.Types.ObjectId): Promise<IUser> {
    return User.findById(userId);
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

  async findOtp(email: string): Promise<IOtp> {
    return await Otp.findOne({ email: email });
  }

  async update(
    userId: mongoose.Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).exec();
    const userObject = updatedUser.toObject();

    // Remove the password field from the object
    delete userObject.password;

    // Return the object without the password field
    return userObject;
  }
}
