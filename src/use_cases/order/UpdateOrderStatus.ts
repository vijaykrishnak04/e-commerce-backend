// src/use_cases/order/UpdateOrderStatus.ts

import { IOrderRepository } from "../../repositories/OrderRepository";
import mongoose from "mongoose";

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: mongoose.Types.ObjectId, newStatus: any) {
    // Validate new status
    // Update the order status in the database
    const updatedOrder = await this.orderRepository.update(orderId, newStatus);
    return updatedOrder;
  }
}
