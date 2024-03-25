// src/use_cases/product/AddProduct.ts

import { json } from "express";
import { IProduct } from "../../entities/Product";
import { IProductRepository } from "../../repositories/ProductRepository";
import { deleteFiles } from "../../services/cloudinary";

export class AddProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productData: any): Promise<IProduct> {
    console.log(productData);
    const productExist = await this.productRepository.findByName(
      productData.productName
    );
    if (productExist) {
      if (productData.files) {
        let deletingFiles = [];
        for (const { filename } of productData.files) {
          deletingFiles.push(filename);
        }
        deleteFiles(deletingFiles);
      }
      throw new Error("Product with this name already exist");
    }
    // Check if specifications is already a JavaScript object/array
    // Only parse if it's a string
    const safelyParseJSON = (jsonString: string) => {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        // Log the error or handle it as needed
        console.error("Error parsing JSON string:", error);
        throw new Error(`Invalid JSON format: ${error.message}`);
      }
    };

    // Use the safelyParseJSON function for parsing
    const parsedSpecifications =
      typeof productData.specifications === "string"
        ? safelyParseJSON(productData.specifications)
        : productData.specifications;

    const parsedColors =
      typeof productData.color === "string"
        ? safelyParseJSON(productData.color)
        : productData.color;

    const parsedSubcategory = productData.subcategory.split(",");
    const parsedSize = productData.size.split(",");

    const numericProductPrice = parseFloat(productData.productPrice);
    const numericStock = parseInt(productData.stock, 10);

    // Handle potential undefined `files`
    const images = productData.files
      ? productData.files.map((file: { path: string; filename: string }) => ({
          url: file.path,
          publicId: file.filename,
        }))
      : [];

    const newProductData = {
      ...productData,
      productPrice: numericProductPrice,
      stock: numericStock,
      specifications: parsedSpecifications,
      subcategory: parsedSubcategory,
      colors: parsedColors,
      size: parsedSize,
      images,
    };

    // Any additional business logic or validations can go here

    return await this.productRepository.add(newProductData);
  }
}
