// src/use_cases/cart/RemoveFromCart.ts

import mongoose from "mongoose";
import { ICartRepository } from "../../repositories/CartRepository";

export class RemoveFromCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(
    userId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId
  ): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    // Ensure itemId is a string for comparison
    const itemIdStr = itemId.toString();

    // Remove the item from cart by filtering items that don't match the itemId
    const updatedItems = cart.items.filter(
      (item) => item._id.toString() !== itemIdStr
    );
    console.log(updatedItems);

    await this.cartRepository.updateById(cart._id, { items: updatedItems });
  }
}
