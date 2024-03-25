// src/controllers/CategoryController.ts

import { Request, Response } from "express";
import { AddCategory } from "../use_cases/category/AddCategory";
import { DeleteCategory } from "../use_cases/category/DeleteCategory";
import { GetCategories } from "../use_cases/category/GetCategory";
import { EditCategory } from "../use_cases/category/EditCategory";
import mongoose from "mongoose";

export class CategoryController {
  constructor(
    private createCategoryUseCase: AddCategory,
    private deleteCategoryUseCase: DeleteCategory,
    private findAllCategoriesUseCase: GetCategories,
    private editCategoryUseCase: EditCategory
  ) {}

  public async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryData = {
        ...req.body,
        files: req.files,
      };
      const category = await this.createCategoryUseCase.execute(categoryData);
      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const { publicId } = req.body;
      const success = await this.deleteCategoryUseCase.execute(id, publicId);
      if (success) {
        return res.status(200).json({ id });
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async editCategory(req: Request, res: Response): Promise<Response> {
    try {
      const id = new mongoose.Types.ObjectId(req?.params?.id);

      const categoryData = {
        ...req?.body,
        files: req?.files,
      };
      const updatedCategory = await this.editCategoryUseCase.execute(
        id,
        categoryData
      );
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  public async findAllCategories(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const categories = await this.findAllCategoriesUseCase.execute();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async categoryWithProduct(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const categories = await this.findAllCategoriesUseCase.categoryProducts();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
