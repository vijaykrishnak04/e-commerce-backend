// src/use_cases/category/CreateCategory.ts

import { ICategory } from "../../entities/Category";
import { ICategoryRepository } from "../../repositories/CategoryRepository";

export class AddCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(categoryData: any): Promise<ICategory> {
    const categoryExist = await this.categoryRepository.findByName(
      categoryData.categoryName
    );
    if (categoryExist) {
      throw new Error("category with this name already exist");
    }
    const { filename, path } = categoryData.files[0];
    const bannerImage = categoryData.files[1];

    console.log(categoryData);

    const category = {
      categoryName: categoryData.categoryName,
      subcategories: categoryData.subcategories,
      feature: categoryData.feature,
      categoryImage: {
        url: path,
        publicId: filename,
      },
      bannerImage: {
        url: bannerImage.path,
        publicId: bannerImage.filename,
      },
    };
    return await this.categoryRepository.create(category);
  }
}
