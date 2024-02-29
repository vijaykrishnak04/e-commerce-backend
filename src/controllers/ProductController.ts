// src/controllers/ProductController.ts

import { Request, Response } from "express";
import { Product } from "src/entities/Product";
import { AddProductUseCase } from "src/use_cases/product/AddProduct";

export class ProductController {
  constructor(private addProductUseCase: AddProductUseCase) {}

  public async addProduct(req: Request, res: Response): Promise<Response> {
    try {
      const {
        productName,
        productPrice,
        stock,
        productDescription,
        category,
        subcategory,
        deliveryTime,
        size,
        sizeType,
        specifications,
      } = req.body;

      const parsedData = JSON.parse(specifications);

      const numericProductPrice = parseFloat(productPrice);
      const numericStock = parseInt(stock, 10);

      const images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      const newProduct = new Product({
        productName,
        productPrice: numericProductPrice,
        stock: numericStock,
        productDescription,
        category,
        subcategory,
        deliveryTime,
        size,
        sizeType,
        specifications: parsedData,
        images,
      });
      const addedProduct = await this.addProductUseCase.execute(newProduct);
      return res.json(addedProduct);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.productRepository.findAll();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const product = await this.productRepository.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async searchProducts(req: Request, res: Response): Promise<Response> {
    try {
      const query = req.query.q as string;
      const products = await this.productRepository.search(query);
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
