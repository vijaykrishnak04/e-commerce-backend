import mongoose from "mongoose";
import { IProduct } from "src/entities/Product";
import { IProductRepository } from "src/repositories/ProductRepository";

export class ViewProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async getProductById(id: mongoose.Types.ObjectId): Promise<IProduct> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      return product;
    } catch (error) {
      // Log the error or handle it as needed
      console.error("Error getting product by ID:", error);
      throw new Error(error);
    }
  }

  async getNewArrival(): Promise<IProduct[]> {
    try {
      const product = await this.productRepository.findNew();
      return product;
    } catch (error) {
      // Log the error or handle it as needed
      console.error("Error getting products", error);
      throw new Error(error);
    }
  }

  async getAllProducts(): Promise<IProduct[]> {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      console.error("Error getting all products:", error);
      throw new Error("An error occurred while fetching all products.");
    }
  }

  async getProductsByCategory(category: string): Promise<IProduct[]> {
    try {
      const products = await this.productRepository.findByCategory(category);
      if (products.length === 0) {
        throw new Error(`No products found in the category: ${category}.`);
      }
      return products;
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw new Error("An error occurred while fetching products by category.");
    }
  }

  async searchProducts(query: string): Promise<IProduct[]> {
    try {
      const products = await this.productRepository.search(query);
      if (products.length === 0) {
        throw new Error(`No products found matching the query: ${query}.`);
      }
      return products;
    } catch (error) {
      console.error("Error searching products:", error);
      throw new Error(error);
    }
  }
}
