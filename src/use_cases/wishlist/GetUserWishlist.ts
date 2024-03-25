// src/use_cases/GetUserWishlist.ts

import { IWishlistRepository } from "../../repositories/WishlistRepository";
import mongoose from "mongoose";
import { IWishlist } from "../../entities/Wishlist";

export class GetUserWishlistUseCase {
  constructor(private wishlistRepository: IWishlistRepository) {}

  async execute(userId: mongoose.Types.ObjectId): Promise<IWishlist | null> {
    return await this.wishlistRepository.getUserWishlist(userId);
  }

  
  async populated(userId: mongoose.Types.ObjectId): Promise<IWishlist | null> {
    return await this.wishlistRepository.populated(userId);
  }

}
