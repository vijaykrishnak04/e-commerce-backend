// src/use_cases/order/GetOrderDetails.ts

import { IOrderRepository } from "../../repositories/OrderRepository";
import mongoose from "mongoose";

export class GetOrderDetailsUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: mongoose.Types.ObjectId) {
    const orderDetails = await this.orderRepository.findById(orderId);
    if (!orderDetails) throw new Error("Order not found");
    return orderDetails;
  }

  async getAll() {
    const orderDetails = await this.orderRepository.findAll();
    if (!orderDetails) throw new Error("Order not found");
    return orderDetails;
  }
}
