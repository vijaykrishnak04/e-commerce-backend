// src/use_cases/AddItemToWishlist.ts

import { IWishlist } from "../../entities/Wishlist";
import { IWishlistRepository } from "../../repositories/WishlistRepository";
import mongoose from "mongoose";

export class AddItemToWishlistUseCase {
  constructor(private wishlistRepository: IWishlistRepository) {}

  async execute(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist> {
    const wishlist = await this.wishlistRepository.getUserWishlist(userId);
    if (wishlist) {
      return await this.wishlistRepository.addItem(userId, productId);
    } else {
      return await this.wishlistRepository.createWishlist(userId, productId);
    }
  }
}
