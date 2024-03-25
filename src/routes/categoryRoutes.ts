// src/routes/categoryRoutes.ts

import { Request, Response, Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { CategoryRepository } from "../repositories/CategoryRepository";

import { AddCategory } from "../use_cases/category/AddCategory";
import { DeleteCategory } from "../use_cases/category/DeleteCategory";
import { GetCategories } from "../use_cases/category/GetCategory";

import { authenticateAdmin } from "../middlewares/authenticate";
import { uploadFiles } from "../services/cloudinary";
import { EditCategory } from "../use_cases/category/EditCategory";

const categoryRepository = new CategoryRepository();
const categoryController = new CategoryController(
  new AddCategory(categoryRepository),
  new DeleteCategory(categoryRepository),
  new GetCategories(categoryRepository),
  new EditCategory(categoryRepository)
);

const router = Router();

router.post(
  "/add-category",
  authenticateAdmin,
  uploadFiles,
  (req: Request, res: Response) => {
    console.log("request recieved");
    categoryController.createCategory(req, res);
  }
);

router.delete(
  "/delete-category/:id",
  authenticateAdmin,
  (req: Request, res: Response) => {
    categoryController.deleteCategory(req, res);
  }
);

router.patch(
  "/edit-category/:id",
  authenticateAdmin,
  uploadFiles,
  (req: Request, res: Response) => {

    categoryController.editCategory(req, res);
  }
);

router.get("/get-categories", (req, res) => {
  categoryController.findAllCategories(req, res);
});

router.get("/get-categories-product", (req, res) => {
  categoryController.categoryWithProduct(req, res);
});

export default router;
