// src/controllers/CartController.ts

import { Request, Response } from "express";
import { AddToCart } from "../use_cases/cart/AddToCart";
import { RemoveFromCart } from "../use_cases/cart/RemoveFromCart";
import { GetCart } from "../use_cases/cart/GetCart";
import mongoose from "mongoose";
import { UpdateCartItemQuantity } from "../use_cases/cart/UpdateCartItemQuantity";

export class CartController {
  constructor(
    private addToCartUseCase: AddToCart,
    private removeFromCartUseCase: RemoveFromCart,
    private getCartUseCase: GetCart,
    private updateCartItemQuantityUseCase: UpdateCartItemQuantity
  ) {}

  public async addItemToCart(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.body.userId; // Assuming userId is sent in request body; adjust as needed
      const item = {
        product: req.body.productId,
        quantity: req.body.quantity,
        selectedColor: req.body.selectedColor,
        selectedSize: req.body.selectedSize,
      };

      const cart = await this.addToCartUseCase.execute(userId, item);
      return res
        .status(200)
        .json({ message: "Item added to cart successfully", cart });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async removeItemFromCart(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.body.userId; // Assuming userId is sent in request body; adjust as needed
      const itemId = req.body.itemId // Assuming productId is sent as a URL parameter
      await this.removeFromCartUseCase.execute(userId, itemId);
      return res
        .status(200)
        .json({ message: "Item removed from cart successfully",itemId });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async getCart(req: Request, res: Response): Promise<Response> {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId); // Assuming userId is sent as a URL parameter
      const cart = await this.getCartUseCase.execute(userId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async updateCartItemQuantity(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.body.userId;
      const item = {
        itemId: req.body.itemId,
        quantityChange: req.body.quantity, // This can be positive or negative
      };

      const cart = await this.updateCartItemQuantityUseCase.execute(
        userId,
        item
      );
      return res
        .status(200)
        .json({ message: "Cart item quantity updated successfully", cart });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
