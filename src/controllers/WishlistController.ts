import { Request, Response } from "express";
import { AddItemToWishlistUseCase } from "../use_cases/wishlist/AddItemToWishlist";
import { RemoveItemFromWishlistUseCase } from "../use_cases/wishlist/RemoveItemFromWishlist";
import { GetUserWishlistUseCase } from "../use_cases/wishlist/GetUserWishlist";
import mongoose from "mongoose";

export class WishlistController {
  constructor(
    private addItemToWishlistUseCase: AddItemToWishlistUseCase,
    private removeItemFromWishlistUseCase: RemoveItemFromWishlistUseCase,
    private getUserWishlistUseCase: GetUserWishlistUseCase
  ) {}

  async addItem(req: Request, res: Response): Promise<Response> {
    const { userId, productId } = req.body;
    try {
      const wishlist = await this.addItemToWishlistUseCase.execute(
        userId,
        productId
      );
      return res.status(200).json({ wishlist, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
    }
  }

  async removeItem(req: Request, res: Response): Promise<Response> {
    const { userId, productId } = req.body;
    try {
      const wishlist = await this.removeItemFromWishlistUseCase.execute(
        userId,
        productId
      );
      return res.status(200).json({ wishlist, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
    }
  }

  async getUserWishlist(req: Request, res: Response): Promise<Response> {
    const userId = new mongoose.Types.ObjectId(req.params.userId); // Assuming userId is passed as a URL parameter
    try {
      const wishlist = await this.getUserWishlistUseCase.execute(userId);
      return res.status(200).json({ wishlist, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
    }
  }

  async getWishlist(req: Request, res: Response): Promise<Response> {
    const userId = new mongoose.Types.ObjectId(req.params.userId); // Assuming userId is passed as a URL parameter
    try {
      const wishlist = await this.getUserWishlistUseCase.populated(userId);
      return res.status(200).json({ wishlist, success: true });
    } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
    }
  }
}
