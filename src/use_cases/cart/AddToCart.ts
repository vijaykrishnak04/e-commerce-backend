import mongoose from "mongoose";
import { ICartRepository } from "../../repositories/CartRepository";
import { ICart } from "../../entities/Cart";

export class AddToCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(
    userId: mongoose.Types.ObjectId,
    newItem: {
      product: mongoose.Types.ObjectId;
      quantity: number;
      selectedColor: string | null;
      selectedSize: string | null;
    }
  ): Promise<ICart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (cart) {
      // Adjust the check to consider product, size, and color
      const existingItemIndex = cart.items.findIndex((item) =>
        item.product.equals(newItem.product) &&
        item.selectedColor === newItem.selectedColor &&
        item.selectedSize === newItem.selectedSize
      );

      if (existingItemIndex > -1) {
        // If the exact item exists (including size and color), update its quantity
        cart.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // If the item doesn't exist, or differs by size or color, add it as a new item
        cart.items.push(newItem);
      }

      return await this.cartRepository.updateById(cart._id, {
        items: cart.items,
      });
    } else {
      // If the cart doesn't exist for the user, create a new cart with the item
      return await this.cartRepository.create({
        user: userId,
        items: [newItem],
      });
    }
  }
}
