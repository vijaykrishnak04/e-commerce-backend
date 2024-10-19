// src/routes/productRoutes.ts

import { NextFunction, Request, Response, Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { AddProductUseCase } from "../use_cases/product/AddProduct";
import { ProductRepository } from "../repositories/ProductRepository";
import { ViewProductUseCase } from "../use_cases/product/ViewProduct";
import { authenticateAdmin } from "../middlewares/authenticate";
import { uploadFiles } from "../services/cloudinary";
import { DeleteProductUseCase } from "../use_cases/product/DeleteProduct";
import { EditProductUseCase } from "../use_cases/product/EditProduct";

const productController = new ProductController(
  new AddProductUseCase(new ProductRepository()),
  new ViewProductUseCase(new ProductRepository()),
  new DeleteProductUseCase(new ProductRepository()),
  new EditProductUseCase(new ProductRepository())
);

const router = Router();

router.post(
  "/add-product",
  authenticateAdmin,
  uploadFiles,
  (req: Request, res: Response) => {
    productController.addProduct(req, res);
  }
);

router.patch(
  "/edit-product/:productId",
  authenticateAdmin,
  uploadFiles,
  (req: Request, res: Response) => {
    productController.editProduct(req, res);
  }
);

router.delete(
  "/delete-product/:id",
  authenticateAdmin,
  (req: Request, res: Response) => {
    productController.deleteProduct(req, res);
  }
);

router.get("/get-all-products", (req: Request, res: Response) => {
  productController.getProducts(req, res);
});

router.get("/new-arrival", (req: Request, res: Response) => {
  productController.getNewArrived(req, res);
});

router.get("/c", (req: Request, res: Response) => {
  productController.getProductByCategory(req, res);
});

router.get("/search-product/:query", (req: Request, res: Response) => {
  productController.searchProducts(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  productController.getProductById(req, res);
});

export default router;
