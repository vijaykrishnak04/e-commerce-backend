// src/repositories/CategoryRepository.ts

import mongoose from "mongoose";
import { ICategory, Category } from "../entities/Category";

export interface ICategoryRepository {
  create(categoryData: Partial<ICategory>): Promise<ICategory>;
  deleteById(categoryId: mongoose.Types.ObjectId): Promise<boolean>;
  findAll(): Promise<ICategory[]>;
  findByName(categoryName: string): Promise<boolean>;
  updateById(
    categoryId: mongoose.Types.ObjectId,
    updateData: Partial<ICategory>
  ): Promise<ICategory>;
  categoryProduct(): Promise<ICategory[] | any[]>;
}

export class CategoryRepository implements ICategoryRepository {
  public async categoryProduct(): Promise<ICategory[] | any[]> {
    const results = await Category.aggregate([
      // Initial match to filter categories if needed
      {
        $match: { feature: true },
      },
      // Lookup to join with products
      {
        $lookup: {
          from: "products",
          let: { categoryName: "$categoryName" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$category", "$$categoryName"] },
              },
            },
            { $sort: { createdAt: -1 } }, // Sort if needed
          ],
          as: "products",
        },
      },
      { $unwind: "$products" },
      {
        $unwind: {
          path: "$products.subcategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Group by category and subcategory
      {
        $group: {
          _id: {
            categoryName: "$categoryName",
            subcategory: "$products.subcategory",
          },
          categoryDoc: { $first: "$$ROOT" },
          products: { $push: "$products" },
        },
      },
      {
        $addFields: {
          products: { $slice: ["$products", 8] },
        },
      },
      // Regroup to collect subcategory groups
      {
        $group: {
          _id: "$_id.categoryName",
          categoryDoc: { $first: "$categoryDoc" },
          subcategoryGroups: {
            $push: { subcategory: "$_id.subcategory", products: "$products" },
          },
        },
      },
      {
        $addFields: {
          subcategoryGroups: { $slice: ["$subcategoryGroups", 3] },
        },
      },
      // Include only the subcategories that have been grouped
      {
        $addFields: {
          "categoryDoc.subcategories": {
            $map: {
              input: "$subcategoryGroups",
              as: "group",
              in: "$$group.subcategory",
            },
          },
        },
      },
      // Replace the root document
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$categoryDoc",
              { subcategoryGroups: "$subcategoryGroups" },
            ],
          },
        },
      },
      // Optionally, project fields
      {
        $project: {
          categoryName: 1,
          categoryImage: 1,
          bannerImage: 1,
          subcategories: 1,
          subcategoryGroups: 1,
        },
      },
    ]);

    // Assume `results` is the output from your MongoDB aggregation
    const processedCategories = results.map((category) => {
      const includedProductIds = new Set();
      const subcategoryGroups = category.subcategoryGroups.map((group: any) => {
        // Filter products to exclude those already included
        const filteredProducts = group.products.filter(
          (product: any) => !includedProductIds.has(product._id)
        );
        // Mark these products as included
        filteredProducts.forEach((product: any) =>
          includedProductIds.add(product._id)
        );
        return { ...group, products: filteredProducts };
      });
      return { ...category, subcategoryGroups };
    });
    return processedCategories;
  }
  public async create(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(categoryData);
    await category.save();
    return category;
  }

  public async deleteById(
    categoryId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const result = await Category.deleteOne({ _id: categoryId }).exec();
    return result.deletedCount > 0;
  }

  public async findAll(): Promise<ICategory[]> {
    return Category.find().exec();
  }

  public async findByName(categoryName: string): Promise<boolean> {
    const result = await Category.findOne({ categoryName: categoryName });
    return result !== null;
  }

  public async updateById(
    categoryId: mongoose.Types.ObjectId,
    updateData: Partial<ICategory> // Use Partial to indicate all properties are optional
  ): Promise<ICategory> {
    // Use findByIdAndUpdate to find the category by ID and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      {
        new: true, // Return the modified document rather than the original
        runValidators: true, // Ensures that your model's validations are considered before updating
      }
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return updatedCategory;
  }
}
