import mongoose from "mongoose";
import { IOrder, Order } from "../entities/Order";

export interface IOrderRepository {
  findAll(): Promise<IOrder[]>;
  create(orderData: Partial<IOrder>): Promise<IOrder>;
  delete(orderId: mongoose.Types.ObjectId): Promise<boolean>;
  update(
    orderId: mongoose.Types.ObjectId,
    orderData: Partial<IOrder>
  ): Promise<IOrder>;
  updatePaymentStatus(
    orderId: mongoose.Types.ObjectId,
    status: string,
    paymentId: string
  ): Promise<IOrder>;
  findById(orderId: mongoose.Types.ObjectId): Promise<IOrder | null>;
  findByUser(userId: mongoose.Types.ObjectId): Promise<IOrder[] | null>; // Specific to orders
}

export class OrderRepository implements IOrderRepository {
  public async findAll(): Promise<IOrder[]> {
    try {
      return await Order.find()
        .populate("userId", "username email") // Populating only username and email
        .exec();
    } catch (error) {
      console.log(error);
      throw new Error("Error retrieving orders");
    }
  }

  public async create(orderData: Partial<IOrder>): Promise<IOrder> {
    try {
      const order = new Order(orderData);
      await order.save();
      // Fetch the newly created order with userId populated
      return await Order.findById(order._id)
        .populate("userId", "username email")
        .exec();
    } catch (error) {
      console.log(error);
      throw new Error("Error creating order");
    }
  }

  public async delete(orderId: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const result = await Order.deleteOne({ _id: orderId }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error("Error deleting order");
    }
  }

  public async update(
    orderId: mongoose.Types.ObjectId,
    orderData: Partial<IOrder>
  ): Promise<IOrder> {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, orderData, {
        new: true,
      }).exec();
      if (!updatedOrder) {
        throw new Error("Order not found");
      }
      return updatedOrder;
    } catch (error) {
      throw new Error("Error updating order");
    }
  }

  async updatePaymentStatus(
    orderId: mongoose.Types.ObjectId,
    status: string,
    paymentId: string
  ): Promise<IOrder> {
    try {
      // Using dot notation to access nested fields
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            "paymentDetails.paymentId": paymentId, // Assuming the field is named transactionId, adjust if needed
            paymentStatus: status,
            orderStatus: "Placed",
          },
        },
        { new: true }
      ).exec();

      if (!updatedOrder) {
        throw new Error("Order not found");
      }
      return updatedOrder;
    } catch (error) {
      throw new Error("Error updating order");
    }
  }

  public async findById(
    orderId: mongoose.Types.ObjectId
  ): Promise<IOrder | null> {
    try {
      return await Order.findById(orderId)
        .populate("userId", "username email") // Populating only username and email
        .exec();
    } catch (error) {
      throw new Error("Error finding order");
    }
  }

  public async findByUser(
    userId: mongoose.Types.ObjectId
  ): Promise<IOrder[] | null> {
    try {
      return await Order.find({ userId: userId })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new Error("Error finding orders for user");
    }
  }
}
