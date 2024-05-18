import mongoose from "mongoose";
import { IOrderRepository } from "../../repositories/OrderRepository";

export class UpdateShippingStatus {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: mongoose.Types.ObjectId, newStatus: any) {
    try {
      console.log(newStatus);
      const orderDetails = await this.orderRepository.findById(orderId);
      if (!orderDetails) throw new Error("Order not found");
      orderDetails.items[newStatus.index].shippingDetails = {
        ...newStatus,
      };
      // Update the order status in the database
      return await this.orderRepository.update(orderId, orderDetails);
    } catch (error) {
      console.log(error);
      throw new Error("internal server error");
    }
  }
}
