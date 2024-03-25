// src/use_cases/RemoveItemFromWishlist.ts

import { IWishlist } from "src/entities/Wishlist";
import { IWishlistRepository } from "../../repositories/WishlistRepository";
import mongoose from "mongoose";

export class RemoveItemFromWishlistUseCase {
  constructor(private wishlistRepository: IWishlistRepository) {}

  async execute(userId: mongoose.Types.ObjectId, productId: mongoose.Types.ObjectId): Promise<IWishlist> {
    return await this.wishlistRepository.removeItem(userId, productId);
  }
}
