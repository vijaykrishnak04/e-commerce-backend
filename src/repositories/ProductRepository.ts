// src/repositories/ProductRepository.ts

import mongoose from "mongoose";
import { Product, IProduct } from "../entities/Product";
import { Cart } from "../entities/Cart";
import { Wishlist } from "../entities/Wishlist";

export interface IProductRepository {
  add(productData: IProduct): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  findById(productId: mongoose.Types.ObjectId): Promise<IProduct | null>;
  findNew(): Promise<IProduct[]>;
  findByName(productName: string): Promise<IProduct | null>;
  findByCategory(category: string): Promise<IProduct[]>;
  search(query: string): Promise<IProduct[]>;
  deleteById(productId: mongoose.Types.ObjectId): Promise<Boolean>;
}

type SearchQueryCondition = {
  productName?: { $regex: string; $options: string };
  category?: { $regex: string; $options: string };
  brand?: { $regex: string; $options: string };
  productPrice?: number | { $gte: number; $lte: number };
  subcategory?: { $regex: string; $options: string };
};

export class ProductRepository implements IProductRepository {
  public async add(productData: IProduct): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  public async findAll(): Promise<IProduct[]> {
    return await Product.find().exec();
  }

  public async findNew(): Promise<IProduct[]> {
    return await Product.find().sort({ createdAt: -1 }).limit(50)
  }

  public async findById(
    productId: mongoose.Types.ObjectId
  ): Promise<IProduct | null> {
    return await Product.findById(productId).exec();
  }

  public async findByName(productName: string): Promise<IProduct> {
    return await Product.findOne({ productName: productName });
  }

  public async findByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({ category }).exec();
  }

  public async search(query: string): Promise<IProduct[]> {
    // Initialize an array to hold search conditions
    const searchConditions: any[] = [];

    // Regex to find numeric values in the query
    const numericRegex = /\b\d+\b/g;
    const numericMatches = query.match(numericRegex);
    const numericQuery = numericMatches ? parseFloat(numericMatches[0]) : null;

    // Remove numeric part from query to isolate text part
    const textQuery = query.replace(numericRegex, "").trim();

    // Text-based search conditions
    if (textQuery) {
      searchConditions.push(
        ...[
          { productName: { $regex: textQuery, $options: "i" } },
          { category: { $regex: textQuery, $options: "i" } },
          { brand: { $regex: textQuery, $options: "i" } },
          { subcategory: { $regex: textQuery, $options: "i" } },
        ]
      );
    }

    // Numeric-based search condition for price
    if (numericQuery !== null) {
      searchConditions.push({
        productPrice: {
          $gte: numericQuery - 1000, // Adjust range as necessary
          $lte: numericQuery + 1000,
        },
      });
    }

    // Ensure there are search conditions to apply
    if (searchConditions.length === 0) return [];

    return await Product.find({ $or: searchConditions }).exec();
  }

  public async deleteById(
    productId: mongoose.Types.ObjectId
  ): Promise<Boolean> {
    const result = await Product.deleteOne({ _id: productId }).exec();
    await Cart.updateMany({}, { $pull: { products: productId } }).exec();
    await Wishlist.updateMany({}, { $pull: { products: productId } }).exec();

    return result.deletedCount > 0;
  }
}
