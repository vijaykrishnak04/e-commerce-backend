import mongoose from "mongoose";
import { ICartRepository } from "../../repositories/CartRepository";
import { ICart } from "../../entities/Cart";

export class UpdateCartItemQuantity {
  constructor(private cartRepository: ICartRepository) {}

  async execute(
    userId: mongoose.Types.ObjectId,
    item: { itemId: mongoose.Types.ObjectId; quantityChange: number }
  ): Promise<ICart> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex((cartItem) =>
      cartItem._id.equals(item.itemId)
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    // Update the item's quantity based on the quantityChange value
    cart.items[itemIndex].quantity += item.quantityChange;

    // Optionally enforce a non-negative quantity
    cart.items[itemIndex].quantity = Math.max(
      0,
      cart.items[itemIndex].quantity
    );

    // Update the cart with the new item quantity
    return await this.cartRepository.updateById(cart._id, {
      items: cart.items,
    });
  }
}
