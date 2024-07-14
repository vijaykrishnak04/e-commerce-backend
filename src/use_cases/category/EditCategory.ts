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
    console.log(categoryData);
    try {
      // Collect all images to delete if specified
      const imagesToDelete: string[] = [];
      if (categoryData?.ThumbnailToDelete) {
        imagesToDelete.push(categoryData.ThumbnailToDelete);
      }
      if (categoryData?.BannerToDelete) {
        imagesToDelete.push(categoryData.BannerToDelete);
      }

      const categoryExist = await this.categoryRepository.findByName(
        categoryData.categoryName
      );
      
      if (categoryExist.categoryName === categoryData.categoryName && id.toString() !== categoryExist._id.toString()) {
        if (categoryData?.files) {
          let deletingFiles = [];
          for (const { filename } of categoryData.files) {
            deletingFiles.push(filename);
          }
          deleteFiles(deletingFiles);
        }
        throw new Error("category with this name already exist");
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
      // Check if ThumbnailToDelete is present
      if (categoryData?.ThumbnailToDelete && !categoryData?.BannerToDelete) {
        // Assign the new thumbnail image to categoryImage field
        updatedCategory.categoryImage = {
          url: categoryData.files[0].path,
          publicId: categoryData.files[0].filename,
        };
      }

      // Check if BannerToDelete is present
      if (categoryData?.BannerToDelete && !categoryData?.ThumbnailToDelete) {
        // Assign the new banner image to bannerImage field
        updatedCategory.bannerImage = {
          url: categoryData.files[0].path,
          publicId: categoryData.files[0].filename,
        };
      }

      if (categoryData?.files && categoryData?.files.length >= 2) {
        updatedCategory.categoryImage = {
          url: categoryData.files[0].path,
          publicId: categoryData.files[0].filename,
        };
        updatedCategory.bannerImage = {
          url: categoryData.files[1].path,
          publicId: categoryData.files[1].filename,
        };
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
