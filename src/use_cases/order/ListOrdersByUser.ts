// src/use_cases/order/ListOrdersByUser.ts

import { IOrderRepository } from "../../repositories/OrderRepository";
import mongoose from "mongoose";

export class ListOrdersByUserUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: mongoose.Types.ObjectId) {
    const orders = await this.orderRepository.findByUser(userId);
    return orders;
  }
}
