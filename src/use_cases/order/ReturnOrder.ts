// src/use_cases/order/ReturnOrder.ts

import { IOrderRepository } from "../../repositories/OrderRepository";
import mongoose from "mongoose";

export class ReturnOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: mongoose.Types.ObjectId) {
    // Update the order with return details
    const result = await this.orderRepository.update(orderId, { /* Return details here */ });
    return result;
  }
}
