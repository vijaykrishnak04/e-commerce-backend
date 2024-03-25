// src/use_cases/category/DeleteCategory.ts

import mongoose from "mongoose";
import { ICategoryRepository } from "../../repositories/CategoryRepository";
import { deleteFiles } from "../../services/cloudinary";

export class DeleteCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(categoryId: mongoose.Types.ObjectId, publicId: string): Promise<boolean> {
    deleteFiles([publicId])
    return this.categoryRepository.deleteById(categoryId);
  }
}
