// src/use_cases/order/CancelOrder.ts

import { IOrderRepository } from "../../repositories/OrderRepository";
import mongoose from "mongoose";

export class CancelOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: mongoose.Types.ObjectId) {
    // Update the order status to "Cancelled"
    // Process a refund if necessary
    const result = await this.orderRepository.update(orderId, { orderStatus: "Cancelled" });
    return result;
  }
}
