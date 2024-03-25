// src/use_cases/category/GetCategories.ts

import { ICategory } from "../../entities/Category";
import { ICategoryRepository } from "../../repositories/CategoryRepository";

export class GetCategories {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<ICategory[]> {
    return this.categoryRepository.findAll();
  }

  async categoryProducts(): Promise<ICategory[] | any[]>{
    return this.categoryRepository.categoryProduct()
  }
}
