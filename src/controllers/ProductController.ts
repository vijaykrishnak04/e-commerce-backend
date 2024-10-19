// src/controllers/ProductController.ts

import { Request, Response } from "express";
import { AddProductUseCase } from "../use_cases/product/AddProduct";
import { ViewProductUseCase } from "../use_cases/product/ViewProduct";
import { DeleteProductUseCase } from "../use_cases/product/DeleteProduct";
import { EditProductUseCase } from "../use_cases/product/EditProduct";
import mongoose from "mongoose";

export class ProductController {
  constructor(
    private addProductUseCase: AddProductUseCase,
    private viewProductUseCase: ViewProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    private editProductUseCase: EditProductUseCase
  ) {}

  public async addProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productData = {
        ...req.body,
        files: req.files,
      };

      const addedProduct = await this.addProductUseCase.execute(productData);
      console.log(addedProduct);
      return res.status(200).json(addedProduct);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }

  public async editProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productId = new mongoose.Types.ObjectId(req.params.productId);
      const productData = {
        ...req.body,
        files: req?.files,
      };
      const addedProduct = await this.editProductUseCase.execute(
        productId,
        productData
      );
      return res.status(200).json(addedProduct);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: error.message });
    }
  }

  public async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.viewProductUseCase.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async getNewArrived(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.viewProductUseCase.getNewArrival();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async getProductByCategory(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const products = await this.viewProductUseCase.getProductsByCategory(
        req.query
      );
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const productId = new mongoose.Types.ObjectId(req.params.id);
      const product = await this.viewProductUseCase.getProductById(productId);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async searchProducts(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req.params;
      const products = await this.viewProductUseCase.searchProducts(query);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const success = await this.deleteProductUseCase.execute(id);

      if (success) {
        return res
          .status(200)
          .json({ message: "Product successfully deleted.", id });
      } else {
        return res.status(404).json({ message: "Product not found." });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
