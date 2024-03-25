import { Wishlist, IWishlist } from "../entities/Wishlist";
import mongoose from "mongoose";

export interface IWishlistRepository {
  createWishlist(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist>;
  addItem(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist>;
  removeItem(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist | null>;
  getUserWishlist(userId: mongoose.Types.ObjectId): Promise<IWishlist | null>;
  populated(userId: mongoose.Types.ObjectId): Promise<IWishlist | null>;
}

export class WishlistRepository implements IWishlistRepository {
  async createWishlist(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist> {
    const newWishlist = new Wishlist({
      userId,
      products: [productId], // Initialize the wishlist with the provided productId
    });
    await newWishlist.save();
    return newWishlist;
  }

  async addItem(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist> {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { products: productId } }, // Ensures no duplicate product IDs
      { new: true, upsert: true } // Creates a new document if one doesn't exist
    ).exec();
    return wishlist;
  }

  async removeItem(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<IWishlist | null> {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: productId } }, // Removes the product ID from the array
      { new: true }
    ).exec();
    if (!wishlist) {
      return null;
    }
    return wishlist;
  }

  async getUserWishlist(
    userId: mongoose.Types.ObjectId
  ): Promise<IWishlist | null> {
    const wishlist = await Wishlist.findOne({ userId: userId }).exec();
    return wishlist;
  }

  async populated(userId: mongoose.Types.ObjectId): Promise<IWishlist> {
    const wishlist = await Wishlist.findOne({ userId: userId })
      .populate("products") // This line populates the 'products' field
      .exec(); // Executes the query
    return wishlist;
  }
}
