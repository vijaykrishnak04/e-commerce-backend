import mongoose from "mongoose";
import { ICategory } from "../../entities/Category";
import { ICategoryRepository } from "../../repositories/CategoryRepository";
import { deleteFiles } from "../../services/cloudinary";

interface CategoryData {
  categoryName: string;
  subcategories: string[];
  feature: boolean;
  files?: { path: string; filename: string }[];
  ThumbnailToDelete?: string;
  BannerToDelete?: string;
}

export class EditCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(
    id: mongoose.Types.ObjectId,
    categoryData: CategoryData
  ): Promise<ICategory> {
    try {
      // Collect all images to delete if specified
      const imagesToDelete: string[] = [];
      if (categoryData?.ThumbnailToDelete) {
        imagesToDelete.push(categoryData.ThumbnailToDelete);
      }
      if (categoryData?.BannerToDelete) {
        imagesToDelete.push(categoryData.BannerToDelete);
      }

      // Delete old images from cloud storage
      if (imagesToDelete.length > 0) {
        await deleteFiles(imagesToDelete);
      }

      // Prepare the updated category object
      const updatedCategory: Partial<ICategory> & {
        categoryImage?: { url: string; publicId: string };
        bannerImage?: { url: string; publicId: string };
      } = {
        categoryName: categoryData.categoryName,
        subcategories: categoryData.subcategories,
        feature: categoryData.feature,
      };

      // If there are new files uploaded, process them
      if (categoryData.files && categoryData.files.length) {
        categoryData.files.forEach((file, index) => {
          const key = index === 0 ? "categoryImage" : "bannerImage";
          updatedCategory[key] = {
            url: file.path,
            publicId: file.filename,
          };
        });
      }

      // Update the category in the database
      const result = await this.categoryRepository.updateById(
        id,
        updatedCategory as ICategory
      );
      if (!result) {
        throw new Error("Category update failed or category not found.");
      }
      return result;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
}
