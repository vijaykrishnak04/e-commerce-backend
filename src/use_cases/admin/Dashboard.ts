import { IAdminRespository } from "../../repositories/AdminRespository";
import { ICategory, Category } from "../../entities/Category";
import { IOrder, Order } from "../../entities/Order";
import { Product, IProduct } from "../../entities/Product";
import { User, IUser } from "../../entities/User";
import { IAdmin } from "../../entities/Admin";
import { FilterQuery } from "mongoose";

export class DashboardUseCase {
  constructor(private adminRepository: IAdminRespository) {}

  async execute(filter: any): Promise<any> {
    const query: FilterQuery<IOrder> = {};

    // Apply filter based on frontend input (e.g., orderStatus)
    if (filter.orderStatus) {
      query.orderStatus = filter.orderStatus;
    }

    // Get total counts
    const totalCategories = await Category.find().countDocuments();
    const totalProducts = await Product.find().countDocuments();
    const totalUsers = await User.find().countDocuments();
    const totalOrders = await Order.find(query).countDocuments();

    // Calculate last day's increments
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const lastDayUsersIncrement = await User.find({ createdAt: { $gte: yesterday } }).countDocuments();
    const lastDayOrders = await Order.find({ createdAt: { $gte: yesterday } }).countDocuments();

    return {
      totalCategories,
      totalProducts,
      totalUsers,
      totalOrders,
      lastDayUsersIncrement,
      lastDayOrders,
    };
  }
}
