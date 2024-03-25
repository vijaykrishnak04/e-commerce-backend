// src/repositories/CartRepository.ts

import mongoose from "mongoose";
import { ICart, Cart } from "../entities/Cart";

export interface ICartRepository {
  create(cartData: Partial<ICart>): Promise<ICart>;
  findById(cartId: mongoose.Types.ObjectId): Promise<ICart>;
  deleteById(cartId: mongoose.Types.ObjectId): Promise<boolean>;
  findByUserId(userId: mongoose.Types.ObjectId): Promise<ICart | null>;
  updateById(
    cartId: mongoose.Types.ObjectId,
    updateData: Partial<ICart>
  ): Promise<ICart>;
}

export class CartRepository implements ICartRepository {
  public async create(cartData: Partial<ICart>): Promise<ICart> {
    const cart = new Cart(cartData);
    await cart.save();

    // Assuming `user` is unique and can be used to retrieve the cart
    // Fetch the cart again with populate
    const populatedCart = await Cart.aggregate([
      { $match: { _id: cart._id } },
      {
        $unwind: "$items", // Unwind the items array to join each item with its product details
      },
      {
        $lookup: {
          from: "products", // Assume your products collection is named "products"
          localField: "items.product",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $unwind: "$itemDetails", // Unwind the result of the lookup to access product details
      },
      {
        $project: {
          _id: 1, // Include cart ID if needed
          user: 1, // Include user ID if needed
          "items._id": 1, // Include item ID if needed
          "items.quantity": 1,
          "items.product": 1, // Include product ID if needed
          "items.selectedColor": 1,
          "items.selectedSize": 1,
          productName: "$itemDetails.productName",
          productPrice: "$itemDetails.productPrice",
          image: { $arrayElemAt: ["$itemDetails.images", 0] }, // Get the first image from the images array
        },
      },
      {
        $group: {
          _id: "$_id", // Group back by cart ID
          user: { $first: "$user" }, // Include user ID in the grouped result
          items: {
            $push: {
              // Reconstruct the items array with the formatted documents
              _id: "$items._id",
              product: "$items.product",
              selectedColor: "$items.selectedColor",
              selectedSize: "$items.selectedSize",
              quantity: "$items.quantity",
              productName: "$productName",
              productPrice: "$productPrice",
              image: "$image",
            },
          },
        },
      },
    ]).exec();

    if (!populatedCart) {
      throw new Error("Failed to create or retrieve cart.");
    }

    return populatedCart[0];
  }

  public async deleteById(cartId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await Cart.deleteOne({ _id: cartId }).exec();
    return result.deletedCount > 0;
  }

  public async findById(cartId: mongoose.Types.ObjectId): Promise<ICart> {
    const populatedCart = await Cart.aggregate([
      { $match: { _id: cartId } },
      {
        $unwind: "$items", // Unwind the items array to join each item with its product details
      },
      {
        $lookup: {
          from: "products", // Assume your products collection is named "products"
          localField: "items.product",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $unwind: "$itemDetails", // Unwind the result of the lookup to access product details
      },
      {
        $project: {
          _id: 1, // Include cart ID if needed
          user: 1, // Include user ID if needed
          "items._id": 1, // Include item ID if needed
          "items.quantity": 1,
          "items.product": 1, // Include product ID if needed
          "items.selectedColor": 1,
          "items.selectedSize": 1,
          productName: "$itemDetails.productName",
          productPrice: "$itemDetails.productPrice",
          image: { $arrayElemAt: ["$itemDetails.images", 0] }, // Get the first image from the images array
        },
      },
      {
        $group: {
          _id: "$_id", // Group back by cart ID
          user: { $first: "$user" }, // Include user ID in the grouped result
          items: {
            $push: {
              // Reconstruct the items array with the formatted documents
              _id: "$items._id",
              product: "$items.product",
              selectedColor: "$items.selectedColor",
              selectedSize: "$items.selectedSize",
              quantity: "$items.quantity",
              productName: "$productName",
              productPrice: "$productPrice",
              image: "$image",
            },
          },
        },
      },
    ]).exec();

    if (!populatedCart) {
      throw new Error("Failed to create or retrieve cart.");
    }
    
    return populatedCart[0];
  }

  public async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<ICart | null> {
    return Cart.findOne({ user: userId }).exec();
  }

  public async updateById(
    cartId: mongoose.Types.ObjectId,
    updateData: Partial<ICart>
  ): Promise<ICart> {
    const updatedCart = await Cart.findByIdAndUpdate(cartId, updateData, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedCart) {
      throw new Error("Cart not found");
    }

    const populatedCart = await Cart.aggregate([
      {
        $match: {
          _id: cartId, // Match the user's cart
        },
      },
      {
        $unwind: "$items", // Unwind the items array to join each item with its product details
      },
      {
        $lookup: {
          from: "products", // Assume your products collection is named "products"
          localField: "items.product",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $unwind: "$itemDetails", // Unwind the result of the lookup to access product details
      },
      {
        $project: {
          _id: 1, // Include cart ID if needed
          user: 1, // Include user ID if needed
          "items._id": 1, // Include item ID if needed
          "items.quantity": 1,
          "items.product": 1, // Include product ID if needed
          "items.selectedColor": 1,
          "items.selectedSize": 1,
          productName: "$itemDetails.productName",
          productPrice: "$itemDetails.productPrice",
          image: { $arrayElemAt: ["$itemDetails.images", 0] }, // Get the first image from the images array
        },
      },
      {
        $group: {
          _id: "$_id", // Group back by cart ID
          user: { $first: "$user" }, // Include user ID in the grouped result
          items: {
            $push: {
              // Reconstruct the items array with the formatted documents
              _id: "$items._id",
              product: "$items.product",
              selectedColor: "$items.selectedColor",
              selectedSize: "$items.selectedSize",
              quantity: "$items.quantity",
              productName: "$productName",
              productPrice: "$productPrice",
              image: "$image",
            },
          },
        },
      },
    ]).exec();

    if (!populatedCart) {
      throw new Error("Failed to create or retrieve cart.");
    }
    return populatedCart[0];
  }
}
