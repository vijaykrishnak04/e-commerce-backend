// src/use_cases/cart/GetCart.ts

import mongoose from "mongoose";
import { ICartRepository } from "../../repositories/CartRepository";

export class GetCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: mongoose.Types.ObjectId) {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new Error("No cart found for the user");
    } else {
      return await this.cartRepository.findById(cart._id);
    }
  }
}
