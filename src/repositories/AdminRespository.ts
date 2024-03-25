import { Admin, IAdmin } from "../entities/Admin";
import bcrypt from 'bcryptjs';

export interface IAdminRespository {
  create(adminData: IAdmin): Promise<IAdmin>;
  findAll(): Promise<IAdmin[]>;
  findById(adminId: string): Promise<IAdmin | null>;
  findByEmail(email: string): Promise<IAdmin | null>;
  isValidPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
export class AdminRepository implements IAdminRespository {
  public async create(adminData: IAdmin): Promise<IAdmin> {
    const newUser = new Admin(adminData);
    await newUser.save();
    return newUser;
  }

  async findAll(): Promise<IAdmin[]> {
    const allAdmin = await Admin.find();
    return allAdmin;
  }
  public async findById(adminId: string): Promise<IAdmin | null> {
    return await Admin.findById(adminId);
  }

  public async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }

  public async isValidPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Add more methods for managing products, orders, etc.
}
