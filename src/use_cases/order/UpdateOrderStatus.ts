// src/use_cases/order/UpdateOrderStatus.ts

import { IOrderRepository } from "../../repositories/OrderRepository";
import mongoose from "mongoose";

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: mongoose.Types.ObjectId, newStatus: "Shipped" | "Delivered" | "Pending" | "Cancelled") {
    // Validate new status
    // Update the order status in the database
    const updatedOrder = await this.orderRepository.update(orderId, { orderStatus: newStatus });
    return updatedOrder;
  }
}
